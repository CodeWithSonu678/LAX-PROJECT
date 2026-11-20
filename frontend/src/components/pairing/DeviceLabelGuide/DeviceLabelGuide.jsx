import { Info, QrCode, Infinity } from "lucide-react";
import styles from "./DeviceLabelGuide.module.css";

const DeviceLabelGuide = () => {
    return (
        <div className={styles.container}>

            {/* Device Label Illustration */}
            <div className={styles.deviceLabel}>
                <div className={`${styles.screw} ${styles.topLeft}`}></div>
                <div className={`${styles.screw} ${styles.topRight}`}></div>
                <div className={`${styles.screw} ${styles.bottomLeft}`}></div>
                <div className={`${styles.screw} ${styles.bottomRight}`}></div>

                <div className={styles.brand}>
                    <Infinity size={27} strokeWidth={2.5} />
                    <span>LAX</span>
                </div>

                <div className={styles.labelDetails}>
                    <div className={styles.detailsText}>
                        <p>
                            Serial No. :
                            <strong>LAX-SN-8F3D2A9C</strong>
                        </p>

                        <p>
                            Mfg. Code :
                            <strong>MFG-7K4P9Z</strong>
                        </p>
                    </div>

                    <div className={styles.qrCode}>
                        <QrCode size={43} strokeWidth={1.8} />
                    </div>
                </div>
            </div>

            {/* Information Card */}
            <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                    <Info size={19} />
                </div>

                <div>
                    <h4>Where to find these details?</h4>

                    <p>
                        Check the label attached to the bottom
                        of your LAX device. Enter the Serial
                        Number and Manufacturing Code exactly
                        as printed.
                    </p>
                </div>
            </div>

        </div>
    );
};

export default DeviceLabelGuide;