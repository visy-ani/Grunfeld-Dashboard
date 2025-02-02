"use client";

import Link from "next/link";
import styles from "@/styles/Navbar.module.css";
import { Github } from "lucide-react";
import Bronze from "@/ui/Badges/Common";
import Image from "next/image";

const Navbar = ({ isLoggedIn = true, username = "John Doe", rollNumber=10357, points = 999, profilePic="https://avatar.iran.liara.run/public" }) => {

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.heading}>
        <span className={styles.headingContent}>
          OSS Club Dashboard
          <span className={styles.headingEffect}></span>
        </span>
      </h1>

      {/* Conditional rendering based on user login status */}
      {!isLoggedIn ? (
        <button className={styles.loginButton}>
          <div className={styles.loginButtonContent}>
            Login
            <Github className={styles.loginGithubIcon} />
          </div>

          {/* Button Effect */}
          <div className={styles.loginButtonEffect}></div>
        </button>
      ) : (
        <div className={styles.navProfileContainer}>
          <Link href={`profile/${username}`} className={styles.userProfile}>
            <Image
              src={profilePic}
              alt="User Profile"
              className={styles.profilePic}
              width={100}
              height={100}
              layout="intrinsic"
            />
            <div className={styles.userInfo}>
              <span className={styles.userName}>{username}</span>
              <span className={styles.userRoll}>{rollNumber}</span>
            </div>
          </Link>
          <div className={styles.navProfile}>
            <div className={styles.profileName}>
              <span className={styles.rank}>Trainee</span>
              <span className={styles.points}>{points} Points</span>
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
