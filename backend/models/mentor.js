import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialty: { type: String, required: true },
  availableSlots: [{ type: Date }],
  mentorEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "MentorEvent"
  }]
}, { timestamps: true });

export default mongoose.model("Mentor", mentorSchema);
