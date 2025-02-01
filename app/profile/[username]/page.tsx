'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { ProfileProps } from '@/types/types';

const Profile = ({ params }: { params: Promise<{ username: string }> }) => {
  const [username, setUsername] = useState<string | null>(null);
  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      setUsername(resolvedParams.username);
    };

    fetchParams();
  }, [params]); 

  const [profileData, setProfileData] = useState<ProfileProps | null>(null);
  useEffect(() => {
    if (username) {
      const fetchProfileData = async () => {
        const data: ProfileProps = {
          name: username,
          email: `${username}@example.com`,
          role: 'Software Engineer',
        };
        setProfileData(data);
      };

      fetchProfileData();
    }
  }, [username]);

  if (!profileData) return <div>Loading...</div>;

  return (
    <div className={styles.profileContainer}>
      <h1>Profile of {profileData.name}</h1>
      <div className={styles.profileCard}>
        <h2>{profileData.name}</h2>
        <p><strong>Email:</strong> {profileData.email}</p>
        <p><strong>Role:</strong> {profileData.role}</p>
      </div>
    </div>
  );
};

export default Profile;
