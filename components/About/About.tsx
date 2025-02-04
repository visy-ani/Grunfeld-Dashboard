import React, { useState } from "react";
import { User } from "lucide-react";
import styles from "@/styles/About.module.css";

interface AvengerAboutCardProps {
  width?: string;
  maxWidth?: string;
}

const generateFakeAvengerStory = () => {
  const stories = [
    "Battled cosmic threats while mastering quantum energy manipulation.",
    "Transformed ordinary technology into extraordinary weapons of justice.",
    "Harnessed mysterious ancient powers to protect humanity from interdimensional invasion.",
    "Developed breakthrough nanotechnology that revolutionized superhero defense strategies.",
    "Unraveled complex global conspiracies through advanced intelligence networks.",
  ];

  const names = [
    "PHANTOM SURGE",
    "QUANTUM KNIGHT",
    "SHADOW PROTOCOL",
    "NOVA SENTINEL",
    "CYBER GUARDIAN",
  ];

  return {
    story: stories[Math.floor(Math.random() * stories.length)],
    name: names[Math.floor(Math.random() * names.length)],
  };
};

const AvengerAboutCard: React.FC<AvengerAboutCardProps> = () => {
  const [profile] = useState(generateFakeAvengerStory());

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <User className={styles.icon} size={24} />
        <h2 className={styles.headerTitle}>About</h2>
      </div>
      <div className={styles.storyText}>{profile.story}</div>
      <div className={styles.nameText}>{profile.name}</div>
    </div>
  );
};

export default AvengerAboutCard;
