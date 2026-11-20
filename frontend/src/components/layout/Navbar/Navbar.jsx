import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { Link } from "react-router";

import styles from "./Navbar.module.css";
import laxLogo from "../../../assets/lax_logo.png";

const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Device", href: "#device" },
    { name: "Support", href: "#support" },
];

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className={styles.navbar}>
            <div className={styles.container}>

                {/* Logo */}
                <Link to="/" className={styles.logo}>
                    <img
                        src={laxLogo}
                        alt="LAX Logo"
                        className={styles.logoImage}
                    />
                    <span className={styles.logoText}>LAX</span>
                </Link>

                {/* Navigation */}
                <nav className={`${styles.navLinks} ${menuOpen ? styles.active : ""}`}>
                    {navLinks.map((link, index) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className={index === 0 ? styles.activeLink : ""}
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}

                    <div className={styles.mobileActions}>
                        <Link to="/login" className={styles.loginButton}>
                            Login
                        </Link>

                        <Link to="/register" className={styles.getStartedButton}>
                            Get Started
                        </Link>
                    </div>
                </nav>

                {/* Desktop Actions */}
                <div className={styles.actions}>
                    <Link to="/login" className={styles.loginButton}>
                        Login
                    </Link>

                    <Link to="/register" className={styles.getStartedButton}>
                        Get Started
                    </Link>
                </div>

                {/* Mobile Menu */}
                <button
                    className={styles.menuButton}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation"
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? <X size={25} /> : <Menu size={25} />}
                </button>

            </div>
        </header>
    );
};

export default Navbar;