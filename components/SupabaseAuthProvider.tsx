"use client";

import { useEffect } from "react";
import supabase from "@/lib/supabaseClient";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  useEffect(() => {
    // This function retrieves the GitHub username and constructs the profile URL.
    async function upsertUserProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const githubUsername =
          user.user_metadata.preferred_username || user.user_metadata.login;
        const githubProfileUrl = githubUsername
          ? `https://github.com/${githubUsername}`
          : null;
    
        const storedFormData = localStorage.getItem("userFormData");
        const extraData = storedFormData ? JSON.parse(storedFormData) : {};
    
        // Fetch the current profile record (if any)
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
    
        const updateData = {
          id: user.id,
          name: extraData.name || user.user_metadata.full_name || existingProfile?.name || "",
          github_profile: githubProfileUrl || existingProfile?.github_profile,
          // Only override these fields if new data is available; otherwise, use existing values
          roll_number: extraData.rollNumber || existingProfile?.roll_number || "",
          academic_year: extraData.academicYear || existingProfile?.academic_year || "",
        };
    
        const { error } = await supabase.from("profiles").upsert(updateData);
        if (error) {
          console.error("Error saving profile data:", error);
        } else {
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
