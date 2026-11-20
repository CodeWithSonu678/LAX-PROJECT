import { useState } from "react";
import { ChevronDown } from "lucide-react";

import styles from "./FAQ.module.css";

const faqData = [
  {
    question: "How do I pair my LAX device?",
    answer:
      "Log in to your LAX account, open the Pair Device section, enter your device ID and follow the verification instructions.",
  },
  {
    question: "Why is my LAX device showing offline?",
    answer:
      "Check whether your device has power and an active network connection. Also verify that your device is successfully activated.",
  },
  {
    question: "How do I reset my LAX device?",
    answer:
      "Follow the reset instructions provided for your specific LAX hardware version. Check the device manual before resetting.",
  },
  {
    question: "Can I control my laptop remotely?",
    answer:
      "LAX can execute supported laptop actions through its connected backend and authorized laptop integration, when configured.",
  },
  {
    question: "How can I check my device activity?",
    answer:
      "Log in to your LAX dashboard and open Activity Logs to review available device events and command history.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={styles.faqList}>
      {faqData.map((faq, index) => (
        <div
          className={`${styles.faqItem} ${
            activeIndex === index ? styles.open : ""
          }`}
          key={faq.question}
        >
          <button
            className={styles.question}
            onClick={() => toggleFAQ(index)}
            aria-expanded={activeIndex === index}
          >
            <span>{faq.question}</span>

            <ChevronDown
              size={20}
              className={styles.arrow}
            />
          </button>

          {activeIndex === index && (
            <div className={styles.answer}>
              <p>{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQ;