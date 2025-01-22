import express from "express";
import { getGPTResponse } from "../chatbot.js";

const router = express.Router();

// Route to handle chatbot requests
router.post("/ask", async (req, res) => {
  try {
    const { userInput } = req.body;
    
    if (!userInput) {
      return res.status(400).json({
        success: false,
        message: "userInput is required",
      });
    }

    const { aiResponse, context } = await getGPTResponse(userInput);
    
    res.status(200).json({ success: true, response: aiResponse, context });
  } catch (error) {
    console.error("Error processing chatbot request:", error.message);
    res.status(500).json({ success: false, message: `Failed to process request: ${error.message}` });
  }
});

export default router;
