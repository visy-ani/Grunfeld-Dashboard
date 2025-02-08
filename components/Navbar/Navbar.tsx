"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Common from "@/ui/Badges/Common";
import { auth, db } from "@/lib/firebaseClient";
import { doc, getDoc } from "firebase/firestore";
import styles from "@/styles/Navbar.module.css";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import Legendary from "@/ui/Badges/Legendary";
import Rare from "@/ui/Badges/Rare";
import Epic from "@/ui/Badges/Epic";

interface Profile {
  id: string;
  name: string;
  roll_number: string;
  academic_year: string;
  github_profile: string;
  profile_image: string;
  points: number;
  username: string;
}

const Navbar: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [rank, setRank] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Once the user is restored, fetch the profile from Firestore.
        const userRef = doc(db, "profiles", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setProfile({ id: userSnap.id, ...userSnap.data() } as Profile);
        }
      } else {
        setProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const Rank = (points: number) =>{
    if( points >= 1000 ){
      setRank("Director");
    }
    else if( points >= 500 ){
      setRank("Captain");
    }
    else if( points >= 200 ){
      setRank("Avenger");
    }
    else{
      setRank("Trainee");
    }
  }

  const getBadgeComponent = (points: number) => {
    if (points >= 1000) {
      return (
        <div className={`${styles.badge} ${styles.legendaryGlow}`}>
          <Legendary />
        </div>
      );
    }
    if (points >= 500) {
      return (
        <div className={`${styles.badge} ${styles.epicGlow}`}>
          <Epic />
        </div>
      );
    }
    if (points >= 200) {
      return (
        <div className={`${styles.badge} ${styles.rareGlow}`}>
          <Rare />
        </div>
      );
    }
    return (
      <div className={`${styles.badge} ${styles.commonGlow}`}>
        <Common />
      </div>
    );
  };

  useEffect(()=>{
    Rank(profile?.points ?? 0);
  },[profile])

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.heading}>
        <span className={styles.headingContent}>
          OSS Club Dashboard
          <span className={styles.headingEffect}></span>
        </span>
      </h1>

      {profile && (
        <div className={styles.navProfileContainer}>
          <Link
            href={`/profile/${profile.username}`}
            className={styles.userProfile}
          >
            <Image
              src={
                profile.profile_image || "https://avatar.iran.liara.run/public"
              }
              alt="User Profile"
              className={styles.profilePic}
              width={100}
              height={100}
            />
            <div className={styles.userInfo}>
              <span className={styles.userName}>{profile.name}</span>
              <span className={styles.userRoll}>{profile.roll_number}</span>
            </div>
          </Link>
          <div className={styles.navProfile}>
            <div className={styles.profileName}>
              <span className={styles.rank}>{rank}</span>
              <span className={styles.points}>{profile.points} Points</span>
            </div>
            <div className={styles.badge}>
              {getBadgeComponent(profile.points)}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
