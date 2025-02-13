const { onRequest } = require('firebase-functions/v2/https');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');
const stripe = require('stripe');
const functions = require('firebase-functions');

const app = express();
app.use(cors());
app.use(express.json());

const API_BASE_URL = 'https://api.esimaccess.com/api/v1/open';
const stripeClient = stripe(functions.config().stripe.key);

// Helper functions
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const calculateSignature = (timestamp, requestId, body) => {
  const signData = `${timestamp}${requestId}${functions.config().esim.api_key}${JSON.stringify(body)}`;
  return crypto
    .createHmac('sha256', functions.config().esim.secret_key)
    .update(signData)
    .digest('hex')
    .toUpperCase();
};

// Routes
app.post('/package/list', async (req, res) => {
  try {
    const timestamp = Date.now().toString();
    const requestId = generateUUID();
    const signature = calculateSignature(timestamp, requestId, req.body);

    const response = await axios.post(`${API_BASE_URL}/package/list`, req.body, {
      headers: {
        'RT-AccessCode': functions.config().esim.api_key,
        'RT-RequestID': requestId,
        'RT-Timestamp': timestamp,
        'RT-Signature': signature,
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

exports.api = onRequest({ region: 'us-east1' }, app); 