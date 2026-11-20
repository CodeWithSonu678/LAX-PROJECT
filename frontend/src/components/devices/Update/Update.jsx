import { useState } from "react";

import {
  RefreshCw,
  Download,
  CheckCircle2,
  Clock,
  History,
  Cpu,
} from "lucide-react";

import styles from "./Update.module.css";

const Update = () => {
  const [checking, setChecking] = useState(false);

  const handleCheckUpdate = () => {
    setChecking(true);

    // Temporary UI interaction.
    // Actual update check requires backend API.

    setTimeout(() => {
      setChecking(false);
      alert("Connect the firmware update API to check for updates.");
    }, 800);
  };

  return (
    <div className={styles.container}>

      <div className={styles.heading}>
        <h2>Device Software Update</h2>
        <p>Manage your LAX firmware and software updates.</p>
      </div>

      {/* Current Version */}
      <section className={styles.versionCard}>

        <div className={styles.versionIcon}>
          <Cpu size={30} />
        </div>

        <div className={styles.versionInfo}>
          <span>CURRENT FIRMWARE</span>
          <h2>v1.0.3</h2>
          <p>LAX-01 Device Firmware</p>
        </div>

        <div className={styles.currentStatus}>
          <CheckCircle2 size={17} />
          Current Version
        </div>

      </section>

      {/* Update Status */}
      <section className={styles.updateCard}>

        <div className={styles.updateIcon}>
          <Download size={25} />
        </div>

        <h3>Check for Firmware Updates</h3>

        <p>
          Check whether a newer firmware version is available
          for your LAX device.
        </p>

        <button
          onClick={handleCheckUpdate}
          disabled={checking}
        >
          <RefreshCw
            size={17}
            className={checking ? styles.spinning : ""}
          />

          {checking ? "Checking..." : "Check for Updates"}
        </button>

      </section>

      {/* Update History */}
      <section className={styles.historySection}>

        <div className={styles.historyHeading}>
          <History size={20} />
          <h3>Update History</h3>
        </div>

        <div className={styles.historyItem}>
          <div>
            <h4>Firmware v1.0.3</h4>
            <p>Current installed version</p>
          </div>

          <span className={styles.currentBadge}>Current</span>
        </div>

        <div className={styles.historyItem}>
          <div>
            <h4>Firmware v1.0.2</h4>
            <p>Previous version</p>
          </div>

          <span className={styles.previousBadge}>Previous</span>
        </div>

      </section>

      {/* Information */}
      <div className={styles.updateNotice}>
        <Clock size={18} />
        <p>
          Firmware updates require a compatible device and
          an active connection.
        </p>
      </div>

    </div>
  );
};

export default Update;