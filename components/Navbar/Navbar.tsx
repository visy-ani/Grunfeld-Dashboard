// components/Navbar.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Bronze from "@/ui/Badges/Common";
import { supabase } from "@/lib/supabaseClient";
import styles from "@/styles/Navbar.module.css";

interface Profile {
  id: string;
  name: string;
  roll_number: string;
  academic_year: string;
  github_profile: string;
  profile_image: string;
  points: number;
}

const Navbar: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
        } else if (data) {
          setProfile(data as Profile);
        }
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.heading}>
        <span className={styles.headingContent}>
          OSS Club Dashboard
          <span className={styles.headingEffect}></span>
        </span>
      </h1>

      {!profile ? (
        <></>
      ) : (
        <div className={styles.navProfileContainer}>
          <div className={styles.userProfile}>
            <Image
              src={profile.profile_image || "https://avatar.iran.liara.run/public"}
              alt="User Profile"
              className={styles.profilePic}
              width={100}
              height={100}
            />
            <div className={styles.userInfo}>
              <span className={styles.userName}>{profile.name}</span>
              <span className={styles.userRoll}>{profile.roll_number}</span>
            </div>
          </div>
          <div className={styles.navProfile}>
            <div className={styles.profileName}>
              <span className={styles.rank}>Trainee</span>
              <span className={styles.points}>{profile.points} Points</span>
            </div>
            <div className={styles.badge}>
              <Bronze />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
