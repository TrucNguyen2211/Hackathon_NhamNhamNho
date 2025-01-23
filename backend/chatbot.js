import OpenAI from "openai";
import dotenv from "dotenv";
import { franc } from "franc";

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
  {
    role: "system",
    content: "You are a warm and supportive chatbot acting as a close friend for females aged 18-28. Your primary role is as a reproductive health assistant, providing empathetic and accurate health advice. Maintain a friendly, approachable tone while staying professional when discussing health topics.",
  },
];

// Track if the user is entering for the first time
let isFirstInteraction = true;

// Function to detect the user's language
function detectLanguage(userInput) {
  // Using the franc library for better accuracy
  const langCode = franc(userInput);
  return langCode === "vie" ? "vi" : "en";
}

// Function to generate a warm welcome for first-time users
function getWarmWelcome(userLanguage) {
  const welcomeMessages = {
    en: "Hey there! 😊 I'm your virtual bestie specializing in reproductive health. Got questions or just need a chat? I'm here for you!",
    vi: "Chào bạn! 😊 Mình là người bạn ảo của bạn và chuyên về sức khỏe sinh sản. Có câu hỏi hay muốn tâm sự gì không? Mình luôn sẵn sàng!",
  };
  return welcomeMessages[userLanguage] || welcomeMessages.en;
}

// Function to determine the prompt type based on user input
function determinePromptType(userInput, userLanguage) {
  const keywordsForHealth = ["period", "contraception", "pregnancy", "health"];
  const keywordsForGeneralChat = ["stress", "relationship", "career", "advice"];

  // Adjust keywords for Vietnamese language
  const healthKeywords = userLanguage === "vi"
    ? ["kinh nguyệt", "tránh thai", "mang thai", "sức khỏe"]
    : keywordsForHealth;
  const generalKeywords = userLanguage === "vi"
    ? ["căng thẳng", "mối quan hệ", "nghề nghiệp", "lời khuyên"]
    : keywordsForGeneralChat;

  if (healthKeywords.some(keyword => userInput.toLowerCase().includes(keyword))) {
    return 3; // Health advice
  } else if (generalKeywords.some(keyword => userInput.toLowerCase().includes(keyword))) {
    return 2; // General personal chat
  } else {
    return 1; // Friendly casual chat
  }
}

// Function to generate dynamic prompts
function generatePrompt(userInput, type, userLanguage) {
  const prompts = {
    1: `You are a close friend providing casual, supportive responses. 
    Limit your response to one to three sentences and avoid being overly detailed:\n\nUser: ${userInput}\nAssistant:`,
    2: `You are a close friend giving empathetic personal advice. 
    Keep your response short and focus on the most important points, within two to four sentences:\n\nUser: ${userInput}\nAssistant:`,
    3: `You are a reproductive health assistant with a warm and friendly tone. Be concise and professional when discussing sensitive health topics.
    Provide only essential information in two to four sentences. 
    Use the following key facts to guide your response:\n\n
         - Average menstrual cycle length is 28 days (range: 21-35 days).\n
         - Ovulation occurs about 14 days before the next period.\n
         - Common contraceptives include birth control pills, condoms, and IUDs.\n\n
         User: ${userInput}\nAssistant:`,
  };

  // Add localization support
  const languageInstruction = userLanguage === "vi" ? "Respond in Vietnamese." : "Respond in English.";
  return `${languageInstruction}\n\n${prompts[type]}`;
}

// Sensitive topic
const sensitiveTopics = ["pregnancy", "pregnant", "giving birth", "sexual illness", "infection"];
const sensitiveTopicsVi = ["mang thai", "mang bầu", "sinh con", "bệnh tình dục", "nhiễm trùng"];

function checkSensitiveTopic(userInput, userLanguage) {
  const topics = userLanguage === "vi" ? sensitiveTopicsVi : sensitiveTopics;
  
  // Create regex patterns for each topic
  const regexPatterns = topics.map((topic) => new RegExp(`\\b${topic}\\b`, "i"));
  
  // Check if any pattern matches the input
  return regexPatterns.some((regex) => regex.test(userInput));
}

// Function to call OpenAI API
export async function getGPTResponse(userInput) {
  try {
    // Detect language
    const userLanguage = detectLanguage(userInput);

    // Automatically determine the prompt type
    const promptType = determinePromptType(userInput, userLanguage);

    // Generate the dynamic prompt
    const prompt = generatePrompt(userInput, promptType, userLanguage);

    // Add user query to the context
    context.push({ role: "user", content: prompt });

    // Manage context size to fit token limits (e.g., keep the last 20 messages)
    if (context.length > 20) {
      context.shift(); // Remove the oldest message
    }

    const maxTokens = checkSensitiveTopic(userInput, userLanguage) ? 100 : 300;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: context,
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    // Extract the AI response
    let aiResponse = response.choices[0].message.content.trim();

    // Append disclaimer for sensitive topics
    if (checkSensitiveTopic(userInput, userLanguage)) {
      aiResponse += userLanguage === "vi" 
        ? "\n\n**Mình nghĩ bạn nên đến cơ sở y tế gần nhất để kiểm tra thêm nhaaaa.**"
        : "\n\n**I highly recommend visiting a medical facility near your location for further check-up.**";
    }

    // Truncate response to ensure brevity
    aiResponse = aiResponse.slice(0, 500);

    // Add the AI's response to the context
    context.push({ role: "assistant", content: aiResponse });

    return { aiResponse, context };
  } catch (error) {
    console.error("Error calling OpenAI API:", error.response?.data || error.message);
    throw new Error("Failed to fetch response from OpenAI");
  }
}



