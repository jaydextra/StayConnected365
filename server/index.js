const express = require('express')
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const API_BASE_URL = 'https://api.esimaccess.com/api/v1/open'

app.post('/api/packages', async (req, res) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/package/list`, req.body, {
      headers: {
        'RT-AccessCode': process.env.ESIM_API_KEY,
        'RT-Timestamp': req.headers['rt-timestamp'],
        'RT-RequestID': req.headers['rt-requestid'],
        'RT-Signature': req.headers['rt-signature'],
        'Content-Type': 'application/json'
      }
    })
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)) 