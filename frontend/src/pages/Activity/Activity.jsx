import { useState } from "react";

import {
  Mic,
  House,
  Smartphone,
  Wifi,
  Bluetooth,
  ChevronDown,
  Activity as ActivityIcon,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout/DashboardLayout";

import styles from "./Activity.module.css";

const activityData = [
  {
    id: 1,
    title: "Play a song",
    type: "Voice",
    time: "14 Nov, 08:42 PM",
    icon: Mic,
    color: "purple",
  },
  {
    id: 2,
    title: "Turned on bedroom light",
    type: "Smart Home",
    time: "14 Nov, 08:41 PM",
    icon: House,
    color: "blue",
  },
  {
    id: 3,
    title: "Opened YouTube on phone",
    type: "Phone",
    time: "14 Nov, 08:37 PM",
    icon: Smartphone,
    color: "purple",
  },
  {
    id: 4,
    title: "Connected to Wi-Fi (Home)",
    type: "Network",
    time: "14 Nov, 08:30 PM",
    icon: Wifi,
    color: "purple",
  },
  {
    id: 5,
    title: "Phone reconnected (OnePlus)",
    type: "Bluetooth",
    time: "14 Nov, 08:25 PM",
    icon: Bluetooth,
    color: "blue",
  },
];

const Activity = () => {
  const [filter, setFilter] = useState("All Events");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filters = [
    "All Events",
    "Voice",
    "Smart Home",
    "Phone",
    "Network",
    "Bluetooth",
  ];

  const filteredActivities =
    filter === "All Events"
      ? activityData
      : activityData.filter((item) => item.type === filter);

  return (
    <DashboardLayout>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1>Activity Logs</h1>
            <p>
              Track all device activity, commands, and system events.
            </p>
          </div>

          {/* Filter */}
          <div className={styles.filterWrapper}>
            <button
              className={styles.filterButton}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {filter}
              <ChevronDown
                size={17}
                className={dropdownOpen ? styles.rotate : ""}
              />
            </button>

            {dropdownOpen && (
              <div className={styles.dropdown}>
                {filters.map((item) => (
                  <button
                    key={item}
                    className={filter === item ? styles.selected : ""}
                    onClick={() => {
                      setFilter(item);
                      setDropdownOpen(false);
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Activity Card */}
        <div className={styles.activityCard}>

          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => {
              const Icon = activity.icon;

              return (
                <div
                  className={styles.activityItem}
                  key={activity.id}
                >
                  <div
                    className={`${styles.activityIcon} ${
                      styles[activity.color]
                    }`}
                  >
                    <Icon size={21} strokeWidth={2} />
                  </div>

                  <div className={styles.activityInfo}>
                    <h3>{activity.title}</h3>
                  </div>

                  <span className={styles.activityTime}>
                    {activity.time}
                  </span>
                </div>
              );
            })
          ) : (
            <div className={styles.emptyState}>
              <ActivityIcon size={35} />
              <h3>No activities found</h3>
              <p>No events available for this category.</p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className={styles.footer}>
          Showing {filteredActivities.length} activities
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Activity;