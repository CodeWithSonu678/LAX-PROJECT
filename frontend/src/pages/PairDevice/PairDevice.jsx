import { useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout/DashboardLayout";

import PairDeviceHeader from "../../components/pairing/PairDeviceHeader/PairDeviceHeader";
import PairingWizard from "../../components/pairing/PairingWizard/PairingWizard";
import DeviceDetailsForm from "../../components/pairing/DeviceDetailsForm/DeviceDetailsForm";
import PairingStepContent from "../../components/pairing/PairingStepContent/PairingStepContent";

import styles from "./PairDevice.module.css";

const PairDevice = () => {
    const [activeStep, setActiveStep] = useState(0);

    const [formData, setFormData] = useState({
        serialNumber: "",
        manufacturingCode: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleVerify = (event) => {
        event.preventDefault();

        if (!formData.serialNumber.trim() ||
            !formData.manufacturingCode.trim()) {
            return;
        }

        console.log("Device Details:", formData);

        // UI demonstration only
        setActiveStep(1);
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>

                {/* Breadcrumb */}
                <div className={styles.breadcrumb}>
                    <span>Home</span>
                    <span className={styles.separator}>›</span>
                    <strong>Pair LAX Device</strong>
                </div>

                {/* Page Header */}
                <PairDeviceHeader />

                {/* Pairing Workspace */}
                <div className={styles.workspace}>

                    {/* Left Side - Steps */}
                    <div className={styles.stepsPanel}>
                        <PairingWizard activeStep={activeStep} />
                    </div>

                    {/* Right Side - Current Step */}
                    <div className={styles.content}>

                        {activeStep === 0 && (
                            <DeviceDetailsForm
                                formData={formData}
                                onChange={handleChange}
                                onSubmit={handleVerify}
                            />
                        )}

                        {activeStep >= 1 && activeStep <= 4 && (
                            <PairingStepContent
                                activeStep={activeStep}
                                onNext={() => setActiveStep((prev) => Math.min(prev + 1, 4))}
                                onBack={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
                            />
                        )}

                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
};

export default PairDevice;