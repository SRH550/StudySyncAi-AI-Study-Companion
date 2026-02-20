require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testAI() {
  console.log("Testing Gemini API...");
  console.log("API Key present:", !!process.env.GEMINI_API_KEY);

  if (!process.env.GEMINI_API_KEY) {
    console.error("ERROR: GEMINI_API_KEY is missing in .env");
    return;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // Testing the requested model first
  const modelsToTry = ['gemini-3-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-pro'];
  let workingModel = null;
  let workingModelName = null;

  // 1. Test Chat
  console.log("\n1. Testing Chat with multiple models...");

  for (const modelName of modelsToTry) {
    console.log(`\nTesting Model: ${modelName}...`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say hello.");
      const response = await result.response;
      console.log(`SUCCESS with ${modelName}:`, response.text());
      workingModel = model;
      workingModelName = modelName;
      break;
    } catch (error) {
      console.error(`FAILED with ${modelName}:`, error.message);
    }
  }

  if (!workingModel) {
    console.error("\nALL MODELS FAILED. Cannot proceed to Quiz test.");
    return;
  }

  console.log(`\nUsing working model: ${workingModelName}`);

  // 2. Test Quiz Generation (JSON)
  try {
    console.log("\n2. Testing Quiz Generation (using working model)...");
    const prompt = `
      Generate a quiz about "Science" with difficulty "easy".
      Create 2 multiple choice questions.
      Return the output strictly in JSON format with this structure:
      [
        {
          "question": "Question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "Option A"
        }
      ]
      Do not include markdown formatting like \`\`\`json. Just the raw JSON string.
    `;
    const result = await workingModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Raw Quiz Output:", text);

    // Simulating the cleanup logic from aiService.js
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    try {
      const json = JSON.parse(cleanedText);
      console.log("Parsed JSON:", JSON.stringify(json, null, 2));
      console.log("QUIZ GENERATION SUCCESS!");
    } catch (e) {
      console.error("JSON Parse Failed:", e.message);
    }
  } catch (error) {
    console.error("Quiz Failed:", error.message);
  }
}

testAI();
