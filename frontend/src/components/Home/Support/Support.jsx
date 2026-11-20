import {
  BookOpen,
  Link,
  Wrench,
  Headset,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

import SupportCard from "./components/SupportCard/SupportCard";
import FAQ from "./components/FAQ/FAQ";

import styles from "./Support.module.css";

const supportOptions = [
  {
    icon: BookOpen,
    title: "Setup Guide",
    description:
      "Learn how to configure, activate and get started with your LAX device.",
  },
  {
    icon: Link,
    title: "Pairing Help",
    description:
      "Get help connecting your LAX device to your personal account.",
  },
  {
    icon: Wrench,
    title: "Troubleshooting",
    description:
      "Find solutions for device connectivity and hardware-related issues.",
  },
  {
    icon: Headset,
    title: "Technical Support",
    description:
      "Get assistance with technical issues and device-related queries.",
  },
];

const Support = () => {
  return (
    <section id="support" className={styles.section}>
      <div className={styles.container}>

        {/* Section Header */}

        <div className={styles.header}>
          <span className={styles.badge}>
            HELP & SUPPORT
          </span>

          <h2>
            We're Here to <span>Help You.</span>
          </h2>

          <p>
            Everything you need to get started with LAX
            and resolve common device-related issues.
          </p>
        </div>

        {/* Support Cards */}

        <div className={styles.supportGrid}>
          {supportOptions.map((item) => (
            <SupportCard
              key={item.title}
              {...item}
            />
          ))}
        </div>

        {/* FAQ */}

        <div className={styles.faqSection}>
          <div className={styles.faqHeader}>
            <span>COMMON QUESTIONS</span>

            <h2>
              Frequently Asked <span>Questions</span>
            </h2>

            <p>
              Find quick answers to common questions about LAX.
            </p>
          </div>

          <FAQ />
        </div>

        {/* Contact Support */}

        <div className={styles.contactBox}>
          <div className={styles.contactIcon}>
            <MessageCircle size={27} />
          </div>

          <div className={styles.contactContent}>
            <h3>Still Need Help?</h3>

            <p>
              Can't find what you're looking for?
              Get in touch with our support team.
            </p>
          </div>

          <a
            href="mailto:support@yourdomain.com"
            className={styles.contactButton}
          >
            Contact Support
            <ArrowRight size={17} />
          </a>
        </div>

      </div>
    </section>
  );
};

export default Support;