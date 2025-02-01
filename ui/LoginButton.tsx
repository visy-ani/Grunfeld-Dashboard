import React from 'react';
import { Github, Loader2 } from 'lucide-react';
import styles from '@/styles/LoginButton.module.css';

type LoginButtonProps = {
  onClick: () => void;
  isLoading: boolean;
  className?: string;
  children?: React.ReactNode;
};

const LoginButton: React.FC<LoginButtonProps> = ({ children, onClick, isLoading, className }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`${styles.button} ${className || ''}`}
    >
      {/* Background hover effect */}
      <div className={styles.backgroundEffect}>
        <div className={styles.backgroundOverlay} />
        <div className={styles.backgroundAnimation} />
      </div>

      {/* Content */}
      <div className={styles.contentWrapper}>
        {isLoading ? (
          <>
            <Loader2 className={styles.loader} />
            <span className={styles.text}>Connecting...</span>
          </>
        ) : (
          children || (
            <>
              <Github className={styles.icon} />
              <span className={styles.text}>Login with GitHub</span>
            </>
          )
        )}
      </div>

      {/* Border gradient animation */}
      <div className={styles.borderEffect} />
    </button>
  );
};

export default LoginButton;
