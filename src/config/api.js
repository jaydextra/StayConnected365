import axios from 'axios'
import { planReference } from '../data/plans'

const isDev = import.meta.env.DEV
console.log('Environment:', isDev ? 'development' : 'production')

const API_BASE_URL = isDev 
  ? 'http://localhost:3001/api'
  : '/api'  // Use relative URL in production

console.log('API URL:', API_BASE_URL)

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Remove the signature calculation from frontend since it's handled by proxy
export const esimApi = {
  getProducts: async () => {
    try {
      // First get global plans
      const globalResponse = await api.post('/package/list', {
        type: 'BASE',
        locationCode: '!GL'
      })

      if (!globalResponse.data.success) {
        throw new Error(globalResponse.data.errorMessage || 'Failed to fetch global plans')
      }

      // Then get regional plans
      const regionalResponse = await api.post('/package/list', {
        type: 'BASE',
        locationCode: '!RG'
      })

      if (!regionalResponse.data.success) {
        throw new Error(regionalResponse.data.errorMessage || 'Failed to fetch regional plans')
      }

      // Combine and format all plans
      const allPlans = [
        ...(globalResponse.data.obj?.packageList || []),
        ...(regionalResponse.data.obj?.packageList || [])
      ]

      return allPlans.map(pkg => ({
        id: pkg.packageCode,
        name: pkg.name,
        slug: pkg.slug,
        price: pkg.price / 10000,
        data: pkg.volume / (1024 * 1024 * 1024),
        duration: pkg.duration,
        durationUnit: pkg.durationUnit.toLowerCase(),
        validity: pkg.unusedValidTime,
        speed: pkg.speed,
        smsSupported: pkg.smsStatus > 0,
        type: pkg.location.includes(',') ? 'Multi-Area' : 'Single',
        region: planReference.getRegion(pkg.location),
        coverage: pkg.location.split(',').map(code => planReference.getCountryName(code)),
        networks: pkg.locationNetworkList?.map(loc => ({
          country: loc.locationName,
          flag: loc.locationLogo,
          operators: loc.operatorList?.map(op => ({
            name: op.operatorName,
            type: op.networkType
          }))
        })),
        description: pkg.description,
        topupSupported: pkg.supportTopUpType === 2,
        breakoutIp: pkg.ipExport
      }))

    } catch (error) {
      console.error('API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      throw new Error(error.response?.data?.errorMessage || error.message || 'Failed to fetch products')
    }
  },

  purchaseEsim: async (packageInfo) => {
    try {
      // Step 1: Create the order
      const orderResponse = await api.post('/esim/order', {
        transactionId: `order-${Date.now()}`,
        packageInfoList: [{
          packageCode: packageInfo.id,
          count: 1,
          price: packageInfo.price * 10000
        }]
      })

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.errorMessage || 'Failed to create eSIM order')
      }

      const orderNo = orderResponse.data.obj.orderNo

      // Step 2: Query the order details (with retry logic for async processing)
      const maxRetries = 10
      const retryDelay = 3000 // 3 seconds
      
      for (let i = 0; i < maxRetries; i++) {
        try {
          const queryResponse = await api.post('/esim/query', {
            orderNo: orderNo,
            pager: {
              pageNum: 1,
              pageSize: 5  // Minimum allowed value is 5
            }
          })

          if (queryResponse.data.success && 
              queryResponse.data.obj?.esimList?.[0]) {
            const esim = queryResponse.data.obj.esimList[0]
            
            return {
              qrCode: esim.qrCodeUrl,
              activationCode: esim.ac,
              iccid: esim.iccid,
              imsi: esim.imsi,
              expiryDate: esim.expiredTime,
              status: esim.esimStatus,
              orderNo: esim.orderNo
            }
          }

          // If profiles are still being allocated, wait and retry
          if (queryResponse.data.errorCode === '200010') {
            await new Promise(resolve => setTimeout(resolve, retryDelay))
            continue
          }

          throw new Error(queryResponse.data.errorMessage || 'Failed to fetch eSIM details')
        } catch (error) {
          if (i === maxRetries - 1) throw error
          await new Promise(resolve => setTimeout(resolve, retryDelay))
        }
      }

      throw new Error('Timeout waiting for eSIM allocation')
    } catch (error) {
      console.error('eSIM Order Error:', error)
      throw new Error('Failed to complete eSIM purchase: ' + error.message)
    }
  },

  queryEsims: async ({ orderNo, iccid, pager }) => {
    try {
      const response = await api.post('/esim/query', {
        orderNo,
        iccid,
        pager
      })

      if (!response.data.success) {
        throw new Error(response.data.errorMessage || 'Failed to fetch eSIM details')
      }

      return response.data
    } catch (error) {
      console.error('Query eSIMs Error:', error)
      throw new Error('Failed to fetch eSIM details: ' + error.message)
    }
  },

  cancelEsim: async ({ esimTranNo }) => {
    try {
      const response = await api.post('/esim/cancel', {
        esimTranNo
      })

      if (!response.data.success) {
        throw new Error(response.data.errorMessage || 'Failed to cancel eSIM')
      }

      return response.data
    } catch (error) {
      console.error('Cancel eSIM Error:', error)
      throw new Error('Failed to cancel eSIM: ' + error.message)
    }
  }
}

// Helper to determine region from location codes
function getRegionFromLocation(location) {
  if (location === '!GL') return 'Global'
  if (location.includes(',')) {
    // Check location codes to determine region
    if (location.match(/US|CA|MX/)) return 'North America'
    if (location.match(/JP|KR|CN|HK/)) return 'East Asia'
    if (location.match(/GB|FR|DE|IT|ES/)) return 'Europe'
    // Add more region detection as needed
  }
  return 'Other'
} 