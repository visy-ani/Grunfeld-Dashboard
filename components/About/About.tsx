import React, { useState, useEffect } from "react";
import { User, Loader2 } from "lucide-react";
import styles from "@/styles/About.module.css";

const AvengerAboutCard: React.FC = () => {
  const [hero, setHero] = useState<{
    fakeName: string;
    aboutStory: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const generateHero = async () => {
    setLoading(true);
    setProgress(0);

    const intervalId = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) {
          return prev + 1;
        }
        return prev;
      });
    }, 100);

    try {
      const res = await fetch("/api/generateAvenger");
      if (res.ok) {
        const data = await res.json();
        setHero(data);
      } else {
        console.error("Failed to fetch hero data.");
      }
    } catch (error) {
      console.error("Error fetching hero data:", error);
    } finally {
      clearInterval(intervalId);
      setProgress(100);
      setLoading(false);
    }
  };

  useEffect(() => {
    generateHero();
  }, []);

  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <div className={styles.header}>
          <User className={styles.icon} />
          <h2 className={styles.headerTitle}>About</h2>
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <Loader2 className={styles.loadingSpinner} />
            <div className={styles.loadingContent}>
              <p className={styles.loadingText}>Generating Profile...</p>
              <div className={styles.loadingBar}>
                <div
                  className={styles.loadingBarProgress}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        ) : hero ? (
          <div className={styles.content}>
            <p className={styles.storyText}>{hero.aboutStory}</p>
            <p className={styles.nameText}>{hero.fakeName}</p>
          </div>
        ) : (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>Failed to load hero profile.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvengerAboutCard;
