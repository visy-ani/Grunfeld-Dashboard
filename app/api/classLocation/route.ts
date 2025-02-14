import { NextResponse } from 'next/server';
import { Geodesic } from 'geographiclib-geodesic';

// In-memory storage for the class location (set by admin)
let classLocation = {
  coordinates: { latitude: 0, longitude: 0 },
  toleranceMeters: 2000 // Default tolerance
};

// Calculate distance (in meters) using GeographicLib (Karney’s algorithm)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const geod = Geodesic.WGS84;
  const result = geod.Inverse(lat1, lon1, lat2, lon2);
  return result.s12 ?? 0;
}

// Helper functions to convert between degrees and radians
function degreesToRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function radiansToDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

// Convert latitude/longitude to Earth-Centered, Earth-Fixed (ECEF) coordinates
function latLonToECEF(lat: number, lon: number): { x: number; y: number; z: number } {
  const a = 6378137.0; // Earth's semi-major axis in meters (WGS84)
  const e2 = 0.00669437999014; // Square of eccentricity for WGS84
  const radLat = degreesToRadians(lat);
  const radLon = degreesToRadians(lon);
  const N = a / Math.sqrt(1 - e2 * Math.sin(radLat) * Math.sin(radLat));
  const x = N * Math.cos(radLat) * Math.cos(radLon);
  const y = N * Math.cos(radLat) * Math.sin(radLon);
  const z = N * (1 - e2) * Math.sin(radLat);
  return { x, y, z };
}

// Convert ECEF coordinates back to latitude/longitude
function ecefToLatLon(x: number, y: number, z: number): { latitude: number; longitude: number } {
  const a = 6378137.0;
  const e2 = 0.00669437999014;
  const lon = Math.atan2(y, x);
  const p = Math.sqrt(x * x + y * y);
  let lat = Math.atan2(z, p * (1 - e2));
  let latPrev = 0;
  // Iteratively refine the latitude
  while (Math.abs(lat - latPrev) > 1e-10) {
    latPrev = lat;
    const N = a / Math.sqrt(1 - e2 * Math.sin(lat) * Math.sin(lat));
    lat = Math.atan2(z + e2 * N * Math.sin(lat), p);
  }
  return { latitude: radiansToDegrees(lat), longitude: radiansToDegrees(lon) };
}

/**
 * Average multiple GPS readings using ECEF conversion.
 * - Expects each location object to have:
 *    - latitude: number
 *    - longitude: number
 *    - provider: string (must be "gps")
 *    - accuracy?: number (optional, in meters)
 *
 * - Only readings with provider === 'gps' are used.
 * - Optionally, if accuracy is provided, readings with poor accuracy (e.g., >50 meters)
 *   are filtered out.
 */
function averageCoordinates(
  locations: { latitude: number; longitude: number; provider: string; accuracy?: number }[]
): { latitude: number; longitude: number } {
  // Filter out non-GPS readings
  const gpsReadings = locations.filter(loc => loc.provider === 'gps');

  if (gpsReadings.length === 0) {
    throw new Error('No valid GPS readings provided.');
  }

  // If available, filter out readings with poor accuracy (e.g., >50m)
  const accurateReadings = gpsReadings.filter(loc => typeof loc.accuracy === 'number' ? loc.accuracy <= 50 : true);

  const validReadings = accurateReadings.length > 0 ? accurateReadings : gpsReadings;

  let sumX = 0,
    sumY = 0,
    sumZ = 0;
  const count = validReadings.length;

  for (const loc of validReadings) {
    const { x, y, z } = latLonToECEF(loc.latitude, loc.longitude);
    sumX += x;
    sumY += y;
    sumZ += z;
  }

  const avgX = sumX / count;
  const avgY = sumY / count;
  const avgZ = sumZ / count;

  return ecefToLatLon(avgX, avgY, avgZ);
}

// GET endpoint: Verify if the averaged user location is within range of the class location
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const rawLocations = url.searchParams.get('locations');

    if (!rawLocations) {
      return NextResponse.json({ success: false, error: 'Missing location data' }, { status: 400 });
    }

    let locations;
    try {
      locations = JSON.parse(rawLocations);
    } catch (parseError) {
      return NextResponse.json({ success: false, error: 'Invalid JSON in locations'+parseError }, { status: 400 });
    }

    if (!Array.isArray(locations) || locations.length < 3) {
      return NextResponse.json({ success: false, error: 'Provide at least 3 location readings' }, { status: 400 });
    }

    // Compute the averaged location using only GPS readings
    const { latitude: userLat, longitude: userLong } = averageCoordinates(locations);

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

// POST endpoint: Update the class location (admin use)
export async function POST(req: Request) {
  try {
    const { latitude, longitude, toleranceMeters } = await req.json();

    if (
      typeof latitude !== 'number' ||
      typeof longitude !== 'number' ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
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
