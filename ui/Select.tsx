import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import styles from '@/styles/Select.module.css'

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>>(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger ref={ref} className={`${styles.trigger} ${className}`} {...props}>
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className={styles.icon} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>>(
  ({ className, children, position = "popper", ...props }, ref) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content ref={ref} className={`${styles.content} ${className}`} position={position} {...props}>
        <div className={styles.gradientOverlay} />
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport className={styles.viewport}>{children}</SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectScrollUpButton = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>>(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollUpButton ref={ref} className={`${styles.scrollButton} ${className}`} {...props}>
      <ChevronUp className={styles.chevron} />
    </SelectPrimitive.ScrollUpButton>
  )
);
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>>(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollDownButton ref={ref} className={`${styles.scrollButton} ${className}`} {...props}>
      <ChevronDown className={styles.chevron} />
    </SelectPrimitive.ScrollDownButton>
  )
);
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectItem = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>>(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item ref={ref} className={`${styles.item} ${className}`} {...props}>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span className={styles.itemIndicatorWrapper}>
        <SelectPrimitive.ItemIndicator>
          <Check className={styles.checkIcon} />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  )
);

SelectItem.displayName = SelectPrimitive.Item.displayName;


const SelectLabel = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>>(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.Label ref={ref} className={`${styles.label} ${className}`} {...props} />
  )
);
SelectLabel.displayName = SelectPrimitive.Label.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
