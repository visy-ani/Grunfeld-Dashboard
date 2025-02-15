"use client";

import React, { useState, useEffect} from "react";
import styles from "@/styles/SchedulePanel.module.css";
import { Clock, MapPin, User } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { ClassSchedule } from "@/types/types";
import AttendanceButton from "@/components/AttendanceButton/AttendanceButton";
import Link from "next/link";

const formatDateKey = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const SchedulePanel: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [classes, setClasses] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [scheduledDates, setScheduledDates] = useState<string[]>([]);

  const fetchScheduledClasses = async (date: Date) => {
    setLoading(true);
    const dateKey = formatDateKey(date);
    try {
      const { data, error } = await supabase
        .from("class_schedule")
        .select("*")
        .eq("schedule_date", dateKey);
      if (error) {
        console.error("Error fetching classes:", error);
      } else {
        const sortedClasses = (data || []).sort((a, b) => {
          const timeA = new Date(`1970-01-01T${a.time}`).getTime();
          const timeB = new Date(`1970-01-01T${b.time}`).getTime();
          return timeA - timeB;
        });
        setClasses(sortedClasses as ClassSchedule[]);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch distinct scheduled dates for upcoming 7 days
  useEffect(() => {
    const fetchScheduledDates = async () => {
      const today = new Date();
      const upperBound = new Date();
      upperBound.setDate(today.getDate() + 7);

      try {
        // Query all rows and extract the schedule_date column
        const { data, error } = await supabase
          .from("class_schedule")
          .select("schedule_date");
        if (error) {
          console.error("Error fetching scheduled dates:", error);
          return;
        }
        const dates: string[] = data?.map((row) => row.schedule_date) || [];
        // Filter dates to only include those between today and the upperBound
        const filteredDates = dates.filter((dateStr) => {
          const d = new Date(dateStr);
          return d >= today && d <= upperBound;
        });
        // Remove duplicates and sort the dates in ascending order
        const uniqueDates = Array.from(new Set(filteredDates)).sort(
          (a, b) => new Date(a).getTime() - new Date(b).getTime()
        );
        setScheduledDates(uniqueDates);

        // Set selectedDate to the earliest scheduled date (if any)
        if (uniqueDates.length > 0) {
          // Convert the first date string to Date object and set it.
          setSelectedDate(new Date(uniqueDates[0]));
        } else {
          // Fallback to today if no scheduled dates are found.
          setSelectedDate(new Date());
        }
      } catch (error) {
        console.error("Unexpected error while fetching dates:", error);
      }
    };

    fetchScheduledDates();
  }, []);

  // Fetch classes whenever selectedDate changes
  useEffect(() => {
    fetchScheduledClasses(selectedDate);
  }, [selectedDate]);

  // Date formatting helpers
  const formatDate = (date: Date, options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-US", options).format(date);
  const formatMonth = (date: Date) =>
    formatDate(date, { month: "long", day: "numeric" });
  const formatWeekday = (date: Date) =>
    formatDate(date, { weekday: "short" });
  const getDateDisplayText = (date: Date): string => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return formatMonth(date);
  };

  // Generate weekDates only for scheduled dates
  const weekDates = scheduledDates.map((dateStr) => {
    const date = new Date(dateStr);
    return {
      weekday: formatWeekday(date),
      fullDate: date,
    };
  });

  const FormatTime12Hour = (timeStr: string): string => {
    const [hourStr, minuteStr] = timeStr.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr;
    const period = hour >= 12 ? 'PM' : 'AM';

    hour = hour % 12;
    if (hour === 0) hour = 12;
    
    return `${hour}:${minute} ${period}`;
  };

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
        {weekDates.length === 0 ? (
          <p>No classes scheduled for the upcoming week</p>
        ) : (
          weekDates.map((item) => (
            <button
              key={item.fullDate.toISOString()}
              onClick={() => setSelectedDate(new Date(item.fullDate))}
              className={`${styles.weekButton} ${
                selectedDate.toDateString() === item.fullDate.toDateString()
                  ? styles.active
                  : ""
              }`}
            >
              <span className={styles.weekday}>{item.weekday}</span>
              <span className={styles.dateNumber}>{item.fullDate.getDate()}</span>
            </button>
          ))
        )}
      </div>

      <div className={styles.scheduleContainer}>
        <h3 className={styles.scheduleHeader}>Schedule</h3>
        {loading ? (
          <div className={styles.noClasses}>Loading...</div>
        ) : classes.length === 0 ? (
          <div className={styles.noClasses}>
            No classes scheduled for {formatMonth(selectedDate)}
          </div>
        ) : (
          <div className={styles.scheduleList}>
            {classes.map((cls) => (
              <div key={cls.id} className={styles.scheduleItem}>
                <div className={styles.className}>{cls.class_name}</div>
                <div className={styles.classInstructor}>
                  <User size={14} className={styles.icon} /> {cls.instructor}
                </div>
                <div className={styles.scheduleFooter}>
                  <div className={styles.classTime}>
                    <Clock size={14} className={styles.icon} /> {FormatTime12Hour(cls.time)}
                  </div>
                  <div className={styles.classRoom}>
                    <MapPin size={14} className={styles.icon} />{cls.room}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.viewAllContainer}>
        <AttendanceButton/>
        <Link href='/library' className={styles.viewAllButton}>View All Classes</Link>
      </div>
    </div>
  );
};

export default SchedulePanel;
