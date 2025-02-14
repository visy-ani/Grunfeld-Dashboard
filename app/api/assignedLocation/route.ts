import { NextResponse } from 'next/server';

let assignedLocation = {
  latitude: 12.8463043,
  longitude: 77.6650548,
  tolerance: 10, // in meters (10m)
};

export async function GET() {
  return NextResponse.json(assignedLocation);
}

export async function POST(req: Request) {
  try {
    const { latitude, longitude, tolerance } = await req.json();
    
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { error: 'Invalid latitude or longitude' },
        { status: 400 }
      );
    }
    
    assignedLocation = {
      latitude,
      longitude,
      tolerance: typeof tolerance === 'number' ? tolerance : 1000,
    };

    return NextResponse.json({
      message: 'Assigned location updated successfully',
      assignedLocation,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update assigned location: ' + error },
      { status: 500 }
    );
  }
}
