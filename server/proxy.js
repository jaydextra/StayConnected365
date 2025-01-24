const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Enable CORS for all routes
app.use(cors())

// Proxy middleware configuration
const proxyOptions = {
  target: 'https://api.esimaccess.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api/v1/open'
  },
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('RT-AccessCode', process.env.VITE_ESIM_API_KEY)
    if (req.body) {
      const bodyData = JSON.stringify(req.body)
      proxyReq.setHeader('Content-Type', 'application/json')
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData))
      proxyReq.write(bodyData)
    }
  }
}

// Use the proxy middleware
app.use('/api', createProxyMiddleware(proxyOptions))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`)
}) 