import { Monitor, ShieldCheck, Zap, Folder, RefreshCw } from "lucide-react";

import laptopImage from "../../../assets/lax-local-agent-laptop.png";
import styles from "./AgentHeader.module.css";

const features = [
    {
        icon: ShieldCheck,
        title: "Secure & Encrypted",
    },
    {
        icon: Zap,
        title: "Real-time Control",
    },
    {
        icon: Folder,
        title: "File Operations",
    },
    {
        icon: RefreshCw,
        title: "Always Running",
    },
];

const AgentHeader = () => {
    return (
        <section className={styles.header}>

            {/* Header Content */}
            <div className={styles.headerContent}>

                <div className={styles.titleRow}>
                    <div className={styles.iconBox}>
                        <Monitor size={38} />
                    </div>

                    <div>
                        <div className={styles.titleWrapper}>
                            <h1>LAX Local Agent</h1>
                            <span className={styles.version}>v1.0.0</span>
                        </div>

                        <p>
                            Install LAX on your computer to connect, control and
                            manage it remotely with your LAX device or web dashboard.
                        </p>
                    </div>
                </div>

                {/* Features */}
                <div className={styles.features}>
                    {features.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <div className={styles.feature} key={index}>
                                <Icon size={19} />
                                <span>{feature.title}</span>
                            </div>
                        );
                    })}
                </div>

            </div>

            {/* Laptop Visual */}
            <div className={styles.headerVisual}>
                <img
                    src={laptopImage}
                    alt="LAX Local Agent Laptop"
                    className={styles.laptopImage}
                />
            </div>

        </section>
    );
};

export default AgentHeader;