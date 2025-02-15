import { NextResponse } from 'next/server';
import axios from 'axios';
import { validateSecureCode } from '@/lib/secureCodeFirebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';

export async function POST(request: Request) {
  try {
    const { code: userCode, uid } = await request.json();

    if (!uid) {
      return NextResponse.json(
        { valid: false, message: "User ID not provided." },
        { status: 400 }
      );
    }

    const result = await validateSecureCode(userCode);
    if (!result.valid) {
      return NextResponse.json(
        { valid: false, message: result.message },
        { status: 400 }
      );
    }
    
    const userRef = doc(db, "profiles", uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return NextResponse.json(
        { valid: false, message: 'User profile not found.' },
        { status: 400 }
      );
    }
    
    const userData = userSnap.data();
    const attendanceData = {
      name: userData.name || "No Name",
      rollNumber: userData.roll_number || "No Roll Number"
    };

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const attendanceUrl = new URL('/api/attendance', baseUrl);


    let attendanceResult;
    try {
      const axiosResponse = await axios.post(attendanceUrl.toString(), attendanceData, {
        headers: { "Content-Type": "application/json" },
      });
      attendanceResult = axiosResponse.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          return NextResponse.json(
            { valid: true, message: `${error.response.data.error || ''}` },
            { status: 500 }
          );
        }
        return NextResponse.json(
          { valid: false, message: `Error making attendance request: ${error.message}` },
          { status: 500 }
        );
      } else if (error instanceof Error) {
        return NextResponse.json(
          { valid: false, message: `Error making attendance request: ${error.message}` },
          { status: 500 }
        );
      } else {
        return NextResponse.json(
          { valid: false, message: `Unknown error making attendance request.` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      valid: true,
      message: `${attendanceResult.message}`,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { valid: false, message: 'Invalid request. ' + error.message + "abs" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { valid: false, message: 'Invalid request. Unknown error occurred.' },
      { status: 400 }
    );
  }
}
