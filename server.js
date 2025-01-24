require('dotenv').config()
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const crypto = require('crypto')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const app = express()

// Simple CORS setup - allow all origins for now
app.use(cors())
app.use(express.json())

const API_BASE_URL = 'https://api.esimaccess.com/api/v1/open'
const ACCESS_CODE = process.env.VITE_ESIM_API_KEY
const SECRET_KEY = process.env.VITE_ESIM_SECRET_KEY

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

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

// Update the payment intent endpoint
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ 
        error: 'Invalid amount provided' 
      })
    }

    // Check for Stripe's minimum amount requirement ($0.50)
    if (amount < 0.50) {
      return res.status(400).json({
        error: 'Amount must be at least $0.50 USD',
        code: 'amount_too_small',
        minAmount: 0.50
      })
    }

    console.log('Creating payment intent for amount:', amount)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        integration_check: 'accept_a_payment',
      },
    })

    console.log('Payment intent created:', paymentIntent.id)

    res.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (err) {
    console.error('Stripe Error:', err)
    res.status(500).json({ 
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err : undefined
    })
  }
})

app.post('/api/*', async (req, res) => {
  try {
    // Validate required environment variables
    if (!ACCESS_CODE || !SECRET_KEY) {
      throw new Error('Missing required environment variables')
    }

    const timestamp = Date.now().toString()
    const requestId = generateUUID()
    const signature = calculateSignature(timestamp, requestId, req.body)

    console.log('Making request to eSIM API:', {
      path: req.path,
      body: req.body,
      timestamp,
      requestId
    })

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

    console.log('eSIM API Response:', response.data)
    res.json(response.data)

  } catch (error) {
    console.error('Proxy Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    })

    res.status(error.response?.status || 500).json({ 
      success: false, 
      errorMessage: error.response?.data?.message || error.message || 'Failed to fetch data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`API Key configured: ${!!ACCESS_CODE}`)
  console.log(`Secret Key configured: ${!!SECRET_KEY}`)
  console.log('Stripe configured:', !!process.env.STRIPE_SECRET_KEY)
}) 