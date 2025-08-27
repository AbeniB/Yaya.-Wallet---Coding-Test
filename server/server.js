require('dotenv').config();
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

const API_KEY = process.env.YAYA_API_KEY;
const API_SECRET = process.env.YAYA_API_SECRET;
const BASE_URL = process.env.YAYA_BASE_URL;
const PORT = process.env.PORT || 4000;

function signRequest({ timestamp, method, endpointPath, body }) {
  const preHash = `${timestamp}${method.toUpperCase()}${endpointPath}${body}`;
  const hmac = crypto.createHmac('sha256', API_SECRET);
  hmac.update(preHash);
  return hmac.digest().toString('base64');
}

async function forwardRequest({ method, endpointPath, bodyObj }) {
  const methodUp = method.toUpperCase();
  const bodyStr = bodyObj ? JSON.stringify(bodyObj) : '';
  const timestamp = Date.now().toString(); // milliseconds
  const signature = signRequest({ timestamp, method: methodUp, endpointPath, body: bodyStr });

  const url = `${BASE_URL}${endpointPath}`;
  const headers = {
    'Content-Type': 'application/json',
    'YAYA-API-KEY': API_KEY,
    'YAYA-API-TIMESTAMP': timestamp,
    'YAYA-API-SIGN': signature
  };

  try {
    const resp = await axios({
      method: methodUp,
      url,
      headers,
      data: bodyStr ? bodyObj : undefined,
      timeout: 15000
    });
    return resp.data;
  } catch (err) {
    if (err.response) {
      const e = new Error('Upstream error from YaYa');
      e.status = err.response.status;
      e.body = err.response.data;
      throw e;
    } else {
      throw err;
    }
  }
}


app.get('/api/transactions/all', async (req, res) => {
  try {
    const endpointPath = '/api/en/transaction/find-by-user';
    const data = await forwardRequest({ method: 'GET', endpointPath, bodyObj: null });

    res.json(data);
  } catch (err) {
    console.error('Error in /api/transactions/all:', err.message || err);
    if (err.status && err.body) return res.status(err.status).json(err.body);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});


app.listen(PORT, () => console.log(`Backend proxy listening on http://localhost:${PORT}`));