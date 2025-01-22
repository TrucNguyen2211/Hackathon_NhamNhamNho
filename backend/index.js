import express from "express";
import dotenv from "dotenv";
import calendarRoutes from "./routes/calendarRouter.js";
import chatbotRoutes from "./routes/chatbotRouter.js";
import connectDB from "./utils/dbConnection.js";

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// API routes
app.use("/api/calendar", calendarRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
