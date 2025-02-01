import { Navbar, SearchPanel, SchedulePanel } from "@/components";

export default function DashboardLayout() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Navbar */}
      <div
        style={{
          width: "100%",
          height: "60px",
          position: "fixed",
          top: 0,
          left: 0,
          color: "white",
          zIndex: 1000,
        }}
      >
        <Navbar />
      </div>

      {/* Main Dashboard Layout (40% Left Fixed, 60% Right) */}
      <div
        style={{
          display: "flex",
          flex: 1,
          marginTop: "90px",
          height: "calc(100vh - 60px)",
        }}
      >
        {/* Left Section (40% width, Fixed) */}
        <div
          style={{
            width: "30%",
            background: "#f4f4f4",
            position: "fixed",
            left: 0,
            top: "90px",
            height: "calc(100vh - 90px)",
          }}
        >
          <SchedulePanel />
        </div>

        {/* Right Section (60% width, Scrollable) */}
        <div
          style={{
            width: "70%",
            marginLeft: "30%",
            padding: "1rem",
            overflowY: "auto",
            height: "calc(100vh - 90px)",
            scrollbarWidth: "none", 
            msOverflowStyle: "none", 
          }}
          className="hide-scrollbar"
        >
          <SearchPanel />
        </div>
      </div>
    </div>
  );
}
