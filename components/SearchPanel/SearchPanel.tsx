"use client";

import React, { useState, useMemo, useEffect, ChangeEvent } from "react";
import styles from "@/styles/SearchPanel.module.css";
import Input from "@/ui/Input";
import Button from "@/ui/Button";
import { Search, Filter, Github } from "lucide-react";
import Checkbox from "@/ui/CheckBox";
import Common from "@/ui/Badges/Common";
import Rare from "@/ui/Badges/Rare";
import Epic from "@/ui/Badges/Epic";
import Legendary from "@/ui/Badges/Legendary";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  username: string;
  rollNumber: string;
  academicYear: string;
  points: number;
  profileImage: string;
  githubProfile: string;
}

interface FilterState {
  academicYears: string[];
  pointsRanges: string[];
}

const getBadgeComponent = (points: number) => {
  if (points >= 1000) {
    return (
      <div className={`${styles.badge} ${styles.legendaryGlow}`}>
        <Legendary />
      </div>
    );
  }
  if (points >= 500) {
    return (
      <div className={`${styles.badge} ${styles.epicGlow}`}>
        <Epic />
      </div>
    );
  }
  if (points >= 200) {
    return (
      <div className={`${styles.badge} ${styles.rareGlow}`}>
        <Rare />
      </div>
    );
  }
  return (
    <div className={`${styles.badge} ${styles.commonGlow}`}>
      <Common />
    </div>
  );
};

const SearchPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterState>({
    academicYears: [],
    pointsRanges: [],
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const profilesRef = collection(db, "profiles");
        const querySnapshot = await getDocs(profilesRef);
        const usersList: User[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          usersList.push({
            id: doc.id,
            name: data.name,
            username: data.username || "", 
            rollNumber: data.roll_number,
            academicYear: data.academic_year,
            points: data.points,
            profileImage: data.profile_image,
            githubProfile: data.github_profile, 
          });
        });
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleFilterOpen = () => {
    setIsFilterOpen((prev) => !prev);
  };

  const handleAcademicYearFilter = (year: string) => {
    setFilters((prev) => ({
      ...prev,
      academicYears: prev.academicYears.includes(year)
        ? prev.academicYears.filter((y) => y !== year)
        : [...prev.academicYears, year],
    }));
  };

  const handlePointsRangeFilter = (range: string) => {
    setFilters((prev) => ({
      ...prev,
      pointsRanges: prev.pointsRanges.includes(range)
        ? prev.pointsRanges.filter((r) => r !== range)
        : [...prev.pointsRanges, range],
    }));
  };

  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        const matchesSearch =
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAcademicYear =
          filters.academicYears.length === 0 ||
          filters.academicYears.includes(user.academicYear);
        const matchesPointsRange =
          filters.pointsRanges.length === 0 ||
          filters.pointsRanges.some((range) => {
            switch (range) {
              case "Common":
                return user.points < 200;
              case "Rare":
                return user.points >= 200 && user.points < 500;
              case "Epic":
                return user.points >= 500 && user.points < 1000;
              case "Legendary":
                return user.points >= 1000;
              default:
                return false;
            }
          });
        return matchesSearch && matchesAcademicYear && matchesPointsRange;
      })
      .sort((firstUser, secondUser) => secondUser.points - firstUser.points);
  }, [users, searchTerm, filters]);

  const academicYearOptions = [
    "First Year",
    "Second Year",
    "Third Year",
    "Fourth Year",
  ];

  return (
    <div className={styles.container}>
      <div className={styles.stickyContainer}>
        <div className={styles.searchBar}>
          <Search className={styles.icon} />
          <Input
            placeholder="Search profiles..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.input}
          />
          <Button onClick={toggleFilterOpen} className={styles.filterButton}>
            <Filter />
          </Button>
        </div>

        {isFilterOpen && (
          <div className={styles.filterContainer}>
            <div className={styles.filterSection}>
              <h4>Academic Year</h4>
              {academicYearOptions.map((year) => (
                <label key={year} className={styles.filterOption}>
                  <Checkbox
                    className={styles.checkbox}
                    checked={filters.academicYears.includes(year)}
                    onCheckedChange={() => handleAcademicYearFilter(year)}
                  />
                  {year}
                </label>
              ))}
            </div>
            <div className={styles.filterSection}>
              <h4>Points Range</h4>
              {["Common", "Rare", "Epic", "Legendary"].map((range) => (
                <label key={range} className={styles.filterOption}>
                  <Checkbox
                    className={styles.checkbox}
                    checked={filters.pointsRanges.includes(range)}
                    onCheckedChange={() => handlePointsRangeFilter(range)}
                  />
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </label>
              ))}
            </div>
          </div>
        )}

        <div className={styles.leaderboardHeader}>
          <div className={styles.headerRank}>Rank</div>
          <div className={styles.headerProfile}>Profile</div>
          <div className={styles.headerPoints}>Points</div>
        </div>
      </div>

      {filteredUsers.map((user) => (
        <div key={user.id} className={styles.userRow}>
          <div className={styles.badge}>{getBadgeComponent(user.points)}</div>
          <div className={styles.profileDetails}>
            <Link href={`/profile/${user.username}`} className={styles.userInfo}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userHierarchy}>{user.rollNumber}</span>
            </Link>
            <a
              href={
                user.githubProfile && user.githubProfile.startsWith("http")
                  ? user.githubProfile
                  : `https://www.github.com/${user.username}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className={styles.githubIcon}
            >
              <Github />
            </a>
          </div>
          <div className={styles.userPoints}>{user.points}</div>
        </div>
      ))}
    </div>
  );
};

export default SearchPanel;
