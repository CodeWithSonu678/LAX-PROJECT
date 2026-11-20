import { ArrowRight, Zap, ShieldCheck, Smartphone } from "lucide-react";
import { Link } from "react-router";

import styles from "./GetStarted.module.css";

const GetStarted = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>

        <div className={styles.glowOne}></div>
        <div className={styles.glowTwo}></div>

        <div className={styles.content}>

          <div className={styles.badge}>
            <Zap size={15} />
            <span>START YOUR LAX EXPERIENCE</span>
          </div>

          <h2>
            Ready to Experience
            <span> Smarter Living?</span>
          </h2>

          <p>
            Connect your world with LAX. Pair your device,
            explore intelligent features and experience
            a smarter way to interact with technology.
          </p>

          <div className={styles.actions}>
            <Link to="/register" className={styles.primaryButton}>
              Get Started Now
              <ArrowRight size={18} />
            </Link>

            <Link to="/login" className={styles.secondaryButton}>
              Sign In
            </Link>
          </div>

          <div className={styles.highlights}>
            <div>
              <ShieldCheck size={17} />
              <span>Secure Device Pairing</span>
            </div>

            <div>
              <Smartphone size={17} />
              <span>Easy Setup</span>
            </div>

            <div>
              <Zap size={17} />
              <span>Smart Experience</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GetStarted;