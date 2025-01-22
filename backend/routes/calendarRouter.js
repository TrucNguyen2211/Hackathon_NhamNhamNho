import express from "express";
import {
  fetchUserPeriodChecking,
  fetchUserEvents,
  addEvent,
  addNotification,
  announceLatePeriod,
  calculatePeriod,
} from "../calendar.js";

const router = express.Router();

// Route to fetch user's period checking
router.get("/user-period", fetchUserPeriodChecking);

// Route to fetch user events
router.get("/user-events", fetchUserEvents);

// Route to add a new event
router.post("/add-event", addEvent);

// Route to add a new notification
router.post("/add-notification", addNotification);

// Route to announce late period
router.post("/announce-late-period", announceLatePeriod);

// Route to calculate the period using OpenAI API
router.post("/calculate-period", calculatePeriod);

export default router;