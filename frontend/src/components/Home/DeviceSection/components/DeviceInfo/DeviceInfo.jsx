import {
  Monitor,
  Mic,
  Volume2,
  Radio,
  ShieldCheck,
} from "lucide-react";

import styles from "./DeviceInfo.module.css";

const deviceFeatures = [
  {
    icon: Monitor,
    title: "Smart Display",
    description: "A dedicated display for LAX interactions.",
  },
  {
    icon: Mic,
    title: "Voice Interaction",
    description: "Interact with LAX using voice commands.",
  },
  {
    icon: Volume2,
    title: "Audio Feedback",
    description: "Receive audio responses from your device.",
  },
  {
    icon: Radio,
    title: "Wireless Connectivity",
    description: "Connect your device with supported systems.",
  },
  {
    icon: ShieldCheck,
    title: "Device Security",
    description: "Secure device authentication and communication.",
  },
];

const DeviceInfo = () => {
  return (
    <div className={styles.info}>
      <span className={styles.badge}>MEET YOUR LAX DEVICE</span>

      <h2>
        Small Device.
        <span> Powerful Possibilities.</span>
      </h2>

      <p className={styles.description}>
        Meet LAX, your personal AI-powered IoT companion.
        Designed to connect your voice commands with
        supported digital and physical actions.
      </p>

      <div className={styles.featureList}>
        {deviceFeatures.map(({ icon: Icon, title, description }) => (
          <div className={styles.feature} key={title}>
            <div className={styles.icon}>
              <Icon size={21} />
            </div>

            <div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceInfo;