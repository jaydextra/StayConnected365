const functions = require('firebase-functions');
const cors = require('cors')({ 
  origin: true,  // This allows all origins in development
  methods: ['GET', 'POST', 'OPTIONS'],  // Add GET to allowed methods
  allowedHeaders: ['Content-Type', 'Authorization', 'RT-AccessCode', 'RT-RequestID', 'RT-Timestamp', 'RT-Signature']
});
const axios = require('axios');
const crypto = require('crypto');
const stripe = require('stripe');
const admin = require('firebase-admin');
require('dotenv').config();

// Initialize admin
admin.initializeApp();

// Helper functions
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const calculateSignature = (timestamp, requestId, body) => {
  const apiKey = process.env.ESIM_API_KEY;
  const secretKey = process.env.ESIM_SECRET_KEY;
  
  const signData = `${timestamp}${requestId}${apiKey}${JSON.stringify(body)}`;
  return crypto
    .createHmac('sha256', secretKey)
    .update(signData)
    .digest('hex')
    .toUpperCase();
};

// HTTP Functions
exports.packageList = functions.https.onRequest((req, res) => {
  // Set CORS headers manually for preflight
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, RT-AccessCode, RT-RequestID, RT-Timestamp, RT-Signature');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  return cors(req, res, async () => {
    try {
      // Log the incoming request for debugging
      console.log('Request body:', req.body);
      console.log('Request headers:', req.headers);

      // Check if we have the API keys
      const apiKey = process.env.ESIM_API_KEY;
      const secretKey = process.env.ESIM_SECRET_KEY;

      if (!apiKey || !secretKey) {
        throw new Error('Missing API keys');
      }

      console.log('2. API Keys:', {
        hasApiKey: !!apiKey,
        hasSecretKey: !!secretKey
      });

      console.log('2. Passed CORS');
      
      const timestamp = Date.now().toString();
      const requestId = generateUUID();
      const body = {
        type: 'BASE'
      };

      const signature = calculateSignature(timestamp, requestId, body);

      console.log('3. Making eSIM API request with:', {
        apiKeyPresent: !!apiKey,
        signaturePresent: !!signature,
        requestId,
        timestamp,
        body
      });

      const response = await axios.post('https://api.esimaccess.com/api/v1/open/package/list', body, {
        headers: {
          'RT-AccessCode': apiKey,
          'RT-RequestID': requestId,
          'RT-Timestamp': timestamp,
          'RT-Signature': signature,
          'Content-Type': 'application/json'
        }
      });

      console.log('4. eSIM API Response:', response.data);
      res.json(response.data);
      
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });
});

exports.createPaymentIntent = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      const { amount } = req.body;
      
      if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount provided' });
      }

      const stripeClient = stripe(process.env.STRIPE_KEY);
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
});

exports.cancelEsim = functions.https.onRequest((req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  return cors(req, res, async () => {
    try {
      const { esimTranNo } = req.body;
      
      if (!esimTranNo) {
        throw new Error('Missing esimTranNo');
      }

      // Add your eSIM cancellation logic here
      // This will depend on your eSIM provider's API

      res.json({ success: true });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  });
});

exports.getUserEsims = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, RT-AccessCode, RT-RequestID, RT-Timestamp, RT-Signature');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  return cors(req, res, async () => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        throw new Error('Missing userId');
      }

      const timestamp = Date.now().toString();
      const requestId = generateUUID();
      const body = {
        pager: {
          pageNum: 1,
          pageSize: 20
        },
        type: 'BASE'
      };

      const signature = calculateSignature(timestamp, requestId, body);

      // Call the eSIM API to get the list
      const response = await axios.post('https://api.esimaccess.com/api/v1/open/esim/query', body, {
        headers: {
          'RT-AccessCode': process.env.ESIM_API_KEY,
          'RT-RequestID': requestId,
          'RT-Timestamp': timestamp,
          'RT-Signature': signature,
          'Content-Type': 'application/json'
        }
      });

      console.log('eSIM API Response:', response.data);

      res.json(response.data);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ 
        success: false,
        error: error.message,
        details: error.response?.data
      });
    }
  });
}); 