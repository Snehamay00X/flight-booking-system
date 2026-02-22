import FlightData from "../data/flight.json" assert { type: "json" };

export const getAllFlights = () => {
    const sectors = FlightData.data.result.sectors

    const flatFlights = Object.values(sectors)
        .flatMap(sector => Object.values(sector))

    return flatFlights
}
