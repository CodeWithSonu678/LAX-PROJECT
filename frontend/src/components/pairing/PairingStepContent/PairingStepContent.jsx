import {
  ShieldCheck,
  Wifi,
  LockKeyhole,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Cpu,
  Radio,
  KeyRound,
  CircleCheck,
  LoaderCircle,
} from "lucide-react";

import styles from "./PairingStepContent.module.css";

const PairingStepContent = ({ activeStep, onNext, onBack }) => {

  // STEP 02 - Verification
  if (activeStep === 1) {
    return (
      <section className={styles.card}>
        <div className={styles.stepHeader}>
          <div className={styles.iconBox}>
            <ShieldCheck size={30} />
          </div>

          <div>
            <span className={styles.stepLabel}>STEP 02 OF 05</span>
            <h2>Device Verification</h2>
            <p>Checking the authenticity of your LAX device.</p>
          </div>
        </div>

        <div className={styles.verificationBox}>
          <div className={styles.loaderCircle}>
            <ShieldCheck size={45} />
          </div>

          <h3>Ready for Verification</h3>

          <p>
            Your device details are ready to be checked.
            Continue to the next step in this UI demonstration.
          </p>
        </div>

        <div className={styles.detailList}>
          <div>
            <span>Serial Number</span>
            <strong>Device details submitted</strong>
          </div>

          <div>
            <span>Manufacturing Code</span>
            <strong>••••••••••••</strong>
          </div>

          <div>
            <span>Verification</span>
            <strong className={styles.pending}>Awaiting backend verification</strong>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.backButton} onClick={onBack}>
            <ArrowLeft size={18} />
            Back
          </button>

          <button className={styles.primaryButton} onClick={onNext}>
            Continue Demo
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    );
  }

  // STEP 03 - Wi-Fi Connection
  if (activeStep === 2) {
    return (
      <section className={styles.card}>
        <div className={styles.stepHeader}>
          <div className={styles.iconBox}>
            <Wifi size={30} />
          </div>

          <div>
            <span className={styles.stepLabel}>STEP 03 OF 05</span>
            <h2>Connect Your LAX Device</h2>
            <p>Connect your physical LAX device to your Wi-Fi network.</p>
          </div>
        </div>

        <div className={styles.wifiVisual}>
          <div className={styles.wifiGlow}>
            <Wifi size={65} />
          </div>

          <h3>Connect LAX to Your Wi-Fi</h3>

          <p>
            Use your LAX device's setup process to connect it
            to your personal Wi-Fi network.
          </p>
        </div>

        <div className={styles.statusList}>
          <div className={styles.statusItem}>
            <div className={styles.statusIcon}>
              <Cpu size={20} />
            </div>

            <div>
              <strong>LAX Device</strong>
              <span>Waiting for device connection</span>
            </div>

            <span className={styles.waiting}>Waiting</span>
          </div>

          <div className={styles.statusItem}>
            <div className={styles.statusIcon}>
              <Radio size={20} />
            </div>

            <div>
              <strong>Network Connection</strong>
              <span>Waiting for device to connect</span>
            </div>

            <span className={styles.waiting}>Pending</span>
          </div>
        </div>

        <div className={styles.infoBox}>
          <Wifi size={19} />

          <p>
            Connect your LAX device to your own Wi-Fi.
            You don't need to enter your Wi-Fi password on this website.
          </p>
        </div>

        <div className={styles.actions}>
          <button className={styles.backButton} onClick={onBack}>
            <ArrowLeft size={18} />
            Back
          </button>

          <button className={styles.primaryButton} onClick={onNext}>
            Continue Demo
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    );
  }

  // STEP 04 - Secure Provisioning
  if (activeStep === 3) {
    return (
      <section className={styles.card}>
        <div className={styles.stepHeader}>
          <div className={styles.iconBox}>
            <LockKeyhole size={30} />
          </div>

          <div>
            <span className={styles.stepLabel}>STEP 04 OF 05</span>
            <h2>Secure Provisioning</h2>
            <p>Preparing secure configuration for your LAX device.</p>
          </div>
        </div>

        <div className={styles.provisionVisual}>
          <div className={styles.lockCircle}>
            <LockKeyhole size={48} />
          </div>

          <h3>Secure Configuration</h3>

          <p>
            Your device will securely receive its configuration
            and confirm successful provisioning.
          </p>
        </div>

        <div className={styles.provisionList}>
          <div className={styles.provisionItem}>
            <CircleCheck size={20} />
            <span>Enrollment session</span>
            <strong>UI Preview</strong>
          </div>

          <div className={styles.provisionItem}>
            <LoaderCircle size={20} />
            <span>Secure credential transfer</span>
            <strong className={styles.pending}>Pending</strong>
          </div>

          <div className={styles.provisionItem}>
            <KeyRound size={20} />
            <span>Device confirmation</span>
            <strong className={styles.pending}>Pending</strong>
          </div>
        </div>

        <div className={styles.infoBox}>
          <ShieldCheck size={19} />

          <p>
            Sensitive device credentials will never be displayed
            on this screen.
          </p>
        </div>

        <div className={styles.actions}>
          <button className={styles.backButton} onClick={onBack}>
            <ArrowLeft size={18} />
            Back
          </button>

          <button className={styles.primaryButton} onClick={onNext}>
            Continue Demo
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    );
  }

  // STEP 05 - Completed
  if (activeStep === 4) {
    return (
      <section className={styles.card}>
        <div className={styles.successContent}>
          <div className={styles.successIcon}>
            <CheckCircle2 size={65} />
          </div>

          <span className={styles.successLabel}>STEP 05 OF 05</span>

          <h2>You're All Set!</h2>

          <p>
            Your LAX device pairing flow demonstration is complete.
            Actual activation will require backend confirmation.
          </p>

          <div className={styles.successDetails}>
            <div>
              <Cpu size={20} />
              <span>Device</span>
              <strong>LAX Device</strong>
            </div>

            <div>
              <ShieldCheck size={20} />
              <span>Pairing UI</span>
              <strong>Demo Completed</strong>
            </div>
          </div>

          <button
            className={styles.primaryButton}
            onClick={() => window.location.href = "/dashboard"}
          >
            Go to Dashboard
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    );
  }

  return null;
};

export default PairingStepContent;