import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  role: {
    type: String,
    enum: ["free", "standard", "premium"],
    default: "free",
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "locked"],
    default: "active",
  },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
