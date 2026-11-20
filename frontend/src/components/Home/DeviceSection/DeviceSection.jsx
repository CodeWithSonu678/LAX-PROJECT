import DeviceModel from "../Hero/components/DeviceShowcase/DeviceModel";

import DeviceInfo from "./components/DeviceInfo/DeviceInfo";

import styles from "./DeviceSection.module.css";

const DeviceSection = () => {
  return (
    <section id="device" className={styles.section}>
      <div className={styles.container}>

        <div className={styles.modelWrapper}>
          <div className={styles.glow}></div>

          <div className={styles.model}>
            <DeviceModel />
          </div>

          <span className={styles.hint}>
            Drag to rotate · Scroll to zoom
          </span>
        </div>

        <DeviceInfo />

      </div>
    </section>
  );
};

export default DeviceSection;