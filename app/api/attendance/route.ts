import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

const credentials = {
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Fix newlines
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_AUTH_URI,
  token_uri: process.env.GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
  universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
};


export async function POST(req: NextRequest) {
  console.log("Received a POST request for attendance");

  try {
    const { name, rollNumber } = await req.json();

    if (!name || !rollNumber) {
      return NextResponse.json(
        { error: "Name and Roll Number are required" },
        { status: 400 }
      );
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.SPREADSHEET_ID!;

    const checkRange = "Sheet1!B:B";
    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: checkRange,
    });
    const rows = getResponse.data.values || [];

    const attendanceExists = rows.some((row) => row[0] === rollNumber);

    if (attendanceExists) {
      return NextResponse.json(
        { error: "Attendance already recorded for this roll number" },
        { status: 400 }
      );
    }

    const range = "Sheet1!A:B";

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[name, rollNumber]],
      },
    });

    return NextResponse.json(
      { message: "Attendance recorded successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating sheet:", error);
    return NextResponse.json(
      { error: "Failed to update attendance" },
      { status: 500 }
    );
  }
}
