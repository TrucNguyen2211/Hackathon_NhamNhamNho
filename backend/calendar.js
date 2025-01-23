import UserEvent from "./models/userEvent.js";
import Notification from "./models/notification.js";
import openai from "openai";
import { body, query, validationResult } from "express-validator";

// Middleware for input validation
export const validatePeriodInput = [
  query("userId").isMongoId().withMessage("Invalid User ID."),
  query("month").isInt({ min: 1, max: 12 }).withMessage("Month must be between 1 and 12"),
  query("year").isInt({ min: 1900 }).withMessage("Year is invalid"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

// Fetch User Period Checking
export const fetchUserPeriodChecking = async (req, res) => {
  const { userId, month, year } = req.query;
  try {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);

    const periodEvents = await UserEvent.find({
      userId,
      eventType: "UserPeriod",
      startDate: { $lte: endOfMonth },
      endDate: { $gte: startOfMonth },
    });

    const periodDays = periodEvents.flatMap((event) => {
      const dates = [];
      let current = new Date(event.startDate);
      while (current <= event.endDate) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      return dates;
    });

    res.status(200).json({ success: true, data: periodDays });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error fetching period data for user ${userId}: ${err.message}`,
    });
  }
};

// Fetch User Events
export const fetchUserEvents = async (req, res) => {
  const { userId } = req.query;
  try {
    const events = await UserEvent.find({ userId });
    res.status(200).json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error fetching events for user ${userId}: ${err.message}`,
    });
  }
};

// Adding Event
export const addEvent = async (req, res) => {
  const { userId, eventType, startDate, endDate, symptoms, notes } = req.body;
  try {
    const newEvent = new UserEvent({ userId, eventType, startDate, endDate, symptoms, notes });
    await newEvent.save();
    res.status(201).json({ success: true, data: newEvent });
  } catch (err) {
    res.status(500).json({ success: false, message: `Error adding event: ${err.message}` });
  }
};

// Adding Notification
export const addNotification = async (req, res) => {
  const { userId, message, type, priority } = req.body;
  try {
    const newNotification = new Notification({ userId, message, type, priority });
    await newNotification.save();
    res.status(201).json({ success: true, data: newNotification });
  } catch (err) {
    res.status(500).json({ success: false, message: `Error adding notification: ${err.message}` });
  }
};

// Announce Late Period
export const announceLatePeriod = async (req, res) => {
  const { userId } = req.body;
  try {
    await addEvent({ userId, eventType: "UserPeriod", startDate: new Date(), notes: "Late period reported" });
    await recalculatePeriod(userId);
    res.status(200).json({ success: true, message: "Late period reported and recalculated" });
  } catch (err) {
    res.status(500).json({ success: false, message: `Error announcing late period: ${err.message}` });
  }
};

// Recalculate Period
export const recalculatePeriod = async (userId) => {
  try {
    const periodData = await UserEvent.find({ userId, eventType: "UserPeriod" });
    const structuredData = periodData.map((event) => ({
      startDate: event.startDate,
      endDate: event.endDate,
    }));

    const prompt = `Based on the following menstrual data, predict the next period cycle:\n${JSON.stringify(structuredData)}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an assistant specializing in menstrual cycle predictions." },
        { role: "user", content: prompt },
      ],
      max_tokens: 100,
    });

    const nextPeriodDate = new Date(response.choices[0].message.content.trim());
    await addEvent({
      userId,
      eventType: "UserPeriod",
      startDate: nextPeriodDate,
    });
  } catch (error) {
    console.error("Error recalculating period:", error.message);
    throw error;
  }
};

// Calculate Period
export const calculatePeriod = async (req, res) => {
  const { userId, data } = req.body;
  try {
    const prompt = `Predict next menstrual cycle based on user input: ${JSON.stringify(data)}`;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an assistant specializing in menstrual cycle predictions." },
        { role: "user", content: prompt },
      ],
      max_tokens: 100,
    });

    const nextPeriodDate = new Date(response.choices[0].message.content.trim());
    await addEvent({ userId, eventType: "UserPeriod", startDate: nextPeriodDate });
    res.status(200).json({ success: true, message: "Period calculated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: `Error calculating period: ${err.message}` });
  }
};

/** 
1. Unit Testing

Objective: Test each function in isolation to ensure it behaves as expected.
Steps:

    Set Up Testing Framework:
        Use a framework like Jest or Mocha for Node.js.
        Install it:

    npm install --save-dev jest supertest

Write Unit Tests:

    Create a tests folder and add a test file, e.g., calendar.test.js.

Sample Unit Test File (calendar.test.js):

import request from "supertest";
import app from "../app.js"; // Your Express app
import { jest } from "@jest/globals";

describe("Calendar Module", () => {
  test("Fetch user period checking", async () => {
    const response = await request(app)
      .get("/calendar/user-period")
      .query({ userId: "validMongoId123", month: 3, year: 2025 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test("Add a new event", async () => {
    const response = await request(app)
      .post("/calendar/add-event")
      .send({
        userId: "validMongoId123",
        eventType: "UserPeriod",
        startDate: "2025-03-01",
        endDate: "2025-03-05",
        notes: "Test Event",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty("eventType", "UserPeriod");
  });

  test("Handle invalid input", async () => {
    const response = await request(app)
      .post("/calendar/add-event")
      .send({
        userId: "invalidId",
        eventType: "InvalidType",
        startDate: "InvalidDate",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});

Run Tests:

    npx jest

2. Integration Testing

Objective: Test the calendar module within the application.
Steps:

    Start the Application:

npm start

Use API Testing Tools:

    Use Postman or cURL to send requests to the calendar endpoints.
    Example Request for fetchUserPeriodChecking:
        URL: http://localhost:3000/calendar/user-period
        Method: GET
        Query Parameters:

            {
              "userId": "validMongoId123",
              "month": 3,
              "year": 2025
            }

    Verify Responses:
        Ensure the API returns:
            Correct HTTP status codes (e.g., 200, 400, 500).
            Expected JSON response structure.

    Simulate Edge Cases:
        Provide invalid userId or missing parameters.
        Test with large data sets or overlapping dates.

3. Debugging and Logging

Enable debugging to track issues during testing:

    Use a logger like Winston or debug in your code.
        Example with debug:

        import debug from "debug";
        const log = debug("calendar:log");
        log("Fetching user period checking for userId: %s", userId);

    Monitor application logs for errors or unexpected behavior.

4. Mocking OpenAI API

For calculatePeriod and recalculatePeriod, mock the OpenAI API to avoid unnecessary API calls:

    Use Jest Mocking:

    jest.mock("openai", () => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { content: "2025-03-01" } }],
          }),
        },
      },
    }));

    Include the mocked function in your test setup.

5. Validation Testing

Ensure validation middleware works as expected:

    Test invalid inputs:
        Missing or malformed userId.
        Invalid eventType, startDate, or endDate.
    Check error messages and status codes in responses.

6. Manual Testing

    Run the application locally:

npm start

Use Postman to:

    Add events.
    Fetch user periods.
    Calculate periods.
    Check error handling for invalid inputs.
*/

