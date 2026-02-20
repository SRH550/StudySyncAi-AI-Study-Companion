require('dotenv').config();
const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const models = [
    'google/gemini-2.0-flash-lite-preview-02-05:free',
    'google/gemini-2.0-pro-exp-02-05:free',
    'meta-llama/llama-3.1-8b-instruct:free',
    'mistralai/mistral-7b-instruct:free',
    'microsoft/phi-3-mini-128k-instruct:free'
];

async function probeModels() {
    console.log("Probing OpenRouter models...");
    for (const model of models) {
        try {
            console.log(`Testing ${model}...`);
            const res = await axios.post(
                'https://openrouter.ai/api/v1/chat/completions',
                {
                    model: model,
                    messages: [{ role: 'user', content: 'hi' }]
                },
                {
                    headers: {
                        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'http://localhost:3000',
                        'X-Title': 'StudySyncAI Probe'
                    },
                    timeout: 5000
                }
            );
            if (res.data) {
                console.log(`✅ SUCCESS with ${model}`);
                process.exit(0);
            }
        } catch (err) {
            console.log(`❌ FAILED ${model}: ${err.response?.data?.error?.message || err.message}`);
        }
    }
    console.log("No working models found.");
}

probeModels();
