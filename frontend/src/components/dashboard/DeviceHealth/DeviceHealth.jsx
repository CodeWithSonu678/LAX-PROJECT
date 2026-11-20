import {
  Mic,
  Volume2,
  Wifi,
  Cpu,
  Check,
} from "lucide-react";

import styles from "./DeviceHealth.module.css";

const healthItems = [
  {
    id: 1,
    title: "Microphone",
    icon: Mic,
    status: "Good",
  },
  {
    id: 2,
    title: "Speaker",
    icon: Volume2,
    status: "Good",
  },
  {
    id: 3,
    title: "Network",
    icon: Wifi,
    status: "Good",
  },
  {
    id: 4,
    title: "System",
    icon: Cpu,
    status: "Good",
  },
];

const DeviceHealth = () => {
  const healthPercentage = 100;

  return (
    <section className={styles.healthCard}>

      <h2>Device Health</h2>

      <div className={styles.healthContent}>

        {/* Health Circle */}
        <div
          className={styles.healthCircle}
          style={{
            "--health": `${healthPercentage}%`,
          }}
        >
          <div className={styles.circleInner}>
            <h3>{healthPercentage}%</h3>
            <span>Working Fine</span>
          </div>
        </div>

        {/* Health Status */}
        <div className={styles.healthList}>

          {healthItems.map((item) => {
            const Icon = item.icon;

            return (
              <div className={styles.healthItem} key={item.id}>

                <div className={styles.healthName}>
                  <Icon size={16} />
                  <span>{item.title}</span>
                </div>

                <div className={styles.healthStatus}>
                  <Check size={17} />
                </div>

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
};

export default DeviceHealth;