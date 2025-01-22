import express from "express";
import { getGPTResponse } from "../chatbot.js";

const router = express.Router();

// Route to handle chatbot requests
router.post("/ask", async (req, res) => {
  try {
    const { userInput, promptType, userLanguage } = req.body;
    if (!userInput || !promptType) {
      return res.status(400).json({
        success: false,
        message: "userInput and promptType are required",
      });
    }
    
    const { aiResponse, context } = await getGPTResponse(userInput, promptType, userLanguage);
    res.status(200).json({ success: true, response: aiResponse, context });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to process request" });
  }
});

export default router;
