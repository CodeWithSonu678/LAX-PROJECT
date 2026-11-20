import styles from "./StepCard.module.css";

const StepCard = ({ number, icon: Icon, title, description }) => {
  return (
    <article className={styles.card}>
      <span className={styles.stepNumber}>{number}</span>

      <div className={styles.iconWrapper}>
        <Icon size={27} strokeWidth={1.8} />
      </div>

      <h3>{title}</h3>

      <p>{description}</p>
    </article>
  );
};

export default StepCard;