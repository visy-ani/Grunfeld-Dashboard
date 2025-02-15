"use client";

import React, { useState, useEffect } from "react";
import styles from "@/styles/Login.module.css";
import { Alert, AlertDescription } from "@/ui/Alert";
import LoginButton from "@/ui/LoginButton";
import Input from "@/ui/LoginInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/Select";
import { Github, Loader2 } from "lucide-react";
import { auth, db } from "@/lib/firebaseClient";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const academicYears = ["First Year", "Second Year", "Third Year", "Fourth Year"];

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    academicYear: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const { name, value } = e.target;
    if (name === "rollNumber" && value.length > 6) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAcademicYearChange = (value: string) => {
    setError("");
    setFormData((prev) => ({ ...prev, academicYear: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name || !formData.rollNumber || !formData.academicYear) {
      setError("Please fill in all fields");
      return false;
    }
    if (formData.rollNumber.length !== 5) {
      setError("Roll Number must be exactly 5 characters");
      return false;
    }
    if (!/^\d+$/.test(formData.rollNumber)) {
      setError("Roll Number must contain only numeric digits");
      return false;
    }
    return true;
  };

  const handleGithubLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const provider = new GithubAuthProvider();
      provider.addScope("read:user");
      provider.addScope("user:email");

      const result = await signInWithPopup(auth, provider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      if (!token) {
        throw new Error("No GitHub access token found");
      }

      const response = await fetch("https://api.github.com/user", {
        headers: { Authorization: `token ${token}` },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch GitHub user info");
      }
      const data = await response.json();
      const githubUsername = data.login;

      const user = result.user;
      if (user && githubUsername) {
        const userRef = doc(db, "profiles", user.uid);
        await updateDoc(userRef, {
          username: githubUsername,
          github_profile: `https://www.github.com/${githubUsername}`,
        });
      }

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Error signing in with GitHub: " + err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.background} />
      <div className={styles.header}>
        <h1 className={styles.title}>OSS CLUB</h1>
        <p className={styles.subtitle}>Open Source Software Portal</p>
      </div>
      <div className={styles.loginBox}>
        {error && (
          <Alert variant="destructive" className={styles.alert}>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className={styles.inputGroup}>
          <Input
            type="text"
            name="name"
            className={styles.input}
            value={formData.name}
            onChange={handleInputChange}
            onFocus={() => setFocusedField("name")}
            onBlur={() => setFocusedField(null)}
            placeholder="Name"
          />
          <div
            className={`${styles.focusIndicator} ${
              focusedField === "name" ? styles.visible : ""
            }`}
          />
        </div>
        <div className={styles.inputGroup}>
          <Input
            type="text"
            name="rollNumber"
            className={styles.input}
            value={formData.rollNumber}
            onChange={handleInputChange}
            onFocus={() => setFocusedField("rollNumber")}
            onBlur={() => setFocusedField(null)}
            placeholder="Roll Number (5 characters)"
            maxLength={5}
          />
          <div
            className={`${styles.focusIndicator} ${
              focusedField === "rollNumber" ? styles.visible : ""
            }`}
          />
        </div>
        <Select
          value={formData.academicYear}
          onValueChange={handleAcademicYearChange}
        >
          <SelectTrigger className={styles.selectTrigger}>
            <SelectValue placeholder="Select Academic Year" />
          </SelectTrigger>
          <SelectContent className={styles.selectContent}>
            {academicYears.map((year) => (
              <SelectItem key={year} value={year} className={styles.selectItem}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <LoginButton
          onClick={handleGithubLogin}
          isLoading={isLoading}
          className={styles.button}
        >
          {isLoading ? (
            <>
              <Loader2 className={styles.loader} /> Connecting...
            </>
          ) : (
            <>
              <Github className={styles.icon} /> Login with GitHub
            </>
          )}
        </LoginButton>
        <p className={styles.footer}>
          Join us to forge innovation, shape tomorrow!
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
