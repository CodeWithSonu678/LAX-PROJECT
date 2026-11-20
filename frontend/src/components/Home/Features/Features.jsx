import {
  Mic,
  House,
  Laptop,
  Globe,
  BrainCircuit,
  ShieldCheck,
} from "lucide-react";

import FeatureCard from "./components/FeatureCard/FeatureCard";
import styles from "./Features.module.css";

const featuresData = [
  {
    icon: Mic,
    title: "Voice Commands",
    description:
      "Control supported actions and applications using natural voice commands.",
  },
  {
    icon: House,
    title: "Smart Home Control",
    description:
      "Manage compatible smart home devices and control connected appliances.",
  },
  {
    icon: Laptop,
    title: "Phone & Laptop Control",
    description:
      "Send commands to your connected phone and remotely manage supported laptop tasks.",
  },
  {
    icon: Globe,
    title: "Remote Access",
    description:
      "Access your connected LAX device and send commands from anywhere with an internet connection.",
  },
  {
    icon: BrainCircuit,
    title: "AI Task Execution",
    description:
      "Convert natural language instructions into supported actions through LAX AI.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Communication",
    description:
      "Device authentication and protected communication help secure your LAX connection.",
  },
];

const Features = () => {
  return (
    <section id="features" className={styles.featuresSection}>
      <div className={styles.container}>

        <div className={styles.sectionHeader}>
          <span className={styles.badge}>
            LAX CAPABILITIES
          </span>

          <h2>
            Everything You Need,
            <span> One Smart Device.</span>
          </h2>

          <p>
            Discover how LAX connects your devices,
            understands your commands and helps you
            perform everyday tasks.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {featuresData.map((feature) => (
            <FeatureCard
              key={feature.title}
              {...feature}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;