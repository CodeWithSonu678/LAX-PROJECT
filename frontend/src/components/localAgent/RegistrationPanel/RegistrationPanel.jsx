import { useRef, useState } from "react";
import { Link2, LockKeyhole, LoaderCircle } from "lucide-react";

import styles from "./RegistrationPanel.module.css";

const RegistrationPanel = ({ onVerify, loading = false }) => {
  const [code, setCode] = useState(["", "", ""]);
  const inputs = useRef([]);

  const handleChange = (index, value) => {
    const cleanValue = value
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 4)
      .toUpperCase();

    const updatedCode = [...code];
    updatedCode[index] = cleanValue;

    setCode(updatedCode);

    if (cleanValue.length === 4 && index < 2) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (
      event.key === "Backspace" &&
      !code[index] &&
      index > 0
    ) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const registrationCode = code.join("");

    if (registrationCode.length !== 12) return;

    onVerify?.(registrationCode);
  };

  const isComplete = code.every((part) => part.length === 4);

  return (
    <section className={styles.registrationCard}>

      <div className={styles.heading}>
        <Link2 size={30} />
        <h2>Register Your Computer</h2>
      </div>

      <p className={styles.description}>
        After opening the installer, you will get a
        Registration Code. Enter it here to connect.
      </p>

      <form onSubmit={handleSubmit}>

        <div className={styles.codeInputs}>
          {code.map((value, index) => (
            <input
              key={index}
              ref={(element) => (inputs.current[index] = element)}
              type="text"
              value={value}
              placeholder="XXXX"
              maxLength={4}
              autoComplete="off"
              onChange={(event) =>
                handleChange(index, event.target.value)
              }
              onKeyDown={(event) =>
                handleKeyDown(index, event)
              }
              aria-label={`Registration code part ${index + 1}`}
            />
          ))}
        </div>

        <button
          type="submit"
          className={styles.verifyButton}
          disabled={!isComplete || loading}
        >
          {loading ? (
            <LoaderCircle className={styles.spinner} size={19} />
          ) : (
            <Link2 size={19} />
          )}

          {loading ? "Verifying..." : "Verify & Connect"}
        </button>

      </form>

      <div className={styles.securityNote}>
        <LockKeyhole size={19} />

        <p>
          Your system will be securely verified and
          registered with your LAX account.
        </p>
      </div>

    </section>
  );
};

export default RegistrationPanel;