import React, { useState, useEffect, ChangeEvent } from "react";
import styles from "@/styles/AttendanceButton.module.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseClient"; 

const AttendanceButton: React.FC = () => {
  const [inputCode, setInputCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isHappy, setIsHappy] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const [uid, setUid] = useState<string | null>(null);

  const funnyMessages: string[] = [
    "Asking the security hamsters to verify..."
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputCode(e.target.value);
  };

  const handleValidate = async () => {
    if (!uid) {
      setMessage("You need to be logged in to mark attendance.");
      setIsHappy(false);
      return;
    }

    setLoading(true);
    setMessage(funnyMessages[Math.floor(Math.random() * funnyMessages.length)]);
    setIsHappy(false);

    try {
      const response = await fetch("/api/validateCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code: inputCode.trim(), uid })
      });

      const data = await response.json();
      setLoading(false);
      setMessage(data.message || "Attendance marked successfully! 🎉");
      setIsHappy(data.valid);
    } catch (error) {
      setLoading(false);
      setMessage("Something went wrong. Please try again later." + error);
      setIsHappy(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    handleValidate();
  };

  return (
    <div className={styles.card}>
      <form onSubmit={handleSubmit} className={styles.inputSection}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={inputCode}
            onChange={handleInputChange}
            placeholder="Enter your code"
            className={styles.input}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`${styles.button} ${loading ? styles.pulse : ""}`}
        >
          {loading ? (
            <div className={styles.buttonContent}>
              <div className={styles.spinner}></div>
              <span>Validating...</span>
            </div>
          ) : (
            "Mark Attendance"
          )}
        </button>
      </form>

      {/* Message Section */}
      {message && (
        <div
          className={`${styles.message} ${
            loading
              ? styles.textBlue
              : isHappy
              ? styles.textGreen
              : styles.textRed
          } ${styles.fadeIn}`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default AttendanceButton;
