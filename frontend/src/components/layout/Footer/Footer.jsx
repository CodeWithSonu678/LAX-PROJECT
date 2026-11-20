import {
    Zap,
    ArrowUpRight,
    Mail
} from "lucide-react";

import { Link } from "react-router";
import styles from "./Footer.module.css";
import laxLogo from "../../../assets/lax_logo.png";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>

                {/* Main Footer */}
                <div className={styles.footerMain}>

                    {/* Brand */}
                    <div className={styles.brandSection}>

                        <Link to="/" className={styles.logo}>
                            <img
                                src={laxLogo}
                                alt="LAX Logo"
                                className={styles.logoImage}
                            />
                            <span className={styles.logoText}>LAX</span>
                        </Link>

                        <p className={styles.description}>
                            Your intelligent AI companion. Connect, control and
                            manage your digital world with LAX.
                        </p>

                        <div className={styles.socialLinks}>
                            <a href="#" aria-label="Instagram">IG</a>
                            <a href="#" aria-label="LinkedIn">IN</a>
                            <a href="#" aria-label="GitHub">GH</a>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div className={styles.linkGroup}>
                        <h3>Product</h3>
                        <a href="#features">Features</a>
                        <a href="#how-it-works">How It Works</a>
                        <a href="#device">Our Device</a>
                        <Link to="/register">Get Started</Link>
                    </div>

                    {/* Platform Links */}
                    <div className={styles.linkGroup}>
                        <h3>Platform</h3>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/devices">My Devices</Link>
                        <Link to="/activity">Activity Logs</Link>
                        <Link to="/settings">Settings</Link>
                    </div>

                    {/* Support */}
                    <div className={styles.linkGroup}>
                        <h3>Support</h3>
                        <a href="#support">Help Center</a>
                        <a href="#support">FAQs</a>
                        <a href="#support">Contact Us</a>

                        <div className={styles.contactInfo}>
                            <Mail size={15} />
                            <span>Support Email</span>
                        </div>
                    </div>

                </div>

                {/* Bottom Footer */}
                <div className={styles.footerBottom}>
                    <p>© {currentYear} LAX Device. All rights reserved.</p>

                    <div className={styles.bottomLinks}>
                        <Link to="/privacy-policy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                    </div>

                    <a href="#home" className={styles.backToTop}>
                        Back to top <ArrowUpRight size={16} />
                    </a>
                </div>

            </div>
        </footer>
    );
};

export default Footer;