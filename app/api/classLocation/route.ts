import { NextResponse } from 'next/server';

// Store single class location in memory
let classLocation = {
  coordinates: {
    latitude: 0,
    longitude: 0
  },
  toleranceMeters: 20 // Default tolerance of 20 meters
};

// Haversine formula to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}

// GET endpoint now verifies user location against stored class location
export async function GET(req: Request) {
  try {
    // Get user's location from URL parameters
    const url = new URL(req.url);
    const userLat = parseFloat(url.searchParams.get('latitude') || '');
    const userLong = parseFloat(url.searchParams.get('longitude') || '');

    // Validate user coordinates
    if (isNaN(userLat) || isNaN(userLong)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid user coordinates provided'
      }, { status: 400 });
    }

    // Calculate distance between user and class location
    const distance = calculateDistance(
      userLat,
      userLong,
      classLocation.coordinates.latitude,
      classLocation.coordinates.longitude
    );

    // Check if user is within acceptable range
    const isWithinRange = distance <= classLocation.toleranceMeters;

    return NextResponse.json({
      success: true,
      data: {
        isWithinRange,
        distance: Math.round(distance * 100) / 100, 
        distanceMessage: `You are ${Math.round(distance)} meters from the class location`,
        userCoordinates: {
          latitude: userLat,
          longitude: userLong
        },
        classCoordinates: classLocation.coordinates,
        toleranceMeters: classLocation.toleranceMeters
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to verify location' + error
    }, { status: 500 });
  }
}

// POST endpoint for admin to update class location
export async function POST(req: Request) {
  try {
    const { latitude, longitude, toleranceMeters } = await req.json();

    // Validate coordinates
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Invalid latitude or longitude' },
        { status: 400 }
      );
    }

    // Update the stored location
    classLocation = {
      coordinates: {
        latitude,
        longitude
      },
      toleranceMeters: typeof toleranceMeters === 'number' ? toleranceMeters : 20
    };

    return NextResponse.json({
      success: true,
      message: 'Class location updated successfully',
      data: classLocation
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update class location: ' + error
      },
      { status: 500 }
    );
  }
}