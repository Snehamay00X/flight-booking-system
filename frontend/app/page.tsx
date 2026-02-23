"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        color: "white",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>
        ✈️ Flight Booking System
      </h1>

      <p style={{ fontSize: "18px", maxWidth: "600px", opacity: 0.8 }}>
        Search flights, compare fares, select your journey and complete your booking —
        all in one seamless experience.
      </p>

      <div
        style={{
          marginTop: "40px",
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <Link href="/flights">
          <button
            style={{
              padding: "14px 28px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              backgroundColor: "#3b82f6",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Search Flights
          </button>
        </Link>

        <Link href="/traveller">
          <button
            style={{
              padding: "14px 28px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "2px solid #3b82f6",
              cursor: "pointer",
              backgroundColor: "transparent",
              color: "#3b82f6",
              fontWeight: "bold",
            }}
          >
            Traveller Details
          </button>
        </Link>
      </div>

      <div style={{ marginTop: "60px", opacity: 0.6, fontSize: "14px" }}>
        Built with Next.js • Node.js • MongoDB
      </div>
    </div>
  );
}