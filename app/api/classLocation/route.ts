import { NextResponse } from 'next/server';
import { Geodesic } from 'geographiclib-geodesic';
 

// Store single class location in memory
let classLocation = {
  coordinates: {
    latitude: 0,
    longitude: 0
  },
  toleranceMeters: 2000 // Default tolerance of 20 meters
};

// Function to calculate distance using GeographicLib (Karney’s Algorithm)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const geod = Geodesic.WGS84;
  const result = geod.Inverse(lat1, lon1, lat2, lon2);
  return result.s12 ?? 0; // Distance in meters
}

// Function to average multiple GPS readings for accuracy
function averageCoordinates(locations: { latitude: number; longitude: number }[]): { latitude: number; longitude: number } {
  const sum = locations.reduce(
    (acc, loc) => {
      acc.latitude += loc.latitude;
      acc.longitude += loc.longitude;
      return acc;
    },
    { latitude: 0, longitude: 0 }
  );

  const count = locations.length;
  return { latitude: sum.latitude / count, longitude: sum.longitude / count };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const rawLocations = url.searchParams.get('locations'); 

    if (!rawLocations) {
      return NextResponse.json({ success: false, error: 'Missing location data' }, { status: 400 });
    }

    const locations: { latitude: number; longitude: number }[] = JSON.parse(rawLocations);

    if (!Array.isArray(locations) || locations.length < 3) {
      return NextResponse.json({ success: false, error: 'Provide at least 3 location readings' }, { status: 400 });
    }

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

export async function POST(req: Request) {
  try {
    const { latitude, longitude, toleranceMeters } = await req.json();

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json({ success: false, error: 'Invalid latitude or longitude' }, { status: 400 });
    }

    classLocation = {
      coordinates: { latitude, longitude },
      toleranceMeters: typeof toleranceMeters === 'number' ? toleranceMeters : 2000
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
