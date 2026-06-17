const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

console.log("Key loaded:", process.env.GEMINI_API_KEY ? "YES" : "NO");
console.log("Key starts with:", process.env.GEMINI_API_KEY?.slice(0, 5));

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

    const result = await model.generateContent("Say hello in one short line.");

    console.log("Gemini Response:");
    console.log(result.response.text());
  } catch (error) {
    console.log("Gemini Error:");
    console.log(error.message);
  }
}

testGemini();