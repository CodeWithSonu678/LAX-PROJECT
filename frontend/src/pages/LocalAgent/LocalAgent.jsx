import { ChevronRight } from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout/DashboardLayout";
import AgentHeader from "../../components/localAgent/AgentHeader/AgentHeader";
import DownloadSection from "../../components/localAgent/DownloadSection/DownloadSection";
import AgentStatus from "../../components/localAgent/AgentStatus/AgentStatus";
import RegistrationPanel from "../../components/localAgent/RegistrationPanel/RegistrationPanel";
import InstallationGuide from "../../components/localAgent/InstallationGuide/InstallationGuide";
import SystemRequirements from "../../components/localAgent/SystemRequirements/SystemRequirements";

import styles from "./LocalAgent.module.css";

const LocalAgent = () => {
    return (
        <DashboardLayout>
            <div className={styles.container}>

                {/* Breadcrumb */}
                <div className={styles.breadcrumb}>
                    <span>Home</span>
                    <ChevronRight size={15} />
                    <strong>Local Agent</strong>
                </div>

                {/* Agent Header */}
                <AgentHeader />

                <div className={styles.contentGrid}>

                    {/* LEFT COLUMN */}
                    <div className={styles.leftColumn}>
                        <DownloadSection />
                        <InstallationGuide />
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className={styles.rightColumn}>
                        <AgentStatus status="not-installed" />
                        <RegistrationPanel />
                        <SystemRequirements />
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
};

export default LocalAgent;