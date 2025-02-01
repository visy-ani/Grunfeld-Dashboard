'use client';

import React, { useState } from 'react';
import styles from '@/styles/Login.module.css'
import { Alert, AlertDescription } from '@/ui/Alert';
import LoginButton from '@/ui/LoginButton'
import Input from '@/ui/LoginInput'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/Select"
import { Github, Loader2 } from 'lucide-react';

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const { name, value } = e.target;
    
    if (name === 'rollNumber' && value.length > 6) {
      return;
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAcademicYearChange = (value: string) => {
    setError('');
    setFormData((prev) => ({ ...prev, academicYear: value }));
  };

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

  const handleGithubLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Login data:', formData);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.background} />
      <div className={styles.header}>
        <h1 className={styles.title}>OSS</h1>
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
          disabled={isLoading}
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
        <p className={styles.footer}>By logging in, you agree to our Terms of Service and Privacy Policy</p>
      </div>
    </div>
  );
};

export default LoginPage;
