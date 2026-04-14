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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    source: String,
    destination: {
      type: String,
      required: true
    },
    days: {
      type: Number,
      required: true
    },
    people: Number,
    budgetType: String,
    budget: {
      total: Number,
      distance: Number,
      breakdown: {
        stay: Number,
        food: Number,
        local: Number,
        travel: Number
      }
    },
    transport: String,
    preferences: [String],
    itinerary: [daySchema]
  },
  {
    timestamps: true
  }
);

tripSchema.index({ user: 1, createdAt: -1 });
tripSchema.index({ destination: "text" });

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;