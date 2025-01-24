import axios from 'axios'
import { planReference } from '../data/plans'

const isDev = import.meta.env.DEV
const API_BASE_URL = 'http://localhost:3001/api'  // Always use local server

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

      // Then get regional plans
      const regionalResponse = await api.post('/package/list', {
        type: 'BASE',
        locationCode: '!RG'
      })

      // Combine and format all plans
      const allPlans = [
        ...globalResponse.data.obj.packageList,
        ...regionalResponse.data.obj.packageList
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
      console.error('API Error:', error)
      throw new Error('Failed to fetch products')
    }
  },

  purchaseEsim: async (packageInfo) => {
    try {
      const response = await api.post('/esim/order', {
        transactionId: `order-${Date.now()}`,
        packageInfoList: [{
          packageCode: packageInfo.id,
          count: 1,
          price: packageInfo.price * 10000
        }]
      })

      if (!response.data.success) {
        throw new Error(response.data.errorMessage || 'Failed to order eSIM')
      }

      return response.data.obj
    } catch (error) {
      console.error('Order Error:', error)
      throw new Error('Failed to complete purchase')
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