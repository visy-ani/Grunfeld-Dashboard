"use client";

import React, { useState, useMemo, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import styles from "@/styles/SearchPanel.module.css";
import Input from "@/ui/Input";
import Button from "@/ui/Button";
import { Search, Filter, Github } from "lucide-react";
import Checkbox from "@/ui/CheckBox";
import Common from "@/ui/Badges/Common";
import Rare from "@/ui/Badges/Rare";
import Epic from "@/ui/Badges/Epic";
import Legendary from "@/ui/Badges/Legendary";
import supabase from "@/lib/supabaseClient";

interface User {
  id: number;
  name: string;
  username: string;
  rollNumber: string;
  academicYear: number;
  points: number;
  profileImage: string;
  githubProfile: string;
}

interface FilterState {
  academicYears: number[];
  pointsRanges: string[];
}

const getBadgeComponent = (points: number, rank: number) => {
  if (rank === 1) {
    return (
      <div className={`${styles.badge} ${styles.legendaryGlow}`}>
        <Legendary />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className={`${styles.badge} ${styles.epicGlow}`}>
        <Epic />
      </div>
    );
  }
  if (rank === 3) {
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
        const { data, error } = await supabase.from("profiles").select("*");
        if (error) {
          console.error("Error fetching users:", error);
        } else if (data) {
          const mappedUsers: User[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            username: item.username,
            rollNumber: item.roll_number,
            academicYear: Number(item.academic_year),
            points: item.points,
            profileImage: item.profile_image,
            githubProfile: item.github_profile,
          }));
          setUsers(mappedUsers);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
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

  const handleAcademicYearFilter = (year: number) => {
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
    return users.filter((user) => {
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
            case "low":
              return user.points < 1000;
            case "medium":
              return user.points >= 1000 && user.points < 1200;
            case "high":
              return user.points >= 1200;
            default:
              return false;
          }
        });

      return matchesSearch && matchesAcademicYear && matchesPointsRange;
    });
  }, [users, searchTerm, filters]);

  return (
    <div className={styles.container}>
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
            {[2022, 2023, 2024].map((year) => (
              <label key={year} className={styles.filterOption}>
                <Checkbox
                  checked={filters.academicYears.includes(year)}
                  onCheckedChange={() => handleAcademicYearFilter(year)}
                />
                {year}
              </label>
            ))}
          </div>
          <div className={styles.filterSection}>
            <h4>Points Range</h4>
            {["low", "medium", "high"].map((range) => (
              <label key={range} className={styles.filterOption}>
                <Checkbox
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

      {filteredUsers.map((user, index) => (
        <div key={user.id} className={styles.userRow}>
          <div className={styles.badge}>
            {getBadgeComponent(user.points, index + 1)}
          </div> 
          <div className={styles.profileDetails}>
            {/* <Link
              href={`/profile/${user.username}`}
              className={styles.userInfo}
            >
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userHierarchy}>{user.rollNumber}</span>
            </Link> */}
            <div
              className={styles.userInfo}
            >
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userHierarchy}>{user.rollNumber}</span>
            </div>
            <a
              href={user.githubProfile}
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
