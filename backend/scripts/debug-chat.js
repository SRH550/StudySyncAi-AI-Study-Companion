// Quick debug test — runs against the live backend
require('dotenv').config();
const axios = require('axios');

// We need a valid auth token to test the protected routes
// First get a token by logging in, then test /api/ai/ask

async function debugChat() {
    const BASE = 'http://localhost:5000/api';

    // Step 1: Login to get a token
    console.log('Step 1: Logging in...');
    let token;
    try {
        const loginRes = await axios.post(`${BASE}/auth/login`, {
            email: 'raj@test.com',  // change if needed
            password: 'password123' // change if needed
        });
        token = loginRes.data.token;
        console.log('✅ Login OK, got token');
    } catch (e) {
        console.log('❌ Login failed:', e.response?.data?.message || e.message);
        console.log('   → Change email/password in this script to match your account');
        return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    // Step 2: Test simple "Hi" message
    console.log('\nStep 2: Testing casual "Hi" message...');
    try {
        const res = await axios.post(`${BASE}/ai/ask`, { question: 'Hi!' }, { headers, timeout: 35000 });
        console.log('✅ Got answer:', res.data.answer.substring(0, 150));
    } catch (e) {
        console.log('❌ Chat failed:', e.response?.data?.message || e.message);
        console.log('   Status:', e.response?.status);
    }
}

debugChat();
