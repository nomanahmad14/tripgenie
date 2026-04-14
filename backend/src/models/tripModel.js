import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  time: String,
  description: String,
  location: String
});

const daySchema = new mongoose.Schema({
  day: Number,
  title: String,
  activities: [activitySchema]
});

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    destination: {
      type: String,
      required: true
    },
    days: {
      type: Number,
      required: true
    },
    preferences: [String],
    itinerary: [daySchema]
  },
  {
    timestamps: true
  }
);

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;