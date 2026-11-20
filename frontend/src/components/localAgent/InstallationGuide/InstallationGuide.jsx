import { useState } from "react";

import {
  BookOpen,
  Download,
  Monitor,
  KeyRound,
  ShieldCheck,
  HardDrive,
  ChevronLeft,
  ChevronRight,
  Info,
  CheckCircle2,
} from "lucide-react";

import styles from "./InstallationGuide.module.css";

const steps = [
  {
    title: "Download Installer",
    heading: "Download Installer",
    icon: Download,
    description:
      'Select Windows (10 / 11, 64-bit) and click on "Download for Windows" to get the LAX setup file.',
    info: "You will get a file named:",
    filename: "LAX-LocalAgent-Setup-v1.0.0.exe",
    visual: "Windows",
  },
  {
    title: "Launch Installer",
    heading: "Launch LAX Installer",
    icon: Monitor,
    description:
      "Locate the downloaded setup file and double-click it to launch the LAX installation wizard.",
    info: "After opening the installer:",
    filename:
      "The LAX Setup window will open and begin preparing your computer.",
    visual: "Installer",
  },
  {
    title: "Register Device",
    heading: "Register Your Computer",
    icon: KeyRound,
    description:
      "The installer will communicate with the LAX backend and generate a temporary Registration Code.",
    info: "Enter the generated code on the website:",
    filename:
      "Enter all 12 characters in the Register Your Computer section and click Verify & Connect.",
    visual: "Registration",
  },
  {
    title: "Secure Configuration",
    heading: "Secure Device Configuration",
    icon: ShieldCheck,
    description:
      "The backend will verify your Registration Code and securely provision the computer's System ID and device credentials to the installer.",
    info: "During this process:",
    filename:
      "Your credentials will be securely saved on your computer. Keep your registration session open until configuration completes.",
    visual: "Security",
  },
  {
    title: "Workspace Setup",
    heading: "Choose Your Workspace",
    icon: HardDrive,
    description:
      "Select the drive where LAX will create and manage its workspace. You can choose an available drive on your computer.",
    info: "Example workspace location:",
    filename: "D:\\LAX-Workspace",
    visual: "Workspace",
  },
];

const InstallationGuide = () => {
  const [activeStep, setActiveStep] = useState(0);

  const currentStep = steps[activeStep];
  const StepIcon = currentStep.icon;

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  return (
    <section className={styles.guideCard}>

      {/* Heading */}
      <div className={styles.guideHeader}>
        <BookOpen size={36} />

        <div>
          <h2>Installation Guide</h2>
          <p>
            Follow these 5 simple steps to install and connect
            your computer with LAX.
          </p>
        </div>
      </div>

      {/* Guide Content */}
      <div className={styles.guideContent}>

        {/* Step Navigation */}
        <div className={styles.stepNavigation}>

          {steps.map((step, index) => (
            <button
              key={step.title}
              className={`${styles.stepButton} ${
                activeStep === index ? styles.activeStep : ""
              } ${
                index < activeStep ? styles.completedStep : ""
              }`}
              onClick={() => setActiveStep(index)}
            >
              <span className={styles.stepNumber}>
                {index < activeStep ? (
                  <CheckCircle2 size={19} />
                ) : (
                  String(index + 1).padStart(2, "0")
                )}
              </span>

              <span className={styles.stepTitle}>
                {step.title}
              </span>
            </button>
          ))}

        </div>

        {/* Step Details */}
        <div className={styles.stepDetails}>

          {/* Progress */}
          <div className={styles.progress}>
            <span>{activeStep + 1}</span>
            <strong>/ 5</strong>

            <div className={styles.progressDots}>
              {steps.map((_, index) => (
                <span
                  key={index}
                  className={
                    index <= activeStep ? styles.filledDot : ""
                  }
                />
              ))}
            </div>
          </div>

          {/* Title */}
          <div className={styles.detailHeading}>
            <div className={styles.detailNumber}>
              {String(activeStep + 1).padStart(2, "0")}
            </div>

            <h3>{currentStep.heading}</h3>
          </div>

          {/* Description */}
          <p className={styles.detailDescription}>
            {currentStep.description}
          </p>

          {/* Information */}
          <div className={styles.infoBox}>
            <Info size={20} />

            <div>
              <p>{currentStep.info}</p>
              <strong>{currentStep.filename}</strong>
            </div>
          </div>

          {/* Visual Illustration */}
          <div className={styles.stepVisual}>
            <div className={styles.visualIcon}>
              <StepIcon size={47} strokeWidth={1.4} />
            </div>

            <div className={styles.visualText}>
              <span>STEP {String(activeStep + 1).padStart(2, "0")}</span>
              <h4>{currentStep.visual}</h4>
              <small>LAX Local Agent Setup</small>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className={styles.stepActions}>

            <button
              className={styles.previousButton}
              onClick={handlePrevious}
              disabled={activeStep === 0}
            >
              <ChevronLeft size={19} />
              Previous
            </button>

            <button
              className={styles.nextButton}
              onClick={handleNext}
              disabled={activeStep === steps.length - 1}
            >
              Next Step
              <ChevronRight size={19} />
            </button>

          </div>

        </div>
      </div>
    </section>
  );
};

export default InstallationGuide;