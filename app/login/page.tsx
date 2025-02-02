'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/Login.module.css'
import { Alert, AlertDescription } from '@/ui/Alert';
import LoginButton from '@/ui/LoginButton';
import Input from '@/ui/LoginInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/Select";
import { Github, Loader2 } from 'lucide-react';
import supabase from '@/lib/supabaseClient';

const academicYears = ['First Year', 'Second Year', 'Third Year', 'Fourth Year'];

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    academicYear: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
 
  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const { name, value } = e.target;
    
    if (name === 'rollNumber' && value.length > 6) {
      return;
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle academic year selection changes
  const handleAcademicYearChange = (value: string) => {
    setError('');
    setFormData((prev) => ({ ...prev, academicYear: value }));
  };

  // Validate that all fields are filled and roll number is exactly 6 characters
  const validateForm = (): boolean => {
    if (!formData.name || !formData.rollNumber || !formData.academicYear) {
      setError('Please fill in all fields');
      return false;
    }
    if (formData.rollNumber.length !== 6) {
      setError('Roll Number must be exactly 6 characters');
      return false;
    }
    return true;
  };

  // Handle GitHub login flow via Supabase OAuth
  const handleGithubLogin = async () => {
    if (!validateForm()) return;

    // Save the form data in localStorage so it can be retrieved after the OAuth redirect.
    localStorage.setItem('userFormData', JSON.stringify(formData));

    setIsLoading(true);
    try {
      // Initiate GitHub OAuth sign-in
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          // Ensure this URL exactly matches one of the callback URLs in your GitHub app settings.
          redirectTo: 'http://localhost:3000/dashboard'
        },
        // Optional: specify a redirect URL if needed (e.g., redirectTo: 'http://localhost:3000/dashboard')
      });
      if (signInError) {
        setError('Error initiating GitHub login: ' + signInError.message);
        setIsLoading(false);
        return;
      }
      // At this point, the user is redirected to GitHub for authentication.
    } catch (err: any) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh(); 
    window.addEventListener('resize', setVh);

    return () => {
      window.removeEventListener('resize', setVh);
    };
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
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
            placeholder="Name"
          />
          <div className={`${styles.focusIndicator} ${focusedField === 'name' ? styles.visible : ''}`} />
        </div>
        <div className={styles.inputGroup}>
          <Input
            type="text"
            name="rollNumber"
            className={styles.input}
            value={formData.rollNumber}
            onChange={handleInputChange}
            onFocus={() => setFocusedField('rollNumber')}
            onBlur={() => setFocusedField(null)}
            placeholder="Roll Number (6 characters)"
            maxLength={6}
          />
          <div className={`${styles.focusIndicator} ${focusedField === 'rollNumber' ? styles.visible : ''}`} />
        </div>
        <Select value={formData.academicYear} onValueChange={handleAcademicYearChange}>
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
        <p className={styles.footer}>Join us to forge innovation, shape tomorrow!</p>
      </div>
    </div>
  );
};

export default LoginPage;
