import styles from "./StatsCard.module.css";

const StatsCard = ({ icon: Icon, value, label, color }) => {
  return (
    <div className={styles.card}>
      <div className={`${styles.iconBox} ${styles[color]}`}>
        <Icon size={22} strokeWidth={2} />
      </div>

      <div className={styles.content}>
        <h3>{value}</h3>
        <p>{label}</p>
      </div>
    </div>
  );
};

export default StatsCard;