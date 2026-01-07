const { GoogleGenerativeAI } = require('@google/generative-ai');
const Interaction = require('../models/interaction.model');
const { getSystemContext } = require('../utils/chatbotContext');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function chatWithAI(req, res) {
  try {
    const { message } = req.body;
    const userId = req.user ? req.user._id : null; // Handle both logged-in and guest users

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // 1. Get Live Data
    const liveContext = await getSystemContext();

    // 2. Define the AI Persona
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `
      system: You are a Virtual Barista.
      YOUR KNOWLEDGE BASE:
      ${liveContext}

      RULES:
      1. Be helpful and concise.
      2. CRITICAL: When you recommend a specific item, you MUST append a special tag at the end of the sentence containing the Image, Name, and Price.
      
      FORMAT: {{REC:ImageURL|Name|Price}}
      
      Example: "I highly recommend the Ethiopian Yirgacheffe, it has a lovely floral aroma. {{REC:https://example.com/coffee.jpg|Ethiopian Yirgacheffe|350}}"
      
      3. Only use the image URLs and Prices provided in the knowledge base.
      
      user: ${message}
    `;



    // 3. Generate Response
    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    // 4. Save Interaction to Database (Using your existing Interaction model)
    // This satisfies the "Learn what users ask" goal in your model file
    await Interaction.create({
      user: userId,
      query: message,
      intent: 'general_chat', 
      response: aiResponse,
    });

    // 5. Send back to frontend
    res.status(200).json({ 
      response: aiResponse,
      message: 'Success' 
    });

  } catch (error) {
    console.error('Chatbot Error:', error);
    res.status(500).json({ 
      message: 'I am taking a quick coffee break. Please try again in a moment.',
      error: error.message 
    });
  }
}

module.exports = { chatWithAI };