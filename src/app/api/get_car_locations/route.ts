// pages/api/get_car_locations.ts
import { NextApiRequest, NextApiResponse } from "next";

// Mock data: In a real application, fetch from your database
const mockCarLocations = [
  { id: "car_1", latitude: 37.7749, longitude: -122.4194 }, // San Francisco
  { id: "car_2", latitude: 34.0522, longitude: -118.2437 }, // Los Angeles
  // Add more cars as needed
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(mockCarLocations);
}
