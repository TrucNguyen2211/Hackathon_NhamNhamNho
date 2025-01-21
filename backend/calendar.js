import UserEvent from "../models/userEvent.js";
import Notification from "../models/notification.js";
import openai from "openai";

// Fetch User Period Checking
export const fetchUserPeriodChecking = async (req, res) => {
  const { userId, month, year } = req.query;
  try {
    const periodEvents = await UserEvent.find({
      userId,
      eventType: "UserPeriodData",
    });

    const periodDays = periodEvents.flatMap((event) => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate || event.startDate);
      const dates = [];
      while (startDate <= endDate) {
        if (startDate.getMonth() + 1 === parseInt(month) && startDate.getFullYear() === parseInt(year)) {
          dates.push(new Date(startDate));
        }
        startDate.setDate(startDate.getDate() + 1);
      }
      return dates;
    });

    res.status(200).json({ success: true, data: periodDays });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching period data" });
  }
};

// Fetch User Events
export const fetchUserEvents = async (req, res) => {
  const { userId } = req.query;
  try {
    const events = await UserEvent.find({ userId });
    res.status(200).json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching events" });
  }
};

// Adding Event
export const addEvent = async (req, res) => {
  const { userId, eventType, startDate, endDate, notes } = req.body;
  try {
    const newEvent = new UserEvent({ userId, eventType, startDate, endDate, notes });
    await newEvent.save();
    res.status(201).json({ success: true, data: newEvent });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error adding event" });
  }
};

// Adding Notification
export const addNotification = async (req, res) => {
  const { userId, message } = req.body;
  try {
    const newNotification = new Notification({ userId, message });
    await newNotification.save();
    res.status(201).json({ success: true, data: newNotification });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error adding notification" });
  }
};

// Announce Late Period
export const announceLatePeriod = async (req, res) => {
  const { userId } = req.body;
  try {
    await addEvent({ userId, eventType: "UserEvent", startDate: new Date(), notes: "Late period reported" });
    await recalculatePeriod(userId);
    res.status(200).json({ success: true, message: "Late period reported and recalculated" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error announcing late period" });
  }
};

// Recalculate Period
export const recalculatePeriod = async (userId) => {
  const periodData = await UserEvent.find({ userId, eventType: "UserPeriodData" });
  const prompt = `Based on user's past menstrual data: ${JSON.stringify(periodData)}, predict next cycle.`;
  const response = await openai.Completion.create({ engine: "text-davinci-003", prompt, max_tokens: 100 });
  const nextPeriodDate = new Date(response.choices[0].text.trim());
  await addEvent({ userId, eventType: "UserPeriodData", startDate: nextPeriodDate });
};

// Calculate Period
export const calculatePeriod = async (req, res) => {
  const { userId, data } = req.body;
  try {
    const prompt = `Predict next menstrual cycle based on user input: ${JSON.stringify(data)}`;
    const response = await openai.Completion.create({ engine: "text-davinci-003", prompt, max_tokens: 100 });
    const nextPeriodDate = new Date(response.choices[0].text.trim());
    await addEvent({ userId, eventType: "UserPeriodData", startDate: nextPeriodDate });
    res.status(200).json({ success: true, message: "Period calculated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error calculating period" });
  }
};
