const { GoogleGenerativeAI } = require('@google/generative-ai');
const Menu = require('../models/menu.model');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function brewAIRecommendation(req, res) {
  try {
    const { mood, taste, timeOfDay } = req.body;
    const menuItems = await Menu.find({ isAvailable: true });
    
    // Provide menu context to Gemini to prevent hallucinations
    const menuContext = menuItems.map(item => 
      `${item.name}: ${item.description} (Price: ₹${item.price})`
    ).join('\n');

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "You are the Rabuste Brew AI. Based on Mood, Taste, and Time, pick ONE menu item. Return ONLY JSON: {\"itemName\": \"Name\", \"reason\": \"1-sentence funky reason\", \"matchPercentage\": 95}"
    });

    const prompt = `Match a drink for: Mood: ${mood}, Taste: ${taste}, Time: ${timeOfDay}. \nMenu Data:\n${menuContext}`;
    const result = await model.generateContent(prompt);
    const recommendation = JSON.parse(result.response.text().replace(/```json|```/g, ""));
    const fullItem = menuItems.find(i => i.name === recommendation.itemName);

    res.status(200).json({ ...recommendation, itemData: fullItem });
  } catch (error) {
    console.error("Brew AI Error:", error);
    res.status(500).json({ message: "Brewing error" });
  }
}

module.exports = { brewAIRecommendation };