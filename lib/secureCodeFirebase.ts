import crypto from 'crypto';
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseClient"; 

export interface CodeData {
  code: string;
  generatedAt: number;
  expiresAt: number;
  isValid: boolean;
}

export async function generateAndStoreSecureCode(): Promise<CodeData> {
  const now = Date.now();
  const secureCode = crypto.randomBytes(3).toString('hex').toUpperCase();
  
  const codeData: CodeData = {
    code: secureCode,
    generatedAt: now,
    expiresAt: now + 120000, 
    isValid: true,
  };

  await setDoc(doc(db, "secureCodes", "current"), codeData);

  return codeData;
}

export async function validateSecureCode(userCode: string): Promise<{ valid: boolean; message: string; }> {
  const docRef = doc(db, "secureCodes", "current");
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return { valid: false, message: 'Our Hamsters are working on this feature...' };
  }

  const storedCode = docSnap.data() as CodeData;
  const now = Date.now();

  if (now > storedCode.expiresAt) {
    await updateDoc(docRef, { isValid: false });
    return { valid: false, message: 'The secure code has expired.' };
  }

  if (userCode.toUpperCase() === storedCode.code) {
    await updateDoc(docRef, { isValid: false });
    return { valid: true, message: 'Code valid!' };
  } else {
    return { valid: false, message: 'Incorrect secure code.' };
  }
}
