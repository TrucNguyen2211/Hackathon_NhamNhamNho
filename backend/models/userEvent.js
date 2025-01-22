import mongoose from "mongoose";

const UserEventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  eventType: {
    type: String,
    enum: ["UserBooking", "UserPeriod", "UserGeneralEvent"], // Updated event types
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    validate: {
      validator: function (value) {
        return value >= this.startDate;
      },
      message: "End date must be after start date."
    },
  },
  notes: {
    type: String,
    default: "",
  },
});

const UserEvent = mongoose.model("UserEvent", UserEventSchema);
export default UserEvent;