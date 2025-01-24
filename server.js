require('dotenv').config()
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const crypto = require('crypto')

const app = express()

// Simple CORS setup - allow all origins for now
app.use(cors())
app.use(express.json())

const API_BASE_URL = 'https://api.esimaccess.com/api/v1/open'
const ACCESS_CODE = process.env.VITE_ESIM_API_KEY
const SECRET_KEY = process.env.VITE_ESIM_SECRET_KEY

// Helper function to generate UUID
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// Helper function to calculate signature
const calculateSignature = (timestamp, requestId, body) => {
  const signData = `${timestamp}${requestId}${ACCESS_CODE}${JSON.stringify(body)}`
  return crypto
    .createHmac('sha256', SECRET_KEY)
    .update(signData)
    .digest('hex')
    .toUpperCase()
}

app.post('/api/*', async (req, res) => {
  try {
    const timestamp = Date.now().toString()
    const requestId = generateUUID()
    const signature = calculateSignature(timestamp, requestId, req.body)

    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}${req.path.replace('/api', '')}`,
      headers: {
        'RT-AccessCode': ACCESS_CODE,
        'RT-RequestID': requestId,
        'RT-Timestamp': timestamp,
        'RT-Signature': signature,
        'Content-Type': 'application/json'
      },
      data: req.body
    })

    res.json(response.data)
  } catch (error) {
    console.error('Proxy Error:', error.response?.data || error.message)
    res.status(500).json({ 
      success: false, 
      errorMessage: 'Failed to fetch data'
    })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 