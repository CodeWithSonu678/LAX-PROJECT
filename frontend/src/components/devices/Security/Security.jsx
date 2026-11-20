import {
  ShieldCheck,
  KeyRound,
  Smartphone,
  Monitor,
  History,
  Lock,
  ChevronRight,
} from "lucide-react";

import styles from "./Security.module.css";

const Security = () => {
  const securityItems = [
    {
      icon: ShieldCheck,
      title: "Device Authentication",
      description: "Device authentication status.",
      status: "Protected",
    },
    {
      icon: KeyRound,
      title: "Device Secret",
      description: "Device credentials are stored securely.",
      status: "Secured",
    },
    {
      icon: Smartphone,
      title: "Two-Factor Authentication",
      description: "Add an extra layer of account security.",
      status: "Not configured",
    },
  ];

  const managementItems = [
    {
      icon: Monitor,
      title: "Active Sessions",
      description: "Review your active account sessions.",
    },
    {
      icon: Smartphone,
      title: "Trusted Devices",
      description: "Manage authorized devices.",
    },
    {
      icon: History,
      title: "Security Logs",
      description: "Review authentication activities.",
    },
  ];

  return (
    <div className={styles.container}>

      <div className={styles.heading}>
        <h2>Security & Privacy</h2>
        <p>Protect your LAX device and account.</p>
      </div>

      {/* Security Status */}
      <section className={styles.section}>
        <h3>Security Status</h3>

        {securityItems.map((item) => {
          const Icon = item.icon;

          return (
            <div className={styles.securityRow} key={item.title}>
              <div className={styles.iconBox}>
                <Icon size={20} />
              </div>

              <div className={styles.itemInfo}>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>

              <span className={styles.status}>
                {item.status}
              </span>
            </div>
          );
        })}
      </section>

      {/* Security Management */}
      <section className={styles.section}>
        <h3>Security Management</h3>

        {managementItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              className={styles.managementRow}
              key={item.title}
              type="button"
            >
              <Icon size={20} />

              <div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>

              <ChevronRight size={19} />
            </button>
          );
        })}
      </section>

      {/* Information */}
      <div className={styles.securityNotice}>
        <Lock size={20} />

        <div>
          <h4>Your device credentials are protected</h4>
          <p>
            Device secrets should never be displayed or exposed
            in the browser.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Security;