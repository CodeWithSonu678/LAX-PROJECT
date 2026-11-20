import { useState } from "react";
import { useLocation, useNavigate,Link } from "react-router";
import LoginForm from "../../components/auth/LoginForm/LoginForm";
import RegisterForm from "../../components/auth/RegisterForm/RegisterForm";
import laxLogo from "../../assets/lax_logo.png";
import styles from "./Auth.module.css";

const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState(
        location.pathname === "/register" ? "register" : "login"
    );

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        navigate(tab === "login" ? "/login" : "/register", {
            replace: true,
        });
    };

    return (
        <div className={styles.authPage}>

            <div className={styles.authContainer}>

                {/* Left Section */}
                <div className={styles.leftSection}>
                    <div className={styles.overlay}></div>

                    <div className={styles.leftContent}>
                        {/* Logo */}
                        <Link to="/" className={styles.logo}>
                            <img
                                src={laxLogo}
                                alt="LAX Logo"
                                className={styles.logoImage}
                            />
                            <span className={styles.logoText}>LAX</span>
                        </Link>

                        <div className={styles.heroText}>
                            <span className={styles.badge}>
                                AI POWERED EXPERIENCE
                            </span>

                            <h1>
                                Your World.
                                <br />
                                <span>Your Control.</span>
                            </h1>

                            <p>
                                Connect your devices, control your digital world
                                and experience intelligent automation with LAX.
                            </p>
                        </div>

                        <div className={styles.leftFooter}>
                            Intelligent Technology. Seamless Experience.
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className={styles.rightSection}>

                    <div className={styles.authBox}>

                        <div className={styles.welcomeText}>
                            <span>WELCOME TO LAX</span>

                            <h2>
                                {activeTab === "login"
                                    ? "Welcome Back!"
                                    : "Create Account"}
                            </h2>

                            <p>
                                {activeTab === "login"
                                    ? "Login to continue your experience."
                                    : "Create your account and get started with LAX."}
                            </p>
                        </div>

                        {/* Toggle Buttons */}
                        <div className={styles.tabContainer}>
                            <button
                                className={
                                    activeTab === "login" ? styles.activeTab : ""
                                }
                                onClick={() => handleTabChange("login")}
                            >
                                Login
                            </button>

                            <button
                                className={
                                    activeTab === "register" ? styles.activeTab : ""
                                }
                                onClick={() => handleTabChange("register")}
                            >
                                Register
                            </button>
                        </div>

                        {/* Dynamic Component */}
                        <div className={styles.formWrapper} key={activeTab}>
                            {activeTab === "login" ? (
                                <LoginForm />
                            ) : (
                                <RegisterForm />
                            )}
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default Auth;