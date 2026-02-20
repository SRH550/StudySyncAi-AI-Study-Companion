require('dotenv').config();

const key = process.env.GEMINI_API_KEY;

console.log("Checking API Key format...");

if (!key) {
    console.error("❌ Key is MISSING.");
} else {
    console.log(`✅ Key exists. Length: ${key.length}`);
    if (key.startsWith("AIza")) {
        console.log("✅ Key starts with 'AIza' (Correct prefix).");
    } else {
        console.error(`❌ Key starts with '${key.substring(0, 4)}...' (Incorrect prefix). Should start with 'AIza'.`);
    }

    if (key.includes(" ")) {
        console.error("❌ Key contains spaces. Please remove them.");
    } else {
        console.log("✅ Key contains no spaces.");
    }

    if (key.includes('"') || key.includes("'")) {
        console.error("⚠️ Key might contain quotes. Ensure they are not part of the key value in .env");
    }
}
