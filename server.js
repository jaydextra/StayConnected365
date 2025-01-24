const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')

const app = express()
app.use(cors())
app.use(express.json())

const API_BASE_URL = 'https://api.esimaccess.com/api/v1/open'
const ACCESS_CODE = process.env.VITE_ESIM_API_KEY
const SECRET_KEY = process.env.VITE_ESIM_SECRET_KEY

app.post('/api/products', async (req, res) => {
  try {
    const requestId = crypto.randomUUID()
    const timestamp = Date.now().toString()
    const body = {
      locationCode: '',
      type: 'BASE',
      packageCode: '',
      iccid: ''
    }

    const response = await fetch(`${API_BASE_URL}/package/list`, {
      method: 'POST',
      headers: {
        'RT-AccessCode': ACCESS_CODE,
        'RT-RequestID': requestId,
        'RT-Timestamp': timestamp,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error('Server error:', error)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`)
}) 