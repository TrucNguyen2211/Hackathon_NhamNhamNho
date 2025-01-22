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
    1: `You are a close friend providing casual, supportive responses:\n\nUser: ${userInput}\nAssistant:`,
    2: `You are a close friend giving empathetic personal advice:\n\nUser: ${userInput}\nAssistant:`,
    3: `You are a reproductive health assistant with a warm and friendly tone.  
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
const sensitiveTopics = ["pregnancy", "sexual illness", "infection"];
const sensitiveTopicsVi = ["mang thai", "bệnh tình dục", "nhiễm trùng"];

function checkSensitiveTopic(userInput, userLanguage) {
  const topics = userLanguage === "vi" ? sensitiveTopicsVi : sensitiveTopics;
  return topics.some((topic) => userInput.toLowerCase().includes(topic));
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

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: context,
      max_tokens: 300,
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

    // Add the AI's response to the context
    context.push({ role: "assistant", content: aiResponse });

    return { aiResponse, context };
  } catch (error) {
    console.error("Error calling OpenAI API:", error.response?.data || error.message);
    throw new Error("Failed to fetch response from OpenAI");
  }
}

// Example invocation
async function main() {
  const userInput = "Các biện pháp tránh thai nào phổ biến ở Việt Nam?";
  
  try {
    const { aiResponse, context } = await getGPTResponse(userInput);
    console.log("Chatbot Response:", aiResponse);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();

/*
This code snippet demonstrates how to create a chatbot using the OpenAI API to provide reproductive health advice. 
The chatbot can respond to user queries in multiple languages and handle sensitive topics appropriately.

1. Backend API

    Endpoint: http://localhost:3000/chat
    Method: POST
    Request Body: Send a JSON object with the user's message:

{ "userInput": "Your question here" }

Response: The chatbot replies with:

    { "message": "Chatbot's response here" }

2. Frontend Steps
Example HTML:

Add a simple chat interface:

<div id="chat-container">
  <input id="user-input" type="text" placeholder="Type your question..." />
  <button id="send-btn">Send</button>
  <div id="chat-log"></div>
</div>

Example JavaScript:

Handle user input and fetch chatbot responses:

document.getElementById("send-btn").addEventListener("click", async () => {
  const userInput = document.getElementById("user-input").value;
  if (!userInput) return;

  // Display user's message
  const chatLog = document.getElementById("chat-log");
  chatLog.innerHTML += `<div class="bubble user">${userInput}</div>`;

  // Fetch chatbot response
  try {
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userInput }),
    });
    const data = await response.json();

    // Display chatbot's message
    chatLog.innerHTML += `<div class="bubble bot">${data.message}</div>`;
  } catch (error) {
    console.error("Error:", error);
    chatLog.innerHTML += `<div class="bubble bot">Oops! Something went wrong.</div>`;
  }

  // Clear input field
  document.getElementById("user-input").value = "";
});

Example CSS (Optional):

Style the chat bubbles:

.bubble {
  margin: 5px;
  padding: 10px;
  border-radius: 10px;
  max-width: 70%;
}
.user {
  background-color: #d1f7c4;
  text-align: right;
  margin-left: auto;
}
.bot {
  background-color: #f0f0f0;
  text-align: left;
  margin-right: auto;
}

3. Testing

    Start the backend:

node index.js

Open the HTML file in a browser.
Type a question and click Send. The chatbot will reply in the chat log.
*/