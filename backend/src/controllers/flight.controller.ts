import { asyncHandler } from "../utils/asyncHandler.js";
//import FlightData from "../data/flight.json" assert { type: "json" };
import { getAllFlights } from "../utils/getallFlights.js"
import connectDB from "../database/connectDB.js"
import flightsSelected from "../models/flight.model.js"



export const getFilters = asyncHandler(async (req, res) => {
  const flights = getAllFlights()
  const sourceSet = new Set<string>();
  const destinationSet = new Set<string>();
  const stopsSet = new Set<number>();
  let minPrice = Infinity;
  let maxPrice = 0;

  flights.forEach((flight) => {
    sourceSet.add(flight.flights[0].departureAirport.code)
    destinationSet.add(flight.flights[flight.flights.length - 1].arrivalAirport.code)
    stopsSet.add(flight.otherDetails.totalStops)

    flight.fares.forEach((fare) => {
      const price = Number(fare.price.pricePerAdult)
      if (price < minPrice) minPrice = price
      if (price > maxPrice) maxPrice = price
    })
  })

  res.json({
    sourceCities: [...sourceSet].sort(),
    destinationCities: [...destinationSet].sort(),
    tripTypes: ["one-way", "round-trip"],
    passengerLimits: { min: 1, max: 9 },
    priceRange: {
      min: minPrice,
      max: maxPrice,
    },
    stops: [...stopsSet].sort(),
    departureTimeRange: {
      earliest: "00:00",
      latest: "23:59",
    },

  })


})



export const searchedFlights = asyncHandler(async (req, res) => {
  const searchId = crypto.randomUUID();

  const {
    sourceCity,
    destinationCity,
    departureDate,
    returnDate,
    tripType = "one-way",
    passengersCount,
    minPrice,
    maxPrice,
    stops
  } = req.body;

  // ------------------ VALIDATION ------------------

  if (!sourceCity || !destinationCity) {
    throw new Error("Source and Destination are mandatory");
  }

  if (sourceCity === destinationCity) {
    throw new Error("Origin and destination cannot be the same");
  }

  if (passengersCount && Number(passengersCount) < 1) {
    throw new Error("Passenger count must be at least 1");
  }

  if (returnDate && departureDate && returnDate < departureDate) {
    throw new Error("Return date must be after departure date");
  }

  if (
    minPrice !== undefined &&
    maxPrice !== undefined &&
    Number(minPrice) > Number(maxPrice)
  ) {
    throw new Error("Min price cannot be greater than max price");
  }

  const flights = getAllFlights();

  const outFlight: any[] = [];
  const inFlight: any[] = [];

  const normalizedStops =
    stops !== undefined && stops !== "" ? Number(stops) : undefined;

  // ------------------ FILTERING ------------------

  flights.forEach((flight) => {
    if (!flight?.flights || !Array.isArray(flight.fares)) return;

    const origin = flight.flights[0].departureAirport.code;
    const destination =
      flight.flights[flight.flights.length - 1].arrivalAirport.code;

    const flightDate =
      flight.flights[0].departureAirport.time.split("T")[0];

    const journeyStops = flight.otherDetails.totalStops;

    if (departureDate && departureDate !== flightDate) return;

    if (
      normalizedStops !== undefined &&
      journeyStops !== normalizedStops
    ) return;

    const validFares = flight.fares
      .filter((fare) => {
        const price = Number(fare.price.pricePerAdult);

        if (minPrice !== undefined && price < Number(minPrice)) return false;
        if (maxPrice !== undefined && price > Number(maxPrice)) return false;

        return true;
      })
      .filter((fare) => {
        if (passengersCount !== undefined) {
          return (
            fare.fareIdentifiers.availableSeatCount >=
            Number(passengersCount)
          );
        }
        return true;
      });

    if (validFares.length === 0) return;

    const simpleFlightObj = {
      flightKey: flight.flUnqiueId,
      segments: flight.flights.map((seg: any) => ({
        airlineCode: seg.airlineCode,
        flightNumber: seg.fltNo,
        departureTime: seg.departureAirport.time,
        arrivalTime: seg.arrivalAirport.time,
        origin: seg.departureAirport.code,
        destination: seg.arrivalAirport.code,
        duration: seg.durationInMin
      })),
      stops: journeyStops,
      fares: validFares.map((fare) => ({
        fareId: fare.fareId,
        price: Number(fare.price.pricePerAdult)
      }))
    };

    if (origin === sourceCity && destination === destinationCity) {
      outFlight.push(simpleFlightObj);
    }

    if (origin === destinationCity && destination === sourceCity) {
      inFlight.push(simpleFlightObj);
    }
  });

  // ------------------ ONE WAY ------------------

  if (tripType !== "round-trip") {
    return res.json({
      searchId,
      flights: outFlight.map((f) => ({
        ...f,
        tripType: "one-way",
        totalPrice: f.fares[0]?.price || 0
      }))
    });
  }

  // ------------------ ROUND TRIP ------------------

  const combined: any[] = [];

  outFlight.forEach((out) => {
    inFlight.forEach((inn) => {
      const outArrival = new Date(
        out.segments[out.segments.length - 1].arrivalTime
      );

      const inDeparture = new Date(
        inn.segments[0].departureTime
      );

      if (inDeparture <= outArrival) return;

      combined.push({
        roundTripID: `${out.flightKey}_${inn.flightKey}`,
        tripType: "round-trip",
        outbound: out,
        return: inn,
        fares: {
          outbound: out.fares,
          return: inn.fares
        },
        totalPrice:
          (out.fares[0]?.price || 0) +
          (inn.fares[0]?.price || 0)
      });
    });
  });

  return res.json({
    searchId,
    flights: combined
  });
});

export const selectFlight = asyncHandler(async (req, res) => {
  const {
    searchId,
    flightKey,
    fareId,
    roundTripID,
    outbound,
    return: returnFlight
  } = req.body;

  if (!searchId) {
    throw new Error("Invalid search session");
  }

  const flights = getAllFlights();

  ////////////ONE WAY 
  if (flightKey && fareId) {


    const selectedFlight = flights.find(
      (f) => f.flUnqiueId === flightKey
    );

    if (!selectedFlight) {
      throw new Error("Flight not found");
    }

    const selectedFare = selectedFlight.fares.find(
      (f) => f.fareId === fareId
    );

    if (!selectedFare) {
      throw new Error("Fare not found");
    }

    //// storing in db
    
    await flightsSelected.create(
      {
        searchId,
        flightKey,
        tripType:"one-way",
        fullFlightData:selectedFlight,
        selectedFare:selectedFare
      }
    )


    /// returnin resposne
    return res.json({
      success: true,
      tripType: "one-way",
      searchId,
      flightKey,
      fareId,
      totalPrice: Number(selectedFare.price.pricePerAdult),
      message: "Flight selected successfully"
    });
  }

  ////// ROUND TRIP 
  if (roundTripID && outbound && returnFlight) {
    const outboundFlight = flights.find(
      (f) => f.flUnqiueId === outbound.flightKey
    );

    const returnFlightObj = flights.find(
      (f) => f.flUnqiueId === returnFlight.flightKey
    );

    if (!outboundFlight || !returnFlightObj) {
      throw new Error("Outbound or Return flight not found");
    }

    const outboundFare = outboundFlight.fares.find(
      (f) => f.fareId === outbound.fareId
    );

    const returnFare = returnFlightObj.fares.find(
      (f) => f.fareId === returnFlight.fareId
    );

    if (!outboundFare || !returnFare) {
      throw new Error("Fare not found");
    }

    const totalPrice =
      Number(outboundFare.price.pricePerAdult) +
      Number(returnFare.price.pricePerAdult);

    // storing in db

    await flightsSelected.create({
      searchId,
      tripType:"round-trip",
      flightKey,
      roundTripID:roundTripID,
      fullFlightData:{
        "outbound":outboundFlight,
        "inbound":returnFlightObj,
      },
      selectedFare:{
        "outbound":outboundFare,
        "inbound":returnFare
      }
    })


    return res.json({
      success: true,
      tripType: "round-trip",
      searchId,
      roundTripID,
      totalPrice,
      message: "Round trip selected successfully"
    });
  }
  throw new Error("Invalid selection payload");
});



