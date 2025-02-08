'use client'

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import styles from '@/styles/ComingSoon.module.css';

const ComingSoon: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [messageIndex, setMessageIndex] = useState<number>(0);

  const funnyMessages: string[] = [
    "Loading unicorn power... 🦄",
    "Calculating the meaning of life...",
    "Convincing pixels to behave...",
    "Training pigeons for backup servers...",
    "Untangling spaghetti code...",
    "Debugging rubber ducks... 🦆",
    "Converting caffeine to code...",
    "Reticulating splines...",
    "Teaching robots to dance... 🤖",
    "Generating random excuses..."
  ];

  // Rotate through messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % funnyMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [funnyMessages.length]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Interactive animated clock */}
        <div className={styles.clickable} onClick={() => setIsSpinning(true)}>
          <div 
            className={`${styles.rotatable} ${isSpinning ? styles.rotate360 : ''}`}
            onAnimationEnd={() => setIsSpinning(false)}
          >
            <Clock className={styles.clockIcon} />
          </div>
        </div>

        {/* Main heading */}
        <h1 className={styles.heading}>
          Coming Soon
          <span className={styles.headingShadow}>
            Coming Soon
          </span>
        </h1>

        {/* Rotating funny messages */}
        <p className={styles.funnyMessage}>
          {funnyMessages[messageIndex]}
        </p>

        {/* Fun progress updates */}
        <div className={styles.progressUpdates}>
          <p className={styles.progressText}>
            Our hamsters are running at maximum speed to power up this awesome site! 
          </p>
        </div>

        {/* Fun footer messages */}
        <div className={styles.footer}>
          <p className={styles.footerText}>
            Time is relative, but this loading screen feels like eternity! ⏰
          </p>
          <p className={styles.footerText}>
            Tip: Click the clock to make time spin! (Warning: May cause dizziness)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
