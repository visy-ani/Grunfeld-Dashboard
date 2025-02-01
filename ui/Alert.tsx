import React from "react";
import styles from '@/styles/Alert.module.css'
import clsx from "clsx";

type AlertProps = {
  variant?: "default" | "destructive";
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={clsx(styles.alert, styles[variant], className)}
      {...props}
    />
  )
);
Alert.displayName = "Alert";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx(styles.description, className)} {...props} />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription };

