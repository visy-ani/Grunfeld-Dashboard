"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/styles/dashboard.module.css";
import { auth, db } from "@/lib/firebaseClient";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";

interface Profile {
  id: string;
  name: string;
  roll_number: string;
  academic_year: string;
}

const Dashboard: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkSessionAndFetchProfiles = async () => {
      if (!auth.currentUser) {
        router.push("/login");
        return;
      }
      setLoading(true);
      try {
        const profilesRef = collection(db, "profiles");
        const querySnapshot = await getDocs(profilesRef);
        const profilesList: Profile[] = [];
        querySnapshot.forEach((doc) => {
          profilesList.push({ id: doc.id, ...doc.data() } as Profile);
        });
        setProfiles(profilesList);
      } catch (err) {
        setError("Unexpected error: " + err);
      } finally {
        setLoading(false);
      }
    };

    checkSessionAndFetchProfiles();
  }, [router]);

  if (loading) return <div className={styles.loading}>Loading profiles...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.profileCards}>
        {profiles.map((profile) => (
          <Link key={profile.id} href={`/profile/${profile.id}`} passHref>
            <div className={styles.profileCard}>
              <h2>{profile.name}</h2>
              <p>Roll Number: {profile.roll_number}</p>
              <p>Academic Year: {profile.academic_year}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
