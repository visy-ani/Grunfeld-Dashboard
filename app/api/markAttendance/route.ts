import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, latitude, longitude } = await req.json();

    if (!name || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    console.log("Attendance marked for:", name, latitude, longitude);

    return NextResponse.json({ message: "Attendance marked successfully!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error"+ error }, { status: 500 });
  }
}
