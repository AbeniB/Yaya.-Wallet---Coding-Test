require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');

const API_KEY = process.env.YAYA_API_KEY;
const API_SECRET = process.env.YAYA_API_SECRET;
const BASE_URL = process.env.YAYA_BASE_URL;

function signRequest({ timestamp, method, endpointPath, body }) {
    const preHashString = `${timestamp}${method.toUpperCase()}${endpointPath}${body}`;
    const hmac = crypto.createHmac('sha256', API_SECRET);
    hmac.update(preHashString);
    const digest = hmac.digest(); // This will return Buffer
  
    return digest.toString('base64');
}

async function sendRequest({ method, endpointPath, bodyObj }) {
    const methodUp = method.toUpperCase();
    const bodyStr = bodyObj ? JSON.stringify(bodyObj) : '';
    const timestamp = Date.now().toString(); // milliseconds

    const signature = signRequest({
        timestamp,
        method: methodUp,
        endpointPath,
        body: bodyStr
    });

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
            timeout: 10000
        });

        return resp.data;
    } catch (err) {
        if (err.response) {
            console.error(`HTTP ${err.response.status} response for ${methodUp} ${endpointPath}:`, err.response.data);
        } else {
            console.error(`Request error for ${methodUp} ${endpointPath}:`, err.message);
        }

        throw err;
    }
}

(async () => {
  try {
        console.log('\n1) GET /api/en/transaction/find-by-user');
    try {
        const findResp = await sendRequest({ method: 'GET', endpointPath: '/api/en/transaction/find-by-user', bodyObj: null });
        console.log('find-by-user response:', JSON.stringify(findResp, null, 2));
    } catch (e) {
        console.error(`Error in GET Request: ${e.message}`);
    }

        console.log('\n2) POST /api/en/transaction/search with query');
    try {
        const searchBody = { query: "7446ea12-7e50-418f-9c8f-03f2466f514f" };
        // const searchBody = { query: "YaYa PII SC" };
        //const searchBody = { query: "antenehgebey" };
        // const searchBody = { query: "Inapp Payment" };


        const searchResp = await sendRequest({ method: 'POST', endpointPath: '/api/en/transaction/search', bodyObj: searchBody });
        console.log('search response:', JSON.stringify(searchResp, null, 2));
    } catch (e) {
        console.error(`Error in GET Request: ${e.message}`);
    }

    console.log('\nData Fetching Done.');
  } catch (err) {
        console.error('Fatal error:', err);
  }
})();
