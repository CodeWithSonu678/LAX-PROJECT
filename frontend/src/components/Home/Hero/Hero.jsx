import styles from "./Hero.module.css";

import HeroContent from "./components/HeroContent/HeroContent";
import DeviceShowcase from "./components/DeviceShowcase/DeviceShowcase";
import HeroFeatures from "./components/HeroFeatures/HeroFeatures";

const Hero = () => {
  return (
    <section id="home" className={styles.hero}>
      <HeroContent />
      <DeviceShowcase />
      <HeroFeatures />
    </section>
  );
};

export default Hero;