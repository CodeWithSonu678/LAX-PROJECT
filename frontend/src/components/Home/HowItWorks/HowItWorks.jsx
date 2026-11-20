import {
  Smartphone,
  Mic,
  BrainCircuit,
  Zap,
  ArrowRight,
} from "lucide-react";

import StepCard from "./components/StepCard/StepCard";
import styles from "./HowItWorks.module.css";

const steps = [
  {
    number: "01",
    icon: Smartphone,
    title: "Connect Your Device",
    description:
      "Pair your LAX device with your account and complete device activation.",
  },
  {
    number: "02",
    icon: Mic,
    title: "Give a Voice Command",
    description:
      "Speak naturally and tell LAX what action you want it to perform.",
  },
  {
    number: "03",
    icon: BrainCircuit,
    title: "AI Understands",
    description:
      "LAX processes your command and identifies the requested action.",
  },
  {
    number: "04",
    icon: Zap,
    title: "Action Executed",
    description:
      "The connected system performs the supported action and returns a response.",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className={styles.section}
    >
      <div className={styles.container}>

        <div className={styles.header}>
          <span className={styles.badge}>
            SIMPLE WORKFLOW
          </span>

          <h2>
            How <span>LAX</span> Works
          </h2>

          <p>
            From your voice to real-world actions.
            Experience a smarter way to control your connected devices.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <div className={styles.stepItem} key={step.number}>
              <StepCard {...step} />

              {index !== steps.length - 1 && (
                <div className={styles.connector}>
                  <ArrowRight size={20} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.bottomNote}>
          <span className={styles.noteIcon}>
            <Zap size={17} />
          </span>

          <p>
            One command. Intelligent processing. Real actions.
          </p>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;