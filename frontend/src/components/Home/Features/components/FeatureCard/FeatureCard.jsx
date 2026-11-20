import styles from "./FeatureCard.module.css";

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <article className={styles.card}>
      <div className={styles.iconWrapper}>
        <Icon size={25} strokeWidth={1.8} />
      </div>

      <h3>{title}</h3>

      <p>{description}</p>
    </article>
  );
};

export default FeatureCard;