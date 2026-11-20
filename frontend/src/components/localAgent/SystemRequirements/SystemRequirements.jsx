import {
  Monitor,
  Check,
} from "lucide-react";

import styles from "./SystemRequirements.module.css";

const requirements = [
  "Windows 10 or 11 (64-bit)",
  "Internet connection (for registration & sync)",
  "At least 100 MB free disk space (installer)",
  "2 GB RAM or higher (recommended)",
];

const SystemRequirements = () => {
  return (
    <section className={styles.requirementsCard}>

      {/* Header */}
      <div className={styles.header}>
        <Monitor size={30} strokeWidth={2} />
        <h2>System Requirements</h2>
      </div>

      {/* Requirements List */}
      <div className={styles.requirementsList}>
        {requirements.map((requirement, index) => (
          <div className={styles.requirementItem} key={index}>

            <div className={styles.checkIcon}>
              <Check size={14} strokeWidth={3} />
            </div>

            <span>{requirement}</span>

          </div>
        ))}
      </div>

    </section>
  );
};

export default SystemRequirements;