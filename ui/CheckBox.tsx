'use client';

import React from 'react';
import styles from '@/styles/CheckBox.module.css';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void; // Custom event handler
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onCheckedChange, ...props }) => {
  return (
    <label className={styles.checkboxContainer}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)} // Handle change event
        {...props}
      />
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
};

export default Checkbox;
