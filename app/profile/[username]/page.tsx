"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/Profile.module.css";
import { Github } from "lucide-react";
import Common from "@/ui/Badges/Common";
import Rare from "@/ui/Badges/Rare";
import Epic from "@/ui/Badges/Epic";
import Legendary from "@/ui/Badges/Legendary";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import Image from "next/image";
import About from "@/components/About/About"
import Collections from '@/components/Collections/Collections'
import Loader from "@/ui/Loader";

interface User {
  id: string;
  name: string;
  username: string;
  rollNumber: string;
  academicYear: string;
  points: number;
  profileImage: string;
  githubProfile: string;
  lastLogin: number;
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

const Profile = ({ params }: { params: Promise<{ username: string }> }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Fetch all user profiles from Firebase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const profilesRef = collection(db, "profiles");
        const querySnapshot = await getDocs(profilesRef);
        const usersList: User[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          usersList.push({
            id: doc.id,
            name: data.name,
            username: data.username || "", 
            rollNumber: data.roll_number,
            academicYear: data.academic_year,
            points: data.points,
            profileImage: data.profile_image,
            githubProfile: data.github_profile,
            lastLogin: data.lastLogin.seconds
          });
        });
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      setUsername(resolvedParams.username);
    };

    fetchParams();
  }, [params]);

  const currentUser = users.find((user) => user.username === username);

  if (!username || !currentUser) return(
    <Loader/>
  ) 

  const formatLastLogin = (lastLogin: number): string => {
    const date = new Date(lastLogin * 1000); 
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  return (
    <div className={styles.container}>
      {/* Banner */}
      <div className={styles.banner}></div>

      {/* Main Profile Card */}
      <div className={styles.profileCard}>
        <div className={styles.cardContent}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            <div className={styles.logoSection}>
              <div className={styles.logoImage}>
                {getBadgeComponent(currentUser.points)}
              </div>
              <span className={styles.rankText}>TRAINEE</span>
            </div>
            <div className={styles.separator} />
            <div className={styles.pointsSection}>
              <span className={styles.points}>{currentUser.points}</span>
              <span className={styles.pointsLabel}>points</span>
            </div>
          </div>

          {/* Center Column */}
          <div className={styles.centerColumn}>
            <div className={styles.profileImageWrapper}>
              <Image
                src={currentUser.profileImage || "https://avatar.iran.liara.run/public"}
                alt="Profile"
                width={120}
                height={120}
                className={styles.profileImage}
              />
            </div>
            <h2 className={styles.profileName}>
              {currentUser.name.toUpperCase()}
            </h2>
            <span className={styles.profileLabel}>
              {currentUser.rollNumber}
            </span>
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            <div className={styles.dateSection}>
              <span className={styles.joinDate}>{formatLastLogin(currentUser.lastLogin)}</span>
              <span className={styles.joinLabel}> Joined</span>
            </div>
            <div className={styles.separator} />
            <a
              href={currentUser.githubProfile}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className={styles.githubButton}>
                <Github className={styles.githubIcon} size={28} />
              </button>
            </a>
          </div>
        </div>
      </div>

      <div className={styles.mainContainer}>
        <About/>
        <Collections rollNumber={currentUser.rollNumber}/>
      </div>
    </div>
  );
};

export default Profile;
