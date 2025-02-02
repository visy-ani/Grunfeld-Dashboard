import { Navbar, SearchPanel, SchedulePanel } from "@/components";
import styles from "@/styles/DashboardLayout.module.css";

export default function DashboardLayout() {
  return (
    <div className={styles.dashboardContainer}>
      {/* Navbar */}
      <div className={styles.navbarWrapper}>
        <Navbar />
      </div>

      {/* Main Dashboard Layout */}
      <div className={styles.dashboardMain}>
        {/* Left Section */}
        <div className={styles.leftSection}>
          <SchedulePanel />
        </div>

        {/* Right Section */}
        <div className={styles.rightSection}>
          <SearchPanel />
        </div>
      </div>
    </div>
  );
}
