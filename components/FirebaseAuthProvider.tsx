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
        // Check if there is extra form data in localStorage.
        // This extra data is only present on the first login.
        const storedFormData = localStorage.getItem("userFormData");
        if (!storedFormData) {
          // No extra form data means this is a reload,
          // so do not update the database.
          return;
        }
        const extraData = JSON.parse(storedFormData);

        // Get provider data from the GitHub provider.
        const githubProvider = user.providerData.find(
          (provider) => provider.providerId === "github.com"
        );

        // Construct the GitHub profile URL using the provider's UID.
        // (Note: Using UID assumes that it is the GitHub username.
        //  If that’s not accurate, you might need to fetch additional info.)
        let githubProfileUrl = "";
        if (githubProvider) {
          const githubUsername = githubProvider.uid;
          githubProfileUrl = `https://github.com/${githubUsername}`;
          console.log("Constructed GitHub Profile URL:", githubProfileUrl);
        }

        // Reference to the user profile document in Firestore.
        const userRef = doc(db, "profiles", user.uid);
        const userSnap = await getDoc(userRef);

        // Build the update object using extra form data.
        const updateData = {
          name:
            (extraData && extraData.name) ||
            user.displayName ||
            (userSnap.exists() ? userSnap.data().name : ""),
          github_profile: githubProfileUrl, // update with the constructed URL
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

        // Clear stored extra form data after the first login update.
        localStorage.removeItem("userFormData");
      }
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
};

export default AuthProvider;
