const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:3001/api'  // Development
  : 'https://api.esimaccess.com/api/v1/open' // Production
const ACCESS_CODE = import.meta.env.VITE_ESIM_API_KEY
const SECRET_KEY = import.meta.env.VITE_ESIM_SECRET_KEY

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

export const esimApi = {
  // Get all products/plans
  getProducts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.errorMsg || 'Failed to fetch products')
      }

      return data.obj.packageList
    } catch (error) {
      console.error('Error fetching products:', error)
      throw new Error('Failed to fetch products')
    }
  },

  // Get specific product details
  getProduct: async (packageCode) => {
    try {
      const response = await fetch(`${API_BASE_URL}/package/list`, {
        method: 'POST',
        headers: {
          'RT-AccessCode': ACCESS_CODE,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'BASE',
          packageCode
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.errorMsg || 'Failed to fetch product details')
      }

      return data.obj.packageList[0]
    } catch (error) {
      console.error('Error fetching product:', error)
      throw new Error('Failed to fetch product details')
    }
  },

  // Purchase eSIM
  purchaseEsim: async (packageCode, count = 1) => {
    try {
      const transactionId = `txn_${Date.now()}`  // Generate unique transaction ID
      
      const response = await fetch(`${API_BASE_URL}/esim/order`, {
        method: 'POST',
        headers: {
          'RT-AccessCode': ACCESS_CODE,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transactionId,
          packageInfoList: [{
            packageCode,
            count
          }]
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.errorMsg || 'Failed to complete purchase')
      }

      return data.obj
    } catch (error) {
      console.error('Error purchasing eSIM:', error)
      throw new Error('Failed to complete purchase')
    }
  }
} 