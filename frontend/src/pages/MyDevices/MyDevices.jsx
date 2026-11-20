import { useState } from "react";
import { ChevronRight } from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout/DashboardLayout";

import DeviceHeader from "../../components/devices/DeviceHeader/DeviceHeader";
import DeviceTabs from "../../components/devices/DeviceTabs/DeviceTabs";
import DeviceOverview from "../../components/devices/DeviceOverview/DeviceOverview";
import DeviceInfo from "../../components/devices/DeviceInfo/DeviceInfo";

import Configuration from "../../components/devices/Configuration/Configuration";
import Security from "../../components/devices/Security/Security";
import Update from "../../components/devices/Update/Update";

import styles from "./MyDevices.module.css";

const MyDevices = () => {
  const [activeTab, setActiveTab] = useState("Overview");

  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <div className={styles.tabContent}>
            <DeviceOverview />
            <DeviceInfo />
          </div>
        );

      case "Configuration":
        return <Configuration />;

      case "Security":
        return <Security />;

      case "Update":
        return <Update />;

      default:
        return (
          <div className={styles.tabContent}>
            <DeviceOverview />
            <DeviceInfo />
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className={styles.pageContainer}>

        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <span>My Devices</span>
          <ChevronRight size={16} />
          <strong>LAX-01</strong>
        </div>

        {/* Device Header */}
        <DeviceHeader />

        {/* Device Tabs */}
        <DeviceTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Dynamic Tab Content */}
        {renderTabContent()}

      </div>
    </DashboardLayout>
  );
};

export default MyDevices;