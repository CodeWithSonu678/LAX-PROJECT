import { useState } from "react";
import {
  Wifi,
  Mic,
  Volume2,
  Languages,
  Lightbulb,
  Save,
} from "lucide-react";

import styles from "./Configuration.module.css";

const Configuration = () => {
  const [settings, setSettings] = useState({
    deviceName: "LAX-01",
    language: "English",
    voiceAssistant: true,
    microphone: true,
    led: true,
    volume: 70,
    sleepMode: false,
  });

  const handleChange = (name, value) => {
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    console.log("Device Configuration:", settings);
    alert("Settings are ready for backend integration.");
  };

  return (
    <form className={styles.container} onSubmit={handleSave}>

      <div className={styles.heading}>
        <div>
          <h2>Device Configuration</h2>
          <p>Manage your LAX device preferences.</p>
        </div>
      </div>

      {/* General Settings */}
      <section className={styles.section}>
        <h3>General Settings</h3>

        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <span>Device Name</span>
            <small>Customize your device name.</small>
          </div>

          <input
            className={styles.textInput}
            value={settings.deviceName}
            onChange={(e) =>
              handleChange("deviceName", e.target.value)
            }
          />
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <Languages size={19} />
            <div>
              <span>Language</span>
              <small>Select voice assistant language.</small>
            </div>
          </div>

          <select
            value={settings.language}
            onChange={(e) =>
              handleChange("language", e.target.value)
            }
          >
            <option>English</option>
            <option>Hindi</option>
          </select>
        </div>
      </section>

      {/* Voice Settings */}
      <section className={styles.section}>
        <h3>Voice Settings</h3>

        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <Mic size={19} />
            <div>
              <span>Voice Assistant</span>
              <small>Enable or disable voice interaction.</small>
            </div>
          </div>

          <input
            type="checkbox"
            checked={settings.voiceAssistant}
            onChange={(e) =>
              handleChange("voiceAssistant", e.target.checked)
            }
          />
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <Mic size={19} />
            <div>
              <span>Microphone</span>
              <small>Microphone permission preference.</small>
            </div>
          </div>

          <input
            type="checkbox"
            checked={settings.microphone}
            onChange={(e) =>
              handleChange("microphone", e.target.checked)
            }
          />
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <Volume2 size={19} />
            <div>
              <span>Speaker Volume</span>
              <small>Adjust audio output level.</small>
            </div>
          </div>

          <div className={styles.rangeControl}>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.volume}
              onChange={(e) =>
                handleChange("volume", Number(e.target.value))
              }
            />
            <span>{settings.volume}%</span>
          </div>
        </div>
      </section>

      {/* Device Preferences */}
      <section className={styles.section}>
        <h3>Device Preferences</h3>

        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <Lightbulb size={19} />
            <div>
              <span>LED Indicator</span>
              <small>Control device LED preference.</small>
            </div>
          </div>

          <input
            type="checkbox"
            checked={settings.led}
            onChange={(e) =>
              handleChange("led", e.target.checked)
            }
          />
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <Wifi size={19} />
            <div>
              <span>Sleep Mode</span>
              <small>Enable device sleep preference.</small>
            </div>
          </div>

          <input
            type="checkbox"
            checked={settings.sleepMode}
            onChange={(e) =>
              handleChange("sleepMode", e.target.checked)
            }
          />
        </div>
      </section>

      <div className={styles.footer}>
        <button type="submit">
          <Save size={17} />
          Save Changes
        </button>
      </div>

    </form>
  );
};

export default Configuration;