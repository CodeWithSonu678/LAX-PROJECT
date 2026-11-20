import {
  Mic,
  House,
  Smartphone,
  RefreshCw
} from "lucide-react";

import styles from "./HeroFeatures.module.css";

const features = [
  { title: "Voice Control", icon: Mic },
  { title: "Smart Home", icon: House },
  { title: "App Control", icon: Smartphone },
  { title: "Real-time Sync", icon: RefreshCw },
];

const HeroFeatures = () => {
  return (
    <div className={styles.features}>
      {features.map(({ title, icon: Icon }) => (
        <div className={styles.feature} key={title}>
          <div className={styles.icon}>
            <Icon size={19} />
          </div>

          <span>{title}</span>
        </div>
      ))}
    </div>
  );
};

export default HeroFeatures;