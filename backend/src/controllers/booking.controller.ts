import { asyncHandler } from "../utils/asyncHandler.js";
import flightsSelected from "../models/flight.model.js";
import BookingDetails from "../models/booking.model.js";

export const bookingTickets = asyncHandler(async (req, res) => {
  const { searchId, traveller } = req.body;

  if (!searchId) {
    throw new Error("Search ID required");
  }

  if (!traveller) {
    throw new Error("Traveller details incomplete");
  }

  const selectedFlight = await flightsSelected.findOne({ searchId });

  if (!selectedFlight) {
    throw new Error("No selected flight found");
  }

  const bookingId = crypto.randomUUID();


const lockedPrice = Number(
  selectedFlight.selectedFare.price.pricePerAdult
);


  const booking = await BookingDetails.create({
    bookingId,
    searchId,
    tripType: selectedFlight.tripType,
    fullFlight: selectedFlight.fullFlightData,
    traveller,
    lockedPrice,
    status: "CONFIRMED"
  });

  return res.status(201).json({
    success: true,
    bookingId: booking.bookingId,
    lockedPrice: booking.lockedPrice,
    message: "Booking created successfully"
  });
});