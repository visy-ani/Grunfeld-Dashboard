// components/AuthProvider.tsx
"use client";

import { useEffect } from "react";
import { auth, db } from "@/lib/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get provider data (from GitHub)
        const providerData = user.providerData[0]; // GitHub provider data
        // For initial display, use displayName & photoURL; the GitHub username will be updated on login
        const defaultUsername = providerData?.displayName || providerData?.email || "";
        const defaultPhotoURL = providerData?.photoURL || "";

        // Retrieve extra form data (only present at first login)
        const storedFormData = localStorage.getItem("userFormData");
        const extraData = storedFormData ? JSON.parse(storedFormData) : null;

        // Reference to user profile document
        const userRef = doc(db, "profiles", user.uid);
        const userSnap = await getDoc(userRef);

        // Build the update object using extraData if available; otherwise, keep existing values
        const updateData: any = {
          name:
            (extraData && extraData.name) ||
            providerData?.displayName ||
            (userSnap.exists() ? userSnap.data().name : ""),
          // github_profile will be updated later in the login flow after fetching the GitHub username.
          github_profile: userSnap.exists() ? userSnap.data().github_profile || "" : "",
          roll_number:
            (extraData && extraData.rollNumber && extraData.rollNumber.trim() !== ""
              ? extraData.rollNumber
              : userSnap.exists() ? userSnap.data().roll_number : ""),
          academic_year:
            (extraData && extraData.academicYear && extraData.academicYear.trim() !== ""
              ? extraData.academicYear
              : userSnap.exists() ? userSnap.data().academic_year : ""),
          points: userSnap.exists() ? userSnap.data().points || 0 : 0,
          profile_image:
            defaultPhotoURL || (userSnap.exists() ? userSnap.data().profile_image : ""),
          lastLogin: serverTimestamp(),
        };

        if (userSnap.exists()) {
          await updateDoc(userRef, updateData);
        } else {
          await setDoc(userRef, {
            ...updateData,
            createdAt: serverTimestamp(),
          });
        }

        // Clear the stored form data after first login upsert
        if (storedFormData) {
          localStorage.removeItem("userFormData");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
};

export default AuthProvider;
