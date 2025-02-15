import { NextResponse } from 'next/server';
import { generateAndStoreSecureCode } from '@/lib/secureCodeFirebase';

export async function GET() {
  try {
    const codeData = await generateAndStoreSecureCode();
    return NextResponse.json(codeData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate secure code."+error }, { status: 500 });
  }
}
