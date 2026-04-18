import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export const analyzeImage = async (base64Image, mimeType) => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error("Missing Gemini API Key in .env.local");
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = `
      Analyze this image (outfit or interior room).
      Provide a JSON response with exactly this structure:
      {
        "style": "A brief overall style description (e.g. Minimalist Streetwear)",
        "colorPalette": ["Hex1", "Hex2", "Hex3"],
        "objects": [
          { "name": "Black Leather Jacket", "searchQuery": "mens black leather biker jacket" },
          { "name": "White Sneakers", "searchQuery": "white minimalist sneakers" }
        ],
        "tags": ["streetwear", "leather", "casual"]
      }
      Do not include markdown code block syntax (like \`\`\`json) in your response. Just return the raw JSON.
    `;

    const parts = [
      { text: prompt },
      {
        inlineData: {
          data: base64Image,
          mimeType
        }
      }
    ];

    const result = await model.generateContent(parts);
    const responseText = result.response.text();
    const cleanJsonString = responseText.replace(/```json|```/g, '').trim();
    
    return JSON.parse(cleanJsonString);
  } catch (error) {
    console.error('Gemini Analysis Error:', error);
    throw error;
  }
};
