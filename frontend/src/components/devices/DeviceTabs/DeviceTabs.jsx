import styles from "./DeviceTabs.module.css";

const tabs = [
  "Overview",
  "Configuration",
  "Security",
  "Update",
];

const DeviceTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className={styles.tabsContainer}>
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`${styles.tab} ${
            activeTab === tab ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default DeviceTabs;