import { body, validationResult } from "express-validator";

export const validateEventInput = [
  body("userId").isMongoId().withMessage("Invalid user ID."),
  body("eventType").isIn(["UserBooking", "UserPeriod", "UserGeneralEvent"]).withMessage("Invalid event type."),
  body("startDate").isISO8601().withMessage("Invalid start date."),
  body("endDate")
    .optional()
    .isISO8601()
    .custom((value, { req }) => {
      if (value < req.body.startDate) {
        throw new Error("End date must be after start date.");
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];
