const axios = require('axios');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const MODELS = [
    'nvidia/nemotron-4-340b-instruct:free',
    'nvidia/nemotron-3-nano-30b-a3b:free',
    'google/gemini-2.0-flash-exp:free',
    'meta-llama/llama-3.1-8b-instruct:free',
    'mistralai/mistral-7b-instruct:free'
];

const callOpenRouter = async (messages) => {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
        throw new Error('OPENROUTER_API_KEY is missing in environment variables');
    }

    let lastError = null;
    let limitReached = false;

    for (const model of MODELS) {
        try {
            console.log(`[AI] Requesting ${model}...`);
            const response = await axios.post(
                OPENROUTER_URL,
                {
                    model: model,
                    messages: messages,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'http://localhost:3000',
                        'X-Title': 'StudySyncAi',
                    },
                    timeout: 45000,
                }
            );

            if (response.data && response.data.choices && response.data.choices.length > 0) {
                console.log(`[AI] SUCCESS with ${model}`);
                return response.data.choices[0].message.content;
            }
        } catch (error) {
            const status = error.response?.status;
            let errorMsg = error.message;
            if (error.response?.data?.error) {
                errorMsg = error.response.data.error.message;
            }

            console.warn(`[AI] FAILED ${model} (Status: ${status}): ${errorMsg}`);
            lastError = errorMsg;

            if (status === 429 && errorMsg.includes('free-models-per-day')) {
                limitReached = true;
                break;
            }
            if (status === 401) break;
        }
    }

    if (limitReached) {
        throw new Error('OpenRouter Daily Free Limit Reached (50/50). The app will work again when the quota resets tomorrow.');
    }

    throw new Error(`AI Service Failed. Checked ${MODELS.length} models. Last error: ${lastError}`);
};

const generateResponse = async (prompt, context = '') => {
    const systemPrompt = `You are StudySync AI, a knowledgeable study assistant. 
Context from notes: ${context || 'None'}
Answer the user's question clearly and helpfully.
IMPORTANT: Reply in plain text only. Do NOT use markdown formatting (no asterisks, no hashes, no backticks).`;

    const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
    ];

    return await callOpenRouter(messages);
};

const generateSummary = async (content) => {
    const messages = [
        {
            role: 'user',
            content: `Provide a detailed and comprehensive summary of the following text. Capture all key points and main ideas:\n\n${content}`
        }
    ];
    return await callOpenRouter(messages);
};

const generateQuiz = async (topic, difficulty = 'medium') => {
    const messages = [
        {
            role: 'system',
            content: 'You are a quiz assistant. You MUST return a valid JSON array of objects. NO markdown, NO explanations, NO reasoning blocks. Just the raw JSON.'
        },
        {
            role: 'user',
            content: `Generate a quiz about "${topic}" with difficulty "${difficulty}".
            Create 5 multiple choice questions.
            Return ONLY the valid JSON array with this structure:
            [
              {
                "question": "text",
                "options": ["a", "b", "c", "d"],
                "correctAnswer": "exact match from options"
              }
            ]`
        }
    ];

    const text = await callOpenRouter(messages);

    let cleanedText = text
        .replace(/<think>[\s\S]*?<\/think>/gi, '')
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

    try {
        return JSON.parse(cleanedText);
    } catch {
        const match = cleanedText.match(/\[[\s\S]*\]/);
        if (match) {
            try {
                return JSON.parse(match[0]);
            } catch (innerErr) {
                console.error("Secondary JSON parse failed:", innerErr);
            }
        }
        console.error("Failed to parse AI response into JSON:", text);
        throw new Error("The AI returned an invalid quiz format. Please try again.");
    }
};

module.exports = {
    generateResponse,
    generateSummary,
    generateQuiz,
};
