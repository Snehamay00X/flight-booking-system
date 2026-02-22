import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true
    },

    searchId: {
      type: String,
      required: true
    },

    tripType: {
      type: String,
      enum: ["one-way", "round-trip"],
      required: true
    },

    fullFlight: {
      type: Object,   
      required: true
    },

    traveller: {
      type: Object,
      required: true
    },

    lockedPrice: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      default: "CONFIRMED"
    }

  },
  { timestamps: true }
);

export default mongoose.model("BookingDetails", bookingSchema);