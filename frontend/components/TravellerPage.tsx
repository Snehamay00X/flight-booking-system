"use client";

import { useEffect, useState } from "react";

export default function TravellerPage() {
    const [searchId, setSearchId] = useState<string | null>(null);
    const [passengers, setPassengers] = useState<any[]>([]);

    useEffect(() => {
        const storedCount = Number(localStorage.getItem("passengerCount") || 1);
        const storedSearchId = localStorage.getItem("searchId");

        setSearchId(storedSearchId);

        const initialPassengers = Array.from({ length: storedCount }, () => ({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            dateOfBirth: "",
            gender: "",
            passportNumber: ""
        }));

        setPassengers(initialPassengers);
    }, []);

    function handleChange(index: number, field: string, value: string) {
        const updated = [...passengers];
        updated[index] = { ...updated[index], [field]: value };
        setPassengers(updated);
    }

    async function handleSubmit(e: any) {
        e.preventDefault();

        if (!searchId) {
            alert("Invalid booking session.");
            return;
        }

        if (passengers.length === 0) {
            alert("Add at least one passenger");
            return;
        }

        try {
            const res = await fetch("http://localhost:8000/api/booking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ searchId, traveller: passengers })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Booking failed");
                return;
            }

            alert("Booking Confirmed!");
        } catch (err) {
            console.error(err);
            alert("Network error");
        }
    }

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", background: "linear-gradient(135deg, #0f172a, #1e293b)", color: "white", padding: "40px 20px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
            <h1 style={{ fontSize: "40px", marginBottom: "30px", textAlign: "center" }}>👥 Traveller Details</h1>

            <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "700px" }}>
                {passengers.map((passenger, index) => (
                    <div key={index} style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px", padding: "30px", marginBottom: "20px", width: "100%", boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)" }}>
                        <h3 style={{ borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: "10px", marginBottom: "20px", color: "#60a5fa" }}>
                            Passenger {index + 1}
                        </h3>

                        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                            <div style={{ flex: "1 1 calc(50% - 15px)", minWidth: "200px" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", opacity: 0.8 }}>First Name</label>
                                <input style={{ padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "#1e293b", color: "white", fontSize: "16px", outline: "none", width: "100%", boxSizing: "border-box", marginBottom: "15px" }} type="text" placeholder="e.g. John" value={passenger.firstName} onChange={e => handleChange(index, "firstName", e.target.value)} required />
                            </div>
                            <div style={{ flex: "1 1 calc(50% - 15px)", minWidth: "200px" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", opacity: 0.8 }}>Last Name</label>
                                <input style={{ padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "#1e293b", color: "white", fontSize: "16px", outline: "none", width: "100%", boxSizing: "border-box", marginBottom: "15px" }} type="text" placeholder="e.g. Doe" value={passenger.lastName} onChange={e => handleChange(index, "lastName", e.target.value)} required />
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                            <div style={{ flex: "1 1 calc(50% - 15px)", minWidth: "200px" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", opacity: 0.8 }}>Email</label>
                                <input style={{ padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "#1e293b", color: "white", fontSize: "16px", outline: "none", width: "100%", boxSizing: "border-box", marginBottom: "15px" }} type="email" placeholder="e.g. john@example.com" value={passenger.email} onChange={e => handleChange(index, "email", e.target.value)} required />
                            </div>
                            <div style={{ flex: "1 1 calc(50% - 15px)", minWidth: "200px" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", opacity: 0.8 }}>Phone Number</label>
                                <input style={{ padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "#1e293b", color: "white", fontSize: "16px", outline: "none", width: "100%", boxSizing: "border-box", marginBottom: "15px" }} type="tel" placeholder="e.g. +1234567890" value={passenger.phone} onChange={e => handleChange(index, "phone", e.target.value)} required />
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                            <div style={{ flex: "1 1 calc(50% - 15px)", minWidth: "200px" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", opacity: 0.8 }}>Date of Birth</label>
                                <input style={{ padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "#1e293b", color: "white", fontSize: "16px", outline: "none", width: "100%", boxSizing: "border-box", marginBottom: "15px" }} type="date" value={passenger.dateOfBirth} onChange={e => handleChange(index, "dateOfBirth", e.target.value)} required />
                            </div>
                            <div style={{ flex: "1 1 calc(50% - 15px)", minWidth: "200px" }}>
                                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", opacity: 0.8 }}>Gender</label>
                                <select style={{ padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "#1e293b", color: "white", fontSize: "16px", outline: "none", width: "100%", boxSizing: "border-box", marginBottom: "15px" }} value={passenger.gender} onChange={e => handleChange(index, "gender", e.target.value)} required>
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ width: "100%" }}>
                            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", opacity: 0.8 }}>Passport Number (Optional)</label>
                            <input style={{ padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "#1e293b", color: "white", fontSize: "16px", outline: "none", width: "100%", boxSizing: "border-box", marginBottom: "15px" }} type="text" placeholder="Passport Number" value={passenger.passportNumber} onChange={e => handleChange(index, "passportNumber", e.target.value)} />
                        </div>
                    </div>
                ))}

                <button type="submit" style={{ padding: "16px 32px", fontSize: "18px", borderRadius: "8px", border: "none", cursor: "pointer", backgroundColor: "#3b82f6", color: "white", fontWeight: "bold", width: "100%", marginTop: "20px", boxShadow: "0 4px 6px rgba(0,0,0,0.2)", transition: "background 0.3s" }}>
                    Confirm Booking
                </button>
            </form>
        </div>
    );
}