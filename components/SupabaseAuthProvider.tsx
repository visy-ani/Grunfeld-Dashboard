"use client";

import { useEffect } from "react";
import supabase from "@/lib/supabaseClient";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  useEffect(() => {
    async function upsertUserProfile() {
      // Get the currently authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Retrieve GitHub username using a fallback strategy.
        const githubUsername =
          user.user_metadata.preferred_username || user.user_metadata.login;
        const githubProfileUrl = githubUsername
          ? `https://github.com/${githubUsername}`
          : null;
          
        // Retrieve the GitHub avatar from user metadata.
        const avatarUrl = user.user_metadata.avatar_url || null;

        console.log("GitHub Username:", githubUsername);
        console.log("GitHub Profile URL:", githubProfileUrl);
        console.log("GitHub Avatar URL:", avatarUrl);

        // Retrieve any extra form data stored before the OAuth redirect (if available)
        const storedFormData = localStorage.getItem("userFormData");
        const extraData = storedFormData ? JSON.parse(storedFormData) : null;

        // Fetch the existing profile record (if any) so we don't overwrite existing data with empty strings.
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        // Build the update object. Only override certain fields if new data is provided.
        const updateData = {
          id: user.id,
          name: extraData?.name || user.user_metadata.full_name || existingProfile?.name || "",
          github_profile: githubProfileUrl || existingProfile?.github_profile,
          // Use extraData only if it exists; otherwise, fall back to existing values.
          roll_number: extraData?.rollNumber || existingProfile?.roll_number || "",
          academic_year: extraData?.academicYear || existingProfile?.academic_year || "",
          points: extraData?.points !== undefined ? extraData.points : existingProfile?.points || 0,
          // Set the profile image from GitHub if available
          profile_image: avatarUrl || existingProfile?.profile_image || "",
        };

        const { error } = await supabase.from("profiles").upsert(updateData);
        if (error) {
          console.error("Error saving profile data:", error);
        } else {
          // Clear stored form data if it was used
          if (storedFormData) {
            localStorage.removeItem("userFormData");
          }
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
