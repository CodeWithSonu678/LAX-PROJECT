import {
  Check,
  Cpu,
  ShieldCheck,
  Wifi,
  LockKeyhole,
  CircleCheck,
} from "lucide-react";

import styles from "./PairingWizard.module.css";

const steps = [
  { title: "Device Details", icon: Cpu },
  { title: "Verification", icon: ShieldCheck },
  { title: "Wi-Fi Connection", icon: Wifi },
  { title: "Secure Provisioning", icon: LockKeyhole },
  { title: "Completed", icon: CircleCheck },
];

const PairingWizard = ({ activeStep = 0 }) => {
  return (
    <div className={styles.wizard}>

      {steps.map((step, index) => {
        const Icon = step.icon;

        const completed = index < activeStep;
        const active = index === activeStep;

        return (
          <div className={styles.stepWrapper} key={step.title}>

            <div
              className={`${styles.step} ${
                active ? styles.active : ""
              } ${completed ? styles.completed : ""}`}
            >
              <div className={styles.stepIcon}>
                {completed ? (
                  <Check size={19} />
                ) : (
                  <Icon size={19} />
                )}
              </div>

              <div className={styles.stepInfo}>
                <span>STEP {String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
              </div>

              {completed && (
                <Check className={styles.completedCheck} size={17} />
              )}
            </div>

            {index !== steps.length - 1 && (
              <div
                className={`${styles.connector} ${
                  completed ? styles.connectorCompleted : ""
                }`}
              />
            )}

          </div>
        );
      })}

    </div>
  );
};

export default PairingWizard;