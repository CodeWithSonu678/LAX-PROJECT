import DeviceModel from "./DeviceModel";
import styles from "./DeviceShowcase.module.css";

const DeviceShowcase = () => {
  return (
    <div className={styles.showcase}>

      <div className={styles.glow}></div>

      <div className={styles.modelContainer}>
        <DeviceModel />
      </div>

      <div className={styles.platform}>
        <div className={styles.platformRing}></div>
      </div>

      <div className={styles.hint}>
        Drag to rotate · Scroll to zoom
      </div>

    </div>
  );
};

export default DeviceShowcase;