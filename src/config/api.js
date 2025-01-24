import axios from 'axios'

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
      const response = await api.post('/package/list', {
        type: 'BASE',
        locationCode: '!GL' // Get global packages
      })

      if (!response.data.success) {
        throw new Error(response.data.errorMessage || 'Failed to fetch packages')
      }

      return response.data.obj.packageList.map(formatPackageData)
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

// Keep the formatPackageData helper
const formatPackageData = (pkg) => {
  const basePrice = pkg.price / 10000
  const markup = 1.30
  const finalPrice = basePrice * markup

  return {
    id: pkg.packageCode,
    slug: pkg.slug,
    name: pkg.name,
    price: Number(finalPrice.toFixed(2)),
    currencyCode: pkg.currencyCode,
    data: pkg.volume / (1024 * 1024 * 1024),
    validityDays: pkg.unusedValidTime,
    duration: pkg.duration,
    durationUnit: pkg.durationUnit.toLowerCase(),
    description: pkg.description,
    speed: pkg.speed,
    smsSupported: pkg.smsStatus > 0,
    networks: pkg.locationNetworkList?.map(loc => ({
      country: loc.locationName,
      flag: loc.locationLogo,
      operators: loc.operatorList?.map(op => ({
        name: op.operatorName,
        type: op.networkType
      }))
    }))
  }
} 