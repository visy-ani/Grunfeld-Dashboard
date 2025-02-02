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
        // Check if we've already updated the profile (i.e. first login update done)
        const profileUpdated = localStorage.getItem("profileUpdated");
        // If already updated, do nothing.
        if (profileUpdated) {
          return;
        }

        // Check for extra form data (only set on first login)
        const storedFormData = localStorage.getItem("userFormData");
        if (!storedFormData) {
          // No extra form data means we shouldn't update (likely a reload).
          return;
        }
        const extraData = JSON.parse(storedFormData);

        // Get GitHub provider data from the user's providerData array.
        const githubProvider = user.providerData.find(
          (provider) => provider.providerId === "github.com"
        );

        // Construct the GitHub profile URL from the provider's UID (assuming that's the GitHub username).
        let githubProfileUrl = "";
        if (githubProvider) {
          const githubUsername = githubProvider.uid;
          githubProfileUrl = `https://github.com/${githubUsername}`;
          console.log("Constructed GitHub Profile URL:", githubProfileUrl);
        }

        // Reference to the user's profile document in Firestore.
        const userRef = doc(db, "profiles", user.uid);
        const userSnap = await getDoc(userRef);

        // Build the update data using extraData (first login) or fallback to existing data.
        const updateData = {
          name:
            (extraData && extraData.name) ||
            user.displayName ||
            (userSnap.exists() ? userSnap.data().name : ""),
          github_profile: githubProfileUrl, // update with constructed URL
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
            user.photoURL || (userSnap.exists() ? userSnap.data().profile_image : ""),
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

        // Set the flag to indicate the profile has been updated and clear the extra form data.
        localStorage.setItem("profileUpdated", "true");
        localStorage.removeItem("userFormData");
      }
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
};

export default AuthProvider;
