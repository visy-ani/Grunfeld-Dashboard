'use client';

import Link from 'next/link';
import styles from '@/styles/dashboard.module.css'

const Dashboard = () => {
  const profiles = [
    { name: 'John Doe', username: 'john_doe' },
    { name: 'Jane Smith', username: 'jane_smith' },
    { name: 'Alice Johnson', username: 'alice_johnson' },
  ];

  return (
    <div className={styles.dashboardContainer}>

      <div className={styles.profileCards}>
        {profiles.map((profile) => (
          <Link key={profile.username} href={`/profile/${profile.username}`} passHref>
            <div className={styles.profileCard}>
              <h2>{profile.name}</h2>
              <p>{profile.username}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
