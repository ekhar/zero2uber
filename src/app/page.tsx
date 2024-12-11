// app/page.tsx or pages/index.tsx depending on your setup
"use client";

import React, { useState, useEffect } from "react";
import MapView from "./components/MapView";

interface RideStatus {
  userId: string;
  location: string;
  status: "idle" | "requested" | "accepted" | "complete" | "canceled";
  driverId?: string;
  eta?: number;
}

export default function HomePage() {
  const [userId] = useState("user_123"); // Hardcoded for simplicity
  const [location, setLocation] = useState("");
  const [rideStatus, setRideStatus] = useState<RideStatus>({
    userId,
    location: "",
    status: "idle",
  });

  const requestRide = async () => {
    if (!location) return;
    const res = await fetch("/api/request_ride", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_ID: userId, location }),
    });
    if (res.ok) {
      setRideStatus((prev) => ({ ...prev, status: "requested", location }));
    }
  };

  const pollStatus = async () => {
    if (rideStatus.status === "requested") {
      const accepted = Math.random() < 0.3; // 30% chance on each poll
      if (accepted) {
        const etaRes = await fetch(
          `/api/get_eta?point1=${encodeURIComponent(
            location,
          )}&point2=${encodeURIComponent(location)}`,
        );
        const { eta } = etaRes.ok ? await etaRes.json() : { eta: 5 };
        setRideStatus((prev) => ({ ...prev, status: "accepted", eta }));
      }
    }
  };

  const cancelRide = async () => {
    setRideStatus((prev) => ({ ...prev, status: "canceled" }));
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (rideStatus.status === "requested") {
      interval = setInterval(pollStatus, 5000); // poll every 5s
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [rideStatus.status]);

  const payForRide = async () => {
    const res = await fetch("/api/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_ID: userId }),
    });
    if (res.ok) {
      setRideStatus((prev) => ({ ...prev, status: "complete" }));
      alert("Payment complete!");
    }
  };

  // Define the initial map position (e.g., New York City)
  const initialMapPosition: [number, number] = [40.7128, -74.006]; // NYC coordinates

  return (
    <div>
      <h1>User Dashboard</h1>
      {rideStatus.status === "idle" && (
        <div>
          <p>Enter your pickup location:</p>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="123 Main St"
          />
          <button onClick={requestRide}>Request Ride</button>
        </div>
      )}
      {rideStatus.status === "requested" && (
        <div>
          <p>
            Ride requested at {rideStatus.location}. Waiting for a driver to
            accept...
          </p>
          <button onClick={cancelRide}>Cancel Ride</button>
        </div>
      )}
      {rideStatus.status === "accepted" && (
        <div>
          <p>Driver accepted! ETA: {rideStatus.eta} minutes</p>
          <p>
            We will notify you when driver arrives. You can cancel if you need
            to.
          </p>
          <button onClick={cancelRide}>Cancel Ride</button>
          <button onClick={payForRide}>Pay Now (on arrival)</button>
        </div>
      )}
      {rideStatus.status === "canceled" && (
        <div>
          <p>Ride canceled. You can request a new one.</p>
          <button
            onClick={() =>
              setRideStatus({ userId, location: "", status: "idle" })
            }
          >
            Request New Ride
          </button>
        </div>
      )}
      {rideStatus.status === "complete" && (
        <div>
          <p>Ride completed and paid. Thanks!</p>
          <button
            onClick={() =>
              setRideStatus({ userId, location: "", status: "idle" })
            }
          >
            New Ride
          </button>
        </div>
      )}

      {/* Integrate the MapView component */}
      <MapView initialPosition={initialMapPosition} />
    </div>
  );
}
