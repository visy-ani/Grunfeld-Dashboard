import React, { useState } from 'react';
import styles from '@/styles/Loader.module.css';

const Loader: React.FC = () => {
  const [dots] = useState('...');

  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loaderContent}>
        <span className={styles.loadingText}>Loading</span>
        <span className={styles.dotsContainer}>
          {dots.split('').map((dot, index) => (
            <span 
              key={index} 
              className={styles.dot} 
              style={{ 
                animationDelay: `${index * 0.15}s`,
                animationDuration: '1s'
              }}
            >
              {dot}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
};

export default Loader;
