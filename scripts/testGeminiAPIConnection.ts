import { GoogleGenerativeAI } from '@google/generative-ai';

async function testGeminiAPIConnection() {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error('VITE_GEMINI_API_KEY is not set in environment variables.');
    process.exit(1);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        temperature: 0.1,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 50,
      },
    });

    const prompt = "Say hello to test Gemini API connection.";

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    console.log('Gemini API connection successful. Response:', text);
  } catch (error) {
    console.error('Gemini API connection failed:', error);
  }
}

testGeminiAPIConnection();
