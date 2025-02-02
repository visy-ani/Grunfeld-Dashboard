// components/AuthProvider.tsx
"use client";

import { useEffect } from "react";
import {supabase} from "@/lib/supabaseClient";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  useEffect(() => {
    async function upsertUserProfile() {
      // Get the currently authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Extract GitHub info from user metadata
        const githubUsername =
          user.user_metadata.preferred_username || user.user_metadata.login;
        const githubProfileUrl = githubUsername
          ? `https://github.com/${githubUsername}`
          : null;
        const avatarUrl = user.user_metadata.avatar_url || null;

        // Retrieve any extra form data stored before the OAuth redirect (only available at first login)
        const storedFormData = localStorage.getItem("userFormData");
        const extraData = storedFormData ? JSON.parse(storedFormData) : null;

        // Fetch the existing profile record (if any)
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        // Build the update object:
        // - If extraData exists (first login), use its values.
        // - Otherwise, fall back to the existing profile values.
        const updateData = {
          id: user.id,
          name:
            (extraData && extraData.name) ||
            user.user_metadata.full_name ||
            (existingProfile && existingProfile.name) ||
            "",
          github_profile: githubProfileUrl || (existingProfile && existingProfile.github_profile) || "",
          roll_number:
            (extraData && extraData.rollNumber && extraData.rollNumber.trim() !== ""
              ? extraData.rollNumber
              : existingProfile && existingProfile.roll_number) || "",
          academic_year:
            (extraData && extraData.academicYear && extraData.academicYear.trim() !== ""
              ? extraData.academicYear
              : existingProfile && existingProfile.academic_year) || "",
          points:
            (extraData && extraData.points !== undefined
              ? extraData.points
              : existingProfile && existingProfile.points) || 0,
          profile_image: avatarUrl || (existingProfile && existingProfile.profile_image) || "",
        };

        const { error } = await supabase.from("profiles").upsert(updateData);
        if (error) {
          console.error("Error saving profile data:", error);
        } else if (storedFormData) {
          // Clear stored form data after the first login upsert
          localStorage.removeItem("userFormData");
        }
      }
    }

    // Listen to authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await upsertUserProfile();
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
};

export default AuthProvider;
