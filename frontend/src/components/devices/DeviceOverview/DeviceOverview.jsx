import {
  BatteryFull,
  Wifi,
  HardDrive,
} from "lucide-react";

import styles from "./DeviceOverview.module.css";

const DeviceOverview = () => {
  return (
    <section className={styles.overviewGrid}>

      {/* Battery */}
      <div className={styles.infoCard}>
        <div className={styles.cardHeader}>
          <h3>Battery</h3>
          <BatteryFull size={21} />
        </div>

        <h2>87%</h2>

        <div className={styles.progressBar}>
          <div
            className={styles.batteryProgress}
            style={{ width: "87%" }}
          ></div>
        </div>
      </div>

      {/* Network */}
      <div className={styles.infoCard}>
        <div className={styles.cardHeader}>
          <h3>Network</h3>
          <Wifi size={21} />
        </div>

        <h4>Wi-Fi (Home)</h4>

        <div className={styles.networkStatus}>
          <Wifi size={17} />
          <span>Connected</span>
        </div>
      </div>

      {/* Storage */}
      <div className={styles.infoCard}>
        <div className={styles.cardHeader}>
          <h3>Storage</h3>
          <HardDrive size={21} />
        </div>

        <h4>12.4 MB</h4>

        <p className={styles.storageText}>/ 128 MB</p>

        <div className={styles.progressBar}>
          <div
            className={styles.storageProgress}
            style={{ width: "10%" }}
          ></div>
        </div>
      </div>

    </section>
  );
};

export default DeviceOverview;