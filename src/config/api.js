import axios from 'axios'
import { planReference } from '../data/plans'

// For Firebase Functions, we'll use different base URLs
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://us-central1-stayconnected365-73277.cloudfunctions.net'
  : 'http://localhost:5001/stayconnected365-73277/us-central1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Export the configured API client
export const esimApi = {
  getProducts: async () => {
    try {
      console.log('Starting getProducts request');
      
      // Make a single request for all plans
      const response = await api.post('/packageList', {
        type: 'BASE'
      });
      
      console.log('Plans response:', response);

      if (!response.data.success) {
        throw new Error(response.data.errorMessage || 'Failed to fetch plans');
      }

      return response.data.obj?.packageList || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  purchaseEsim: async (packageInfo) => {
    try {
      // Step 1: Create the order
      const orderResponse = await api.post('/api/esim/order', {
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
          const queryResponse = await api.post('/api/esim/query', {
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
      const response = await api.post('/api/esim/query', {
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

export default API_BASE_URL; 