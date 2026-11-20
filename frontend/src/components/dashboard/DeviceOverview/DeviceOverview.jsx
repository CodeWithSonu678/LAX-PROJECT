import { useNavigate } from "react-router";

import {
  Mic,
  LayoutGrid,
  Settings,
  MoreHorizontal,
  Wifi,
} from "lucide-react";

import DeviceModel from "../../Home/Hero/components/DeviceShowcase/DeviceModel";

import styles from "./DeviceOverview.module.css";

const DeviceOverview = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.deviceCard}>

      {/* Left: Device Image */}
      <div className={styles.deviceImage}>
        <DeviceModel />
      </div>

      {/* Right: Device Details */}
      <div className={styles.deviceContent}>

        <div className={styles.deviceHeader}>
          <div>
            <span className={styles.deviceLabel}>
              CONNECTED DEVICE
            </span>

            <h2>LAX-01</h2>
            <p>Wearable Device</p>
          </div>

          <button className={styles.moreButton}>
            <MoreHorizontal size={21} />
          </button>
        </div>

        {/* Status */}
        <div className={styles.status}>
          <span className={styles.statusDot}></span>
          <Wifi size={15} />
          <span>Online</span>
        </div>

        {/* Device Actions */}
        <div className={styles.deviceActions}>

          <button onClick={() => navigate("/devices")}>
            <Mic size={21} />
            <span>Voice</span>
          </button>

          <button onClick={() => navigate("/devices")}>
            <LayoutGrid size={21} />
            <span>Control</span>
          </button>

          <button onClick={() => navigate("/settings")}>
            <Settings size={21} />
            <span>Config</span>
          </button>

        </div>

      </div>

    </section>
  );
};

export default DeviceOverview;