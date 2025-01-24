import axios from 'axios'

const isDev = import.meta.env.DEV
const API_BASE_URL = isDev ? 'http://localhost:3001/api' : 'https://api.esimaccess.com/api/v1/open'
const ACCESS_CODE = import.meta.env.VITE_ESIM_API_KEY
const SECRET_KEY = import.meta.env.VITE_ESIM_SECRET_KEY

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'RT-AccessCode': ACCESS_CODE,
    'Content-Type': 'application/json'
  }
})

// Add timestamp and signature to every request
api.interceptors.request.use(async config => {
  const timestamp = Date.now().toString()
  const requestId = generateUUID()
  const body = config.data || {}
  
  // Calculate signature
  const signature = await calculateSignature(timestamp, requestId, body)

  // Add headers
  config.headers['RT-Timestamp'] = timestamp
  config.headers['RT-RequestID'] = requestId
  config.headers['RT-Signature'] = signature

  return config
})

// Helper function to generate UUID for RequestID
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// Helper function to calculate HMAC signature
const calculateSignature = async (timestamp, requestId, body) => {
  const signData = `${timestamp}${requestId}${ACCESS_CODE}${JSON.stringify(body)}`
  
  // Convert the message and secret to Uint8Array
  const encoder = new TextEncoder()
  const messageBuffer = encoder.encode(signData)
  const secretBuffer = encoder.encode(SECRET_KEY)

  // Create the HMAC-SHA256
  const key = await crypto.subtle.importKey(
    'raw',
    secretBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    messageBuffer
  )

  // Convert to hex string
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}

// Helper function to format package data
const formatPackageData = (pkg) => {
  // Base price from API (divided by 10000 as per API format)
  const basePrice = pkg.price / 10000
  
  // Add our markup (e.g., 30% markup)
  const markup = 1.30
  const finalPrice = basePrice * markup

  return {
    id: pkg.packageCode,
    slug: pkg.slug,
    name: pkg.name,
    // Format price to always show 2 decimal places and add markup
    price: Number(finalPrice.toFixed(2)),
    currencyCode: pkg.currencyCode,
    data: pkg.volume / (1024 * 1024 * 1024), // Convert bytes to GB
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
          price: packageInfo.price * 10000 // Convert back to API format
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