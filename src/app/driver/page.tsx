"use client";

import React, { useState } from "react";

interface RideRequest {
  userId: string;
  location: string;
}

export default function DriverPage() {
  const [driverId] = useState("driver_456");
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);

  const fetchRequests = async () => {
    // In a real scenario, fetch from DB via /api
    // Simulate one random request:
    const randomRequest =
      Math.random() < 0.5
        ? [
            {
              userId: "user_123",
              location: "123 Main St",
            },
          ]
        : [];
    setRideRequests(randomRequest);
  };

  const acceptRide = async (userId: string) => {
    await fetch("/api/accept_ride", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ driver_ID: driverId, user_ID: userId }),
    });
    alert("Ride accepted for user " + userId);
    // Remove from list
    setRideRequests((prev) => prev.filter((r) => r.userId !== userId));
  };

  return (
    <div>
      <h1>Driver Dashboard</h1>
      <button onClick={fetchRequests}>Check for new ride requests</button>
      {rideRequests.length === 0 && <p>No current ride requests.</p>}
      {rideRequests.map((req) => (
        <div
          key={req.userId}
          style={{
            marginTop: "1rem",
            border: "1px solid #ccc",
            padding: "1rem",
          }}
        >
          <p>User: {req.userId}</p>
          <p>Location: {req.location}</p>
          <button onClick={() => acceptRide(req.userId)}>Accept Ride</button>
        </div>
      ))}
    </div>
  );
}
