import mongoose from "mongoose";

const userEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventType: {
    type: String,
    enum: ["UserMentorBooking", "UserPeriodData", "UserEvent"],
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.model("UserEvent", userEventSchema);
