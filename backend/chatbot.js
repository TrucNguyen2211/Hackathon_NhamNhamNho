import OpenAI from "openai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Validate API key
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined in your .env file");
}

// Configure OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

// Initialize structured context
let context = [
  { role: "system", content: "You are a reproductive health assistant specializing in advice for Vietnamese women." },
];

// Function to generate dynamic prompts
function generatePrompt(userInput, type, userLanguage = "vi") {
  const prompts = {
    1: `You are an expert reproductive health assistant. Answer the following question accurately and concisely:\n\nUser: ${userInput}\nAssistant:`,
    2: `You are an assistant specializing in reproductive health for Vietnamese women. Include culturally relevant and practical advice:\n\nUser: ${userInput}\nAssistant:`,
    3: `You are a chatbot focused on reproductive health. Use the following key facts to guide your response:\n\n
         - Average menstrual cycle length is 28 days (range: 21–35 days).\n
         - Ovulation occurs about 14 days before the next period.\n
         - Common contraceptives include birth control pills, condoms, and IUDs.\n\n
         User: ${userInput}\nAssistant:`,
  };

  // Add localization support
  const languageInstruction = userLanguage === "vi" ? "Respond in Vietnamese." : "Respond in English.";
  return `${languageInstruction}\n\n${prompts[type]}`;
}

// Function to call OpenAI API
async function getGPTResponse(userInput, promptType, userLanguage = "vi") {
  try {
    // Generate the dynamic prompt
    const prompt = generatePrompt(userInput, promptType, userLanguage);

    // Add user query to the context
    context.push({ role: "user", content: prompt });

    // Manage context size to fit token limits (e.g., keep the last 20 messages)
    if (context.length > 20) {
      context.shift(); // Remove the oldest message
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", 
      messages: context,
      max_tokens: 150,
      temperature: 0.7,
    });

    // Extract the AI response
    const aiResponse = response.choices[0].message.content.trim();

    // Add the AI's response to the context
    context.push({ role: "assistant", content: aiResponse });

    return { aiResponse, context };
  } catch (error) {
    console.error("Error calling OpenAI API:", error.response?.data || error.message);
    throw new Error("Failed to fetch response from OpenAI");
  }
}

// Example Usage
(async () => {
  let context = ""; // Initialize an empty context for reinforcement
  const userInput = "What are the signs of ovulation?";
  const promptType = 3; // Change between 1, 2, or 3 to test dynamic prompts
  const { aiResponse, context: updatedContext } = await getGPTResponse(userInput, promptType, context);
  context = updatedContext; 
  console.log("AI Response:", aiResponse);
})();
