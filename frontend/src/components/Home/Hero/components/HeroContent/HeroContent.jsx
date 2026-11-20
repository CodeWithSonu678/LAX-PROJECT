import { ArrowRight, Play, Cpu } from "lucide-react";
import { Link } from "react-router";

import styles from "./HeroContent.module.css";

const HeroContent = () => {
  return (
    <div className={styles.content}>

      <div className={styles.badge}>
        <Cpu size={14} />
        <span>AI-Powered IoT Device</span>
      </div>

      <h1>
        Meet <span>LAX</span>
      </h1>

      <h2>
        Your Personal AI Assistant
        <br />
        in a Smart Device
      </h2>

      <p>
        A wearable IoT companion that connects with your
        phone, controls your apps, monitors your home,
        and makes your life smarter.
      </p>

      <div className={styles.actions}>
        <Link to="/register" className={styles.primaryButton}>
          Get Started
          <ArrowRight size={18} />
        </Link>

        <a href="#how-it-works" className={styles.secondaryButton}>
          Watch Demo
          <Play size={15} fill="currentColor" />
        </a>
      </div>

    </div>
  );
};

export default HeroContent;