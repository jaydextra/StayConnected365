const express = require('express')
const cors = require('cors')
const axios = require('axios')
const crypto = require('crypto')
const stripe = require('stripe')
require('dotenv').config()

const app = express()

// More permissive CORS setup
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://stayconnected365-73277.web.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

app.use(express.json())

const API_BASE_URL = 'https://api.esimaccess.com/api/v1/open'
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY)

// Helper functions
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const calculateSignature = (timestamp, requestId, body) => {
  const signData = `${timestamp}${requestId}${process.env.ESIM_API_KEY}${JSON.stringify(body)}`;
  return crypto
    .createHmac('sha256', process.env.ESIM_SECRET_KEY)
    .update(signData)
    .digest('hex')
    .toUpperCase();
};

// Add at the top of your routes
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body
  });
  next();
});

// Routes
app.post('/api/package/list', async (req, res) => {
  try {
    const timestamp = Date.now().toString();
    const requestId = generateUUID();
    const signature = calculateSignature(timestamp, requestId, req.body);

    const response = await axios.post(`${API_BASE_URL}/package/list`, req.body, {
      headers: {
        'RT-AccessCode': process.env.ESIM_API_KEY,
        'RT-RequestID': requestId,
        'RT-Timestamp': timestamp,
        'RT-Signature': signature,
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Detailed API Error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    res.status(500).json({ error: error.message });
  }
});

// Payment intent creation
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount provided' });
    }

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      payment_method_types: ['card']
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)) 