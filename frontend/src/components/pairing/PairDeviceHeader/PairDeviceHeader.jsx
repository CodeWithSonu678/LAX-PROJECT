import { ShieldCheck, Clock3, Zap, Cpu } from "lucide-react";
import styles from "./PairDeviceHeader.module.css";
import LaxDeviceModel from "../../Home/Hero/components/DeviceShowcase/DeviceModel";

const PairDeviceHeader = () => {
    return (
        <section className={styles.header}>
            <div className={styles.headerContent}>
                <div className={styles.eyebrow}>
                    <span className={styles.eyebrowDot}></span>
                    DEVICE SETUP
                </div>

                <h1>
                    Pair Your <span>LAX Device</span>
                </h1>

                <p className={styles.description}>
                    Connect your LAX device to your account and unlock
                    powerful AI features with secure device pairing.
                </p>

                <div className={styles.features}>
                    <div className={styles.feature}>
                        <ShieldCheck size={17} />
                        <span>Secure Pairing</span>
                    </div>

                    <div className={styles.feature}>
                        <Clock3 size={17} />
                        <span>10-Min Enrollment</span>
                    </div>

                    <div className={styles.feature}>
                        <Zap size={17} />
                        <span>Auto Configuration</span>
                    </div>
                </div>
            </div>

            {/* lax log on right side */}
            <div className={styles.deviceVisual}>
                <div className={styles.glow}></div>

                <div className={styles.connectionLine}></div>

                <div className={styles.modelContainer}>
                    <LaxDeviceModel />
                </div>

                <div className={styles.statusBadge}>
                    <span></span>
                    Ready to Connect
                </div>
            </div>


        </section>
    );
};

export default PairDeviceHeader;