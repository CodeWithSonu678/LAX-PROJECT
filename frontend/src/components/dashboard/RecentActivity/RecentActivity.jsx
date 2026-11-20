import {
  Mic,
  House,
  Bluetooth,
  Wifi,
  Settings,
} from "lucide-react";

import styles from "./RecentActivity.module.css";

const activities = [
  {
    id: 1,
    title: 'Voice command: "Turn on room light"',
    time: "2 min ago",
    icon: Mic,
    color: "purple",
  },
  {
    id: 2,
    title: "Device connected to Wi-Fi",
    time: "10 min ago",
    icon: Wifi,
    color: "blue",
  },
  {
    id: 3,
    title: "Phone paired successfully",
    time: "16 min ago",
    icon: Bluetooth,
    color: "cyan",
  },
  {
    id: 4,
    title: "Device settings updated",
    time: "25 min ago",
    icon: Settings,
    color: "green",
  },
];

const RecentActivity = () => {
  return (
    <section className={styles.activityCard}>

      <div className={styles.header}>
        <h2>Recent Activity</h2>

        <button className={styles.viewAll}>
          View All
        </button>
      </div>

      <div className={styles.activityList}>
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div className={styles.activityItem} key={activity.id}>

              <div className={`${styles.activityIcon} ${styles[activity.color]}`}>
                <Icon size={17} />
              </div>

              <p className={styles.activityTitle}>
                {activity.title}
              </p>

              <span className={styles.activityTime}>
                {activity.time}
              </span>

            </div>
          );
        })}
      </div>

    </section>
  );
};

export default RecentActivity;