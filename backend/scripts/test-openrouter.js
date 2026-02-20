require('dotenv').config();
const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = 'google/gemini-2.0-flash-exp:free';

async function testOpenRouter() {
    console.log("Testing OpenRouter API...");
    console.log("API Key present:", !!OPENROUTER_API_KEY);

    if (!OPENROUTER_API_KEY) {
        console.error("❌ OPENROUTER_API_KEY is missing in .env");
        return;
    }

    try {
        console.log(`Sending request to ${MODEL}...`);
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: MODEL,
                messages: [
                    { role: 'user', content: 'Say hello!' }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:3000',
                    'X-Title': 'StudySyncAi Test Script',
                }
            }
        );

        console.log("✅ Custom Test Success!");
        console.log("Response:", response.data.choices[0].message.content);

    } catch (error) {
        console.error("❌ Test Failed:", error.response ? error.response.data : error.message);
    }
}

testOpenRouter();
