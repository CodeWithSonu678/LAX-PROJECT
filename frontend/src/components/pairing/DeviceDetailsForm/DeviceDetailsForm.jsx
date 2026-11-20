import { useState } from "react";

import {
  Cpu,
  Hash,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Info,
} from "lucide-react";

import DeviceLabelGuide from "../DeviceLabelGuide/DeviceLabelGuide";

import styles from "./DeviceDetailsForm.module.css";

const DeviceDetailsForm = ({ formData, onChange, onSubmit }) => {
  const [showCode, setShowCode] = useState(false);
  const [errors, setErrors] = useState({});

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = "Serial number is required.";
    }

    if (!formData.manufacturingCode.trim()) {
      newErrors.manufacturingCode = "Manufacturing code is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    onSubmit(event);
  };

  // Input Handler
  const handleInputChange = (event) => {
    const { name } = event.target;

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    onChange(event);
  };

  return (
    <section className={styles.formCard}>

      <div className={styles.formLayout}>

        {/* Left Section - Device Details Form */}
        <div className={styles.formSection}>

          {/* Form Header */}
          <div className={styles.formHeader}>
            <div className={styles.headerIcon}>
              <Cpu size={29} />
            </div>

            <div>
              <h2>Enter Your Device Details</h2>

              <p>
                Enter the information printed on your LAX device
                to verify its authenticity.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>

            {/* Serial Number */}
            <div className={styles.formGroup}>
              <label htmlFor="serialNumber">
                Serial Number <span>*</span>
              </label>

              <div className={styles.inputWrapper}>
                <Hash size={19} />

                <input
                  id="serialNumber"
                  type="text"
                  name="serialNumber"
                  placeholder="Enter your LAX serial number"
                  value={formData.serialNumber}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
              </div>

              {errors.serialNumber && (
                <small className={styles.error}>
                  {errors.serialNumber}
                </small>
              )}
            </div>

            {/* Manufacturing Code */}
            <div className={styles.formGroup}>
              <label htmlFor="manufacturingCode">
                Manufacturing Code <span>*</span>
              </label>

              <div className={styles.inputWrapper}>
                <ShieldCheck size={19} />

                <input
                  id="manufacturingCode"
                  type={showCode ? "text" : "password"}
                  name="manufacturingCode"
                  placeholder="Enter manufacturing code"
                  value={formData.manufacturingCode}
                  onChange={handleInputChange}
                  autoComplete="off"
                />

                <button
                  type="button"
                  className={styles.visibilityButton}
                  onClick={() => setShowCode(!showCode)}
                  aria-label={showCode ? "Hide code" : "Show code"}
                >
                  {showCode ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>

              {errors.manufacturingCode && (
                <small className={styles.error}>
                  {errors.manufacturingCode}
                </small>
              )}
            </div>

            {/* Information */}
            <div className={styles.infoBox}>
              <Info size={19} />

              <p>
                You can find both details on the label attached
                to your LAX device. Make sure the information
                is entered correctly.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={styles.submitButton}
            >
              Verify Device
              <ArrowRight size={19} />
            </button>

          </form>

          {/* Security Note */}
          <div className={styles.securityNote}>
            <ShieldCheck size={18} />

            <span>
              Your device information is securely verified.
            </span>
          </div>

        </div>

        {/* Right Section - Device Label Guide */}
        <div className={styles.guideSection}>
          <DeviceLabelGuide />
        </div>

      </div>

    </section>
  );
};

export default DeviceDetailsForm;