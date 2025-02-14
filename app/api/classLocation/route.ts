import { NextResponse } from 'next/server';

// Store single class location in memory
let classLocation = {
  coordinates: {
    latitude: 0,
    longitude: 0
  },
  toleranceMeters: 20 // Default tolerance of 20 meters
};

// Vincenty's formula for precise distance calculation
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const a = 6378137.0; // Semi-major axis (meters)
  const f = 1 / 298.257223563; // Flattening
  const b = (1 - f) * a;

  const φ1 = lat1 * (Math.PI / 180);
  const φ2 = lat2 * (Math.PI / 180);
  const L = (lon2 - lon1) * (Math.PI / 180);

  const U1 = Math.atan((1 - f) * Math.tan(φ1));
  const U2 = Math.atan((1 - f) * Math.tan(φ2));
  const sinU1 = Math.sin(U1), cosU1 = Math.cos(U1);
  const sinU2 = Math.sin(U2), cosU2 = Math.cos(U2);

  let λ = L, λPrev, iterations = 0;
  let sinλ, cosλ, sinσ, cosσ, σ, sinα, cos2α, C;

  do {
    sinλ = Math.sin(λ);
    cosλ = Math.cos(λ);
    sinσ = Math.sqrt((cosU2 * sinλ) ** 2 + (cosU1 * sinU2 - sinU1 * cosU2 * cosλ) ** 2);
    if (sinσ === 0) return 0; // Coincident points
    cosσ = sinU1 * sinU2 + cosU1 * cosU2 * cosλ;
    σ = Math.atan2(sinσ, cosσ);
    sinα = cosU1 * cosU2 * sinλ / sinσ;
    cos2α = 1 - sinα ** 2;
    C = (f / 16) * cos2α * (4 + f * (4 - 3 * cos2α));
    λPrev = λ;
    λ = L + (1 - C) * f * sinα * (σ + C * sinσ * (cos2α + C * cosσ * (-1 + 2 * cos2α ** 2)));
  } while (Math.abs(λ - λPrev) > 1e-12 && ++iterations < 100);

  const u2 = cos2α * ((a ** 2 - b ** 2) / (b ** 2));
  const A = 1 + (u2 / 16384) * (4096 + u2 * (-768 + u2 * (320 - 175 * u2)));
  const B = (u2 / 1024) * (256 + u2 * (-128 + u2 * (74 - 47 * u2)));
  const Δσ = B * sinσ * (cosσ + (B / 4) * (cos2α * (-1 + 2 * cosσ ** 2) - (B / 6) * cosσ * (-3 + 4 * sinσ ** 2) * (-3 + 4 * cos2α ** 2)));

  return b * A * (σ - Δσ); // Distance in meters
}

// GET endpoint verifies user location against stored class location
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userLat = parseFloat(url.searchParams.get('latitude') || '');
    const userLong = parseFloat(url.searchParams.get('longitude') || '');

    if (isNaN(userLat) || isNaN(userLong)) {
      return NextResponse.json({ success: false, error: 'Invalid user coordinates provided' }, { status: 400 });
    }

    const distance = calculateDistance(
      userLat,
      userLong,
      classLocation.coordinates.latitude,
      classLocation.coordinates.longitude
    );

    const isWithinRange = distance <= classLocation.toleranceMeters;

    return NextResponse.json({
      success: true,
      data: {
        isWithinRange,
        distance: Math.round(distance * 100) / 100,
        distanceMessage: `You are ${Math.round(distance)} meters from the class location`,
        userCoordinates: { latitude: userLat, longitude: userLong },
        classCoordinates: classLocation.coordinates,
        toleranceMeters: classLocation.toleranceMeters
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to verify location: ' + error }, { status: 500 });
  }
}

// POST endpoint for admin to update class location
export async function POST(req: Request) {
  try {
    const { latitude, longitude, toleranceMeters } = await req.json();

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json({ success: false, error: 'Invalid latitude or longitude' }, { status: 400 });
    }

    classLocation = {
      coordinates: { latitude, longitude },
      toleranceMeters: typeof toleranceMeters === 'number' ? toleranceMeters : 20
    };

    return NextResponse.json({
      success: true,
      message: 'Class location updated successfully',
      data: classLocation
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update class location: ' + error }, { status: 500 });
  }
}
