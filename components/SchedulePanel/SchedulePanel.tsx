"use client";

import React, { useState, useEffect, ChangeEvent, useMemo } from "react";
import styles from "@/styles/SchedulePanel.module.css";
import { SCHEDULE_DATA } from "./ScheduleData"; // Remove or comment this out if using Supabase entirely.
import { ClassSchedule } from "@/types/types";  // Ensure your type reflects your Supabase schema.
import { Clock, MapPin, User } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const SchedulePanel: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [classes, setClasses] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper function to format date keys (YYYY-MM-DD)
  const formatDateKey = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  // Function to fetch scheduled classes from Supabase for a given date.
  const fetchScheduledClasses = async (date: Date) => {
    setLoading(true);
    const dateKey = formatDateKey(date);
    try {
      // Query the class_schedule table for classes on the selected date.
      const { data, error } = await supabase
        .from("class_schedule")
        .select("*")
        .eq("schedule_date", dateKey);
      if (error) {
        console.error("Error fetching classes:", error);
      } else {
        // Ensure data is sorted by time.
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

  // Fetch classes on mount and whenever the selected date changes.
  useEffect(() => {
    fetchScheduledClasses(selectedDate);

    // Set up a realtime subscription to class_schedule table
    const channel = supabase
    .channel("public:class_schedule")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "class_schedule",
        filter: `schedule_date=eq.${formatDateKey(selectedDate)}`,
      },
      (payload) => {
        console.log("New class inserted:", payload.new);
        setClasses((prevClasses) => {
          const newList = [...prevClasses, payload.new as ClassSchedule];
          return newList.sort((a, b) => {
            const timeA = new Date(`1970-01-01T${a.time}`).getTime();
            const timeB = new Date(`1970-01-01T${b.time}`).getTime();
            return timeA - timeB;
          });
        });
      }
    )
    .subscribe();

  // Cleanup subscription when the component unmounts or the selected date changes.
  return () => {
    channel.unsubscribe();
  };
}, [selectedDate]);

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

  // Generate dates for the next 7 days.
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      weekday: formatWeekday(date),
      fullDate: new Date(date),
    };
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
            onClick={() => {
              setSelectedDate(new Date(item.fullDate));
            }}
            className={`${styles.weekButton} ${
              selectedDate.toDateString() === item.fullDate.toDateString()
                ? styles.active
                : ""
            }`}
          >
            <span className={styles.weekday}>{item.weekday}</span>
            <span className={styles.dateNumber}>{item.fullDate.getDate()}</span>
          </button>
        ))}
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
