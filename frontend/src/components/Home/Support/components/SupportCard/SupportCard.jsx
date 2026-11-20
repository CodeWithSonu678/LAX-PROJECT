import styles from "./SupportCard.module.css";

const SupportCard = ({ icon: Icon, title, description }) => {
  return (
    <article className={styles.card}>
      <div className={styles.icon}>
        <Icon size={24} />
      </div>

      <h3>{title}</h3>

      <p>{description}</p>
    </article>
  );
};

export default SupportCard;