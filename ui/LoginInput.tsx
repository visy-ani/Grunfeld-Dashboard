import React, { forwardRef, useState, FocusEvent, ChangeEvent } from "react";
import styles from "@/styles/LoginInput.module.css";
import { LucideIcon } from "lucide-react";

type InputProps = {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  className?: string;
  required?: boolean;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, icon: Icon, className = "", required = false, onFocus, onBlur, ...props },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      onBlur?.(e);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      // If an onChange is passed via props, call it.
      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <div className={styles.container}>
        <div className={`${styles.inputWrapper} ${error ? styles.shake : ""}`}>
          <div className={`${styles.background} ${isFocused ? styles.focused : ""}`} />

          <input
            ref={ref}
            {...props}
            required={required}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            className={`${styles.inputField} ${error ? styles.errorBorder : ""} ${className}`}
          />

          {label && (
            <label className={`${styles.label} ${isFocused || hasValue ? styles.labelFocused : ""}`}>
              {label}
              {required && <span className={styles.required}>*</span>}
            </label>
          )}

          {Icon && (
            <div className={styles.iconWrapper}>
              <Icon
                className={`${styles.icon} ${error ? styles.errorIcon : ""} ${
                  isFocused ? styles.focusedIcon : ""
                }`}
              />
            </div>
          )}
        </div>

        {error && <p className={styles.errorText}>{error}</p>}

        <div className={`${styles.focusRing} ${isFocused ? styles.focused : ""}`}>
          <div className={styles.focusBlur} />
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
