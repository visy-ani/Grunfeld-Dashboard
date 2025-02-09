import React, { useState, useEffect } from "react";
import { User, Loader2 } from "lucide-react";
import styles from "@/styles/About.module.css";

interface AvengerAboutCardProps {
  width?: string;
  maxWidth?: string;
}

const AvengerAboutCard: React.FC<AvengerAboutCardProps> = () => {
  // State to hold the hero details fetched from the API
  const [hero, setHero] = useState<{
    fakeName: string;
    aboutStory: string;
  } | null>(null);

  // Loading state for the API call (default to true for immediate generation)
  const [loading, setLoading] = useState(true);

  const generateHero = async () => {
    setLoading(true);
    try {
      // Call the API route that now uses the Google Generative AI SDK
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
      setLoading(false);
    }
  };

  useEffect(() => {
    generateHero();
  }, []);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        {loading ? (
          <Loader2 className={styles.loadingIcon} size={24} />
        ) : (
          <User className={styles.icon} size={24} />
        )}
        <h2 className={styles.headerTitle}>About</h2>
      </div>
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loadingText}>Generating Profile...</div>
        ) : hero ? (
          <>
            <div className={styles.storyText}>{hero.aboutStory}</div>
            <div className={styles.nameText}>{hero.fakeName}</div>
          </>
        ) : (
          <div className={styles.errorText}>Failed to load hero profile.</div>
        )}
      </div>
    </div>
  );
};

export default AvengerAboutCard;
