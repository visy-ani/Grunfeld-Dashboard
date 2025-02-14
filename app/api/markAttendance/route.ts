// app/api/markAttendance/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Haversine formula to calculate distance (in meters)
const getDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371; // Earth radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Convert to meters
};

export async function POST(req: NextRequest) {
  const { latitude, longitude } = await req.json();

  try {
    // Fetch the assigned location from the API
    const assignedLocationResponse = await axios.get('http://localhost:3000/api/assignedLocation');
    const assignedLocation = assignedLocationResponse.data;

    // Calculate the distance between current location and assigned location
    const distance = getDistance(latitude, longitude, assignedLocation.latitude, assignedLocation.longitude);

    // Check if the user is within 10 meters of the assigned location
    if (distance > assignedLocation.tolerance) {
      return NextResponse.json(
        { message: 'Error: You are not within 10 meters of the admin location.' },
        { status: 400 }
      );
    }

    // Mark attendance here (for example, saving to a database)

    return NextResponse.json({ message: 'Attendance marked successfully.' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error occurred while marking attendance: ' + error },
      { status: 500 }
    );
  }
}
