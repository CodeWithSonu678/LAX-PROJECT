import {
  Download,
  Apple,
  Check,
  Package,
  MonitorDown,
} from "lucide-react";

import styles from "./DownloadSection.module.css";

const DownloadSection = () => {
  const installerUrl = ""; // Actual installer URL baad mein add karenge.

  const handleDownload = () => {
    if (!installerUrl) {
      alert("LAX Local Agent installer is not available yet.");
      return;
    }

    window.location.href = installerUrl;
  };

  return (
    <section className={styles.downloadCard}>

      {/* Left Content */}
      <div className={styles.content}>

        <h2>Download LAX Local Agent</h2>

        <p className={styles.description}>
          Choose your operating system and download the installer.
        </p>

        {/* OS Selection */}
        <div className={styles.osOptions}>

          {/* Windows */}
          <button className={`${styles.osCard} ${styles.selected}`}>
            <div className={styles.windowsIcon}>
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className={styles.osInfo}>
              <h3>Windows</h3>
              <span>10 / 11 (64-bit)</span>
            </div>

            <div className={styles.selectedCheck}>
              <Check size={14} />
            </div>
          </button>

          {/* macOS */}
          <button className={`${styles.osCard} ${styles.disabled}`} disabled>
            <Apple size={32} fill="currentColor" />

            <div className={styles.osInfo}>
              <h3>macOS</h3>
              <span>Coming Soon</span>
            </div>
          </button>

          {/* Linux */}
          <button className={`${styles.osCard} ${styles.disabled}`} disabled>
            <Package size={30} />

            <div className={styles.osInfo}>
              <h3>Linux</h3>
              <span>Coming Soon</span>
            </div>
          </button>

        </div>

        {/* Download Action */}
        <div className={styles.downloadActions}>

          <button
            className={styles.downloadButton}
            onClick={handleDownload}
          >
            <Download size={21} />
            Download for Windows
          </button>

          <div className={styles.versionInfo}>
            <span>v1.0.0</span>
            <i />
            <span>~25 MB</span>
          </div>

        </div>

      </div>

      {/* Software Illustration */}
      <div className={styles.visual}>

        <div className={styles.glow} />

        <div className={styles.softwareBox}>
          <div className={styles.boxContent}>
            <div className={styles.laxLogo}>∞</div>
            <h3>LAX</h3>
            <span>Local Agent</span>

            <div className={styles.windowsIcon}>
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>

        <div className={styles.platform}>
          <MonitorDown size={23} />
        </div>

      </div>

    </section>
  );
};

export default DownloadSection;