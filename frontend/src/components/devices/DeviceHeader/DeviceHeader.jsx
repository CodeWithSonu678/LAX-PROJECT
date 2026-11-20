import { MoreHorizontal, Wifi } from "lucide-react";
import DeviceModel from "../../home/Hero/components/DeviceShowcase/DeviceModel";

import styles from "./DeviceHeader.module.css";

const DeviceHeader = () => {
  return (
    <section className={styles.deviceHeader}>

      {/* Device Image */}
      <div className={styles.deviceImage}>
        <DeviceModel />
      </div>

      {/* Device Details */}
      <div className={styles.deviceDetails}>
        <h2>LAX-01</h2>

        <p>Wearable Device · v1.0.3</p>

        <div className={styles.status}>
          <span className={styles.statusDot}></span>
          <Wifi size={14} />
          Online
        </div>
      </div>

      {/* More Options */}
      <button
        className={styles.moreButton}
        aria-label="More device options"
      >
        <MoreHorizontal size={22} />
      </button>

    </section>
  );
};

export default DeviceHeader;