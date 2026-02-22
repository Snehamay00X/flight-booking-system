import mongoose from "mongoose";

const selectedFlightSchema = new mongoose.Schema(
  {
    searchId: {
      type: String,
      required: true,
    },

    tripType: {
      type: String,
      enum: ["one-way", "round-trip"],
      required: true,
    },

    flightKey: {
      type: String,
    },
    roundTripID:{
      type: String,
    },

    fullFlightData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    selectedFare: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("flightsSelected", selectedFlightSchema);