import mongoose from "mongoose";

const mentorEventSchema = new mongoose.Schema({
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", required: true },
  availableDate: { type: Date, required: true },
  booked: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("MentorEvent", mentorEventSchema);
