"use client";

import React, { useState } from "react";
import styles from "@/styles/SchedulePanel.module.css";
import { SCHEDULE_DATA } from "./ScheduleData";
import { ClassSchedule } from "@/types/types";
import { Clock, MapPin, User } from "lucide-react";

const SchedulePanel: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const formatDateKey = (date: Date): string => {
    return date.toISOString().split("T")[0]; 
  };

  const getScheduledClasses = (date: Date): ClassSchedule[] => {
    const key = formatDateKey(date);
    return SCHEDULE_DATA[key] ? SCHEDULE_DATA[key].classes : [];
  };

  const formatDate = (date: Date, options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-US", options).format(date);

  const formatMonth = (date: Date) =>
    formatDate(date, { month: "long", day: "numeric" });

  const formatWeekday = (date: Date) => formatDate(date, { weekday: "short" });

  const getDateDisplayText = (date: Date): string => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return formatMonth(date);
  };

  // Fix: Ensure dates are correctly generated for 7 days ahead
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      weekday: formatWeekday(date),
      fullDate: new Date(date), 
    };
  });

  const scheduledClasses = getScheduledClasses(selectedDate).sort((a, b) => {
    const timeA = new Date(`1970-01-01T${a.time}`).getTime();
    const timeB = new Date(`1970-01-01T${b.time}`).getTime();
    return timeA - timeB;
  });

  return (
    <div className={styles.sidePanel}>
      <div className={styles.header}>
        <p className={styles.date}>
          {formatDate(new Date(), {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      <div className={styles.selectedDateContainer}>
        <h2 className={styles.selectedDate}>
          {getDateDisplayText(selectedDate)}
        </h2>
      </div>

      <div className={styles.weekSelector}>
        {weekDates.map((item) => (
          <button
            key={item.fullDate.toISOString()} 
            onClick={() => setSelectedDate(new Date(item.fullDate))} 
            className={`${styles.weekButton} ${
              selectedDate.toDateString() === item.fullDate.toDateString() ? styles.active : ""
            }`}
          >
            <span className={styles.weekday}>{item.weekday}</span>
            <span className={styles.dateNumber}>{item.fullDate.getDate()}</span>
          </button>
        ))}
      </div>

      <div className={styles.scheduleContainer}>
        <h3 className={styles.scheduleHeader}>Schedule</h3>

        {scheduledClasses.length === 0 ? (
          <div className={styles.noClasses}>
            No classes scheduled for {formatMonth(selectedDate)}
          </div>
        ) : (
          <div className={styles.scheduleList}>
            {scheduledClasses.map((cls) => (
              <div key={cls.id} className={styles.scheduleItem}>
                <div className={styles.className}>{cls.name}</div>
                <div className={styles.classInstructor}>
                  <User size={14} className={styles.icon} /> {cls.instructor}
                </div>
                <div className={styles.scheduleFooter}>
                  <div className={styles.classTime}>
                    <Clock size={14} className={styles.icon} /> {cls.time}
                  </div>
                  <div className={styles.classRoom}>
                    <MapPin size={14} className={styles.icon} /> Room {cls.room}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.viewAllContainer}>
        <button className={styles.viewAllButton}>View All Classes</button>
      </div>
    </div>
  );
};

export default SchedulePanel;
