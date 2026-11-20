import styles from "./DeviceInfo.module.css";

const DeviceInfo = () => {
  const details = [
    {
      label: "Device ID",
      value: "LAX-01-A7F3",
    },
    {
      label: "Paired On",
      value: "14 Nov 2026",
    },
    {
      label: "Last Active",
      value: "Just now",
    },
  ];

  return (
    <section className={styles.infoContainer}>
      {details.map((item) => (
        <div className={styles.infoItem} key={item.label}>
          <span>{item.label}</span>
          <h3>{item.value}</h3>
        </div>
      ))}
    </section>
  );
};

export default DeviceInfo;