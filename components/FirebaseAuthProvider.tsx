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
        // Use the providerData array to find the GitHub provider data.
        const githubProvider = user.providerData.find(
          (provider) => provider.providerId === "github.com"
        );

        // Construct the GitHub profile URL using the provider's UID.
        let githubProfileUrl = "";
        if (githubProvider) {
          // Here, we assume that githubProvider.uid holds the GitHub username.
          const githubUsername = githubProvider.uid;
          githubProfileUrl = `https://github.com/${githubUsername}`;
          console.log("Constructed GitHub Profile URL:", githubProfileUrl);
        }

        // Retrieve any extra form data stored during login (if available)
        const storedFormData = localStorage.getItem("userFormData");
        const extraData = storedFormData ? JSON.parse(storedFormData) : null;

        // Reference to the user profile document in Firestore.
        const userRef = doc(db, "profiles", user.uid);
        const userSnap = await getDoc(userRef);

        // Build the update object, merging extra form data with existing data.
        const updateData = {
          name:
            (extraData && extraData.name) ||
            user.displayName ||
            (userSnap.exists() ? userSnap.data().name : ""),
          // Set the GitHub profile URL as constructed.
          github_profile:
            githubProfileUrl ||
            (userSnap.exists() ? userSnap.data().github_profile : ""),
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

        // If the document exists, update; otherwise, create a new document.
        if (userSnap.exists()) {
          await updateDoc(userRef, updateData);
        } else {
          await setDoc(userRef, {
            ...updateData,
            createdAt: serverTimestamp(),
          });
        }

        // Clear stored form data after merging.
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
