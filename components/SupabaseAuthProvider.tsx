// components/AuthProvider.tsx
"use client";

import { useEffect } from "react";
import { auth, db } from "@/lib/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get GitHub data from user object.
        // Firebase Auth user object may contain additional info in providerData.
        const providerData = user.providerData[0]; // GitHub provider data
        const githubUsername = providerData?.displayName || providerData?.email || "";
        const githubPhotoURL = providerData?.photoURL || "";
        // Retrieve extra form data (if any) stored during login
        const storedFormData = localStorage.getItem("userFormData");
        const extraData = storedFormData ? JSON.parse(storedFormData) : null;

        // Reference to the user profile document
        const userRef = doc(db, "profiles", user.uid);
        const userSnap = await getDoc(userRef);

        // Build update object. Use extraData if available (first login) else existing values.
        const updateData: any = {
          name: (extraData && extraData.name) || providerData?.displayName || (userSnap.exists() ? userSnap.data().name : ""),
          github_profile: `https://github.com/${githubUsername}`, // You might adjust this if you have the actual username.
          roll_number: (extraData && extraData.rollNumber && extraData.rollNumber.trim() !== ""
            ? extraData.rollNumber
            : userSnap.exists() ? userSnap.data().roll_number : ""),
          academic_year: (extraData && extraData.academicYear && extraData.academicYear.trim() !== ""
            ? extraData.academicYear
            : userSnap.exists() ? userSnap.data().academic_year : ""),
          points: userSnap.exists() ? userSnap.data().points || 0 : 0,
          profile_image: githubPhotoURL || (userSnap.exists() ? userSnap.data().profile_image : ""),
          lastLogin: serverTimestamp(),
        };

        // If document exists, update; otherwise, create new document.
        if (userSnap.exists()) {
          await updateDoc(userRef, updateData);
        } else {
          await setDoc(userRef, {
            ...updateData,
            createdAt: serverTimestamp(),
          });
        }

        // Clear stored extra form data after first login update.
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
