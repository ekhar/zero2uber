import { NextResponse } from "next/server";

export async function GET() {
  // For simplicity, return a static ETA. In reality, calculate based on distance.
  return NextResponse.json({ eta: 5 });
}
