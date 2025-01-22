import { body, validationResult } from "express-validator";

export const validateNotificationInput = [
    body("userId").isMongoId().withMessage("Invalid user ID."),
    body("message").isString().notEmpty().withMessage("Message is required."),
    body("type")
      .optional()
      .isIn(["Reminder", "Alert", "General"])
      .withMessage("Invalid notification type."),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      next();
    },
  ];
  