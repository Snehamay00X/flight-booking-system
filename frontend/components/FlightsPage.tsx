"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FlightsPage() {
    const router = useRouter();
    const [filters, setFilters] = useState<any>(null);
    const [flights, setFlights] = useState<any[]>([]);
    const [searchId, setSearchId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [sourceCity, setSourceCity] = useState("");
    const [destinationCity, setDestinationCity] = useState("");
    const [departureDate, setDepartureDate] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [passengersCount, setPassengersCount] = useState(1);
    const [tripType, setTripType] = useState("one-way");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [stops, setStops] = useState("");

    useEffect(() => {
        fetch("http://localhost:8000/api/flight/filters")
            .then(res => res.json())
            .then(data => {
                setFilters(data);
                setMinPrice(data.priceRange.min);
                setMaxPrice(data.priceRange.max);
            })
            .catch(console.error);
    }, []);

    async function handleSearch() {
        if (!sourceCity || !destinationCity) {
            alert("Select source and destination");
            return;
        }

        setLoading(true);

        const payload: any = {
            sourceCity,
            destinationCity,
            passengersCount: Number(passengersCount),
            tripType,
            minPrice: Number(minPrice),
            maxPrice: Number(maxPrice),
            stops: stops !== "" ? Number(stops) : undefined
        };

        if (departureDate) payload.departureDate = departureDate;
        if (tripType === "round-trip" && returnDate) payload.returnDate = returnDate;

        try {
            const res = await fetch("http://localhost:8000/api/flight/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Error");
                setFlights([]);
                setSearchId(null);
            } else {
                setSearchId(data.searchId);
                setFlights(Array.isArray(data.flights) ? data.flights : []);
            }
        } catch (err) {
            console.error(err);
            alert("Network error");
        }

        setLoading(false);
    }

    async function handleSelect(flight: any) {
        if (!searchId) {
            alert("Search first");
            return;
        }

        setLoading(true);

        const payload: any = { searchId };

        if (flight.tripType === "one-way") {
            payload.flightKey = flight.flightKey;
            payload.fareId = flight.fares[0]?.fareId;
        }

        if (flight.tripType === "round-trip") {
            payload.roundTripID = flight.roundTripID;
            payload.outbound = {
                flightKey: flight.outbound.flightKey,
                fareId: flight.fares.outbound[0]?.fareId
            };
            payload.return = {
                flightKey: flight.return.flightKey,
                fareId: flight.fares.return[0]?.fareId
            };
        }

        try {
            const res = await fetch("http://localhost:8000/api/flight/select", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Error");
                setLoading(false);
                return;
            }
        } catch (err) {
            console.error(err);
            alert("Network error");
            setLoading(false);
            return;
        }

        setLoading(false);
        localStorage.setItem("passengerCount", String(passengersCount));
        localStorage.setItem("searchId", searchId || "");
        router.push(`/traveller?searchId=${searchId}&count=${passengersCount}`);
    }

    if (!filters) return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #0f172a, #1e293b)", color: "white" }}>
            <p style={{ fontSize: "24px", opacity: 0.8 }}>Loading...</p>
        </div>
    );

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", background: "linear-gradient(135deg, #0f172a, #1e293b)", color: "white", padding: "40px 20px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
            <h1 style={{ fontSize: "40px", marginBottom: "30px", textAlign: "center" }}>Search Flights</h1>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "40px", backgroundColor: "rgba(0,0,0,0.3)", padding: "30px", borderRadius: "16px", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", maxWidth: "900px", width: "100%", alignItems: "flex-end" }}>

                <div style={{ display: "flex", flexDirection: "column", flex: "1 1 calc(33.333% - 20px)", minWidth: "150px", gap: "6px" }}>
                    <label style={{ fontSize: "14px", opacity: 0.9, fontWeight: 500, color: "#e2e8f0" }}>Source City</label>
                    <select style={{ padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "#1e293b", color: "white", fontSize: "16px", outline: "none", width: "100%", boxSizing: "border-box" }} value={sourceCity} onChange={e => setSourceCity(e.target.value)}>
                        <option value="">Select Origin</option>
                        {filters.sourceCities.map((c: string) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <div style={{ display: "flex", flexDirection: "column", flex: "1 1 calc(33.333% - 20px)", minWidth: "150px", gap: "6px" }}>
                    <label style={{ fontSize: "14px", opacity: 0.9, fontWeight: 500, color: "#e2e8f0" }}>Destination City</label>
                    <select style={{ padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "#1e293b", color: "white", fontSize: "16px", outline: "none", width: "100%", boxSizing: "border-box" }} value={destinationCity} onChange={e => setDestinationCity(e.target.value)}>
                        <option value="">Select Destination</option>
                        {filters.destinationCities.map((c: string) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <div style={{ display: "flex", flexDirection: "column", flex: "1 1 calc(33.333% - 20px)", minWidth: "150px", gap: "6px" }}>
                    <label style={{ fontSize: "14px", opacity: 0.9, fontWeight: 500, color: "#e2e8f0" }}>Trip Type</label>
                    <select style={{ padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "#1e293b", color: "white", fontSize: "16px", outline: "none", width: "100%", boxSizing: "border-box" }} value={tripType} onChange={e => setTripType(e.target.value)}>
                        {filters.tripTypes.map((t: string) => (
                            <option key={t} value={t}>{t === "one-way" ? "One Way" : "Round Trip"}</option>
                        ))}
                    </select>
                </div>

                <div style={{ display: "flex", flexDirection: "column", flex: "1 1 calc(33.333% - 20px)", minWidth: "150px", gap: "6px" }}>
                    <label style={{ fontSize: "14px", opacity: 0.9, fontWeight: 500, color: "#e2e8f0" }}>Departure Date</label>
                    <input style={{ padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "#1e293b", color: "white", fontSize: "16px", outline: "none", width: "100%", boxSizing: "border-box" }} type="date" value={departureDate} onChange={e => setDepartureDate(e.target.value)} />
                </div>

                {tripType === "round-trip" && (
                    <div style={{ display: "flex", flexDirection: "column", flex: "1 1 calc(33.333% - 20px)", minWidth: "150px", gap: "6px" }}>
                        <label style={{ fontSize: "14px", opacity: 0.9, fontWeight: 500, color: "#e2e8f0" }}>Return Date</label>
                        <input style={{ padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "#1e293b", color: "white", fontSize: "16px", outline: "none", width: "100%", boxSizing: "border-box" }} type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} />
                    </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", flex: "1 1 calc(33.333% - 20px)", minWidth: "150px", gap: "6px" }}>
                    <label style={{ fontSize: "14px", opacity: 0.9, fontWeight: 500, color: "#e2e8f0" }}>Passengers</label>
                    <input style={{ padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "#1e293b", color: "white", fontSize: "16px", outline: "none", width: "100%", boxSizing: "border-box" }} type="number" min={filters.passengerLimits.min} max={filters.passengerLimits.max} value={passengersCount} onChange={e => setPassengersCount(Number(e.target.value))} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", flex: "1 1 calc(33.333% - 20px)", minWidth: "150px", gap: "6px" }}>
                    <label style={{ fontSize: "14px", opacity: 0.9, fontWeight: 500, color: "#e2e8f0" }}>Stops</label>
                    <select style={{ padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "#1e293b", color: "white", fontSize: "16px", outline: "none", width: "100%", boxSizing: "border-box" }} value={stops} onChange={e => setStops(e.target.value)}>
                        <option value="">All Stops</option>
                        {filters.stops.map((stop: number) => (
                            <option key={stop} value={stop}>{stop === 0 ? "Non-stop" : `${stop} Stop(s)`}</option>
                        ))}
                    </select>
                </div>

                <div style={{ display: "flex", flexDirection: "column", flex: "1 1 calc(33.333% - 20px)", minWidth: "150px", gap: "6px" }}>
                    <label style={{ fontSize: "14px", opacity: 0.9, fontWeight: 500, color: "#e2e8f0" }}>Min Price: ₹{minPrice}</label>
                    <input style={{ width: "100%", padding: "10px 0" }} type="range" min={filters.priceRange.min} max={filters.priceRange.max} value={minPrice} onChange={e => setMinPrice(Number(e.target.value))} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", flex: "1 1 calc(33.333% - 20px)", minWidth: "150px", gap: "6px" }}>
                    <label style={{ fontSize: "14px", opacity: 0.9, fontWeight: 500, color: "#e2e8f0" }}>Max Price: ₹{maxPrice}</label>
                    <input style={{ width: "100%", padding: "10px 0" }} type="range" min={filters.priceRange.min} max={filters.priceRange.max} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} />
                </div>

                <div style={{ width: "100%", marginTop: "15px" }}>
                    <button style={{ padding: "14px 28px", fontSize: "16px", borderRadius: "8px", border: "none", cursor: "pointer", backgroundColor: "#3b82f6", color: "white", fontWeight: "bold", width: "100%", transition: "background 0.3s" }} onClick={handleSearch}>
                        {loading ? "Searching..." : "Search Flights"}
                    </button>
                </div>
            </div>

            {loading && !flights.length && <p style={{ fontSize: "18px", opacity: 0.8 }}>Loading flights...</p>}

            <div style={{ width: "100%", maxWidth: "800px", display: "flex", flexDirection: "column", gap: "20px" }}>
                {flights.map((flight, index) => (
                    <div key={index} style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", padding: "20px", marginBottom: "20px", width: "100%", maxWidth: "800px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)" }}>
                        <h3 style={{ borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: "10px", marginBottom: "15px", color: "#60a5fa", display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ fontSize: "28px" }}>✈️</span>
                            {flight.tripType === "round-trip" ? "🔄 Round Trip" : "One Way"}
                        </h3>

                        {flight.tripType === "one-way" && flight.segments.map((seg: any, i: number) => (
                            <div key={i} style={{ marginBottom: "10px", fontSize: "16px" }}>
                                <div style={{ fontWeight: "bold", marginBottom: "5px" }}>{seg.origin} → {seg.destination}</div>
                                <div style={{ opacity: 0.8, fontSize: "14px" }}>
                                    Departure: {new Date(seg.departureTime).toLocaleString()} <br />
                                    Arrival: {new Date(seg.arrivalTime).toLocaleString()}
                                </div>
                            </div>
                        ))}

                        {flight.tripType === "round-trip" && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                                <div style={{ flex: 1, minWidth: "250px" }}>
                                    <h4 style={{ color: "#a855f7", marginBottom: "10px" }}>🛫 Outbound</h4>
                                    {flight.outbound.segments.map((seg: any, i: number) => (
                                        <div key={i} style={{ marginBottom: "10px", fontSize: "14px", opacity: 0.9 }}>
                                            <strong style={{ fontSize: "16px" }}>{seg.origin} → {seg.destination}</strong><br />
                                            {new Date(seg.departureTime).toLocaleString()} <br />
                                            {new Date(seg.arrivalTime).toLocaleString()}
                                        </div>
                                    ))}
                                </div>
                                <div style={{ flex: 1, minWidth: "250px" }}>
                                    <h4 style={{ color: "#a855f7", marginBottom: "10px" }}>🛬 Return</h4>
                                    {flight.return.segments.map((seg: any, i: number) => (
                                        <div key={i} style={{ marginBottom: "10px", fontSize: "14px", opacity: 0.9 }}>
                                            <strong style={{ fontSize: "16px" }}>{seg.origin} → {seg.destination}</strong><br />
                                            {new Date(seg.departureTime).toLocaleString()} <br />
                                            {new Date(seg.arrivalTime).toLocaleString()}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: "20px", paddingTop: "15px", borderTop: "1px solid rgba(255,255,255,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ fontSize: "20px", fontWeight: "bold" }}>Total: ₹{Number(flight.totalPrice).toFixed(2)}</div>
                            <button style={{ padding: "10px 20px", fontSize: "16px", borderRadius: "8px", border: "none", cursor: "pointer", backgroundColor: "#3b82f6", color: "white", fontWeight: "bold", transition: "background 0.3s" }} onClick={() => handleSelect(flight)}>
                                Select Flight
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}