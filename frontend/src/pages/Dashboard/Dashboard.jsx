import {
    Cpu,
    BatteryFull,
    Wifi,
    MonitorCheck,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout/DashboardLayout";

import DashboardHeader from "../../components/dashboard/DashboardHeader/DashboardHeader";
import StatsCard from "../../components/dashboard/StatsCard/StatsCard";
import DeviceOverview from "../../components/dashboard/DeviceOverview/DeviceOverview";
import QuickActions from "../../components/dashboard/QuickActions/QuickActions";
import RecentActivity from "../../components/dashboard/RecentActivity/RecentActivity";

import DeviceHealth from "../../components/dashboard/DeviceHealth/DeviceHealth";

import styles from "./Dashboard.module.css";

const Dashboard = () => {
    const stats = [
        {
            id: 1,
            icon: Cpu,
            value: "1",
            label: "Connected Device",
            color: "green",
        },
        {
            id: 2,
            icon: MonitorCheck,
            value: "Online",
            label: "Device Status",
            color: "green",
        },
        {
            id: 3,
            icon: BatteryFull,
            value: "87%",
            label: "Battery",
            color: "purple",
        },
        {
            id: 4,
            icon: Wifi,
            value: "Good",
            label: "Network",
            color: "blue",
        },
    ];

    return (
        <DashboardLayout>
            <DashboardHeader />

            <section className={styles.statsGrid}>
                {stats.map((item) => (
                    <StatsCard key={item.id} {...item} />
                ))}
            </section>

            <section className={styles.mainGrid}>
                <DeviceOverview />
                <QuickActions />
            </section>

            <section className={styles.bottomGrid}>
                <RecentActivity />
                <DeviceHealth />
            </section>

        </DashboardLayout>
    );
};

export default Dashboard;