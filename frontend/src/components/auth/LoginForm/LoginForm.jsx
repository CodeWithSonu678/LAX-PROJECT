import { useState } from "react";
import { useNavigate, useLocation } from "react-router";

import { Eye, EyeOff, Mail, Lock } from "lucide-react";

import useAuthContext from "../../../hooks/useAuthContext";

import styles from "./LoginForm.module.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Authentication Hook
  const { login } = useAuthContext();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});

  // Handle Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setServerError("");
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Login Function
  const handleLogin = async () => {
    try {
      setLoading(true);
      setServerError("");

      const response = await login({
        email: formData.email.trim(),
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      if (!response?.success) {
        throw new Error(response?.message || "Login failed");
      }

      // Redirect after successful login
      const redirectPath =
        location.state?.from?.pathname || "/dashboard";

      navigate(redirectPath, { replace: true });

    } catch (error) {
      setServerError(
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    await handleLogin();
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
    >

      {/* Email */}
      <div className={styles.inputGroup}>
        <label>Email Address</label>

        <div
          className={`${styles.inputWrapper} ${
            errors.email ? styles.inputError : ""
          }`}
        >
          <Mail size={18} />

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />
        </div>

        {errors.email && (
          <span className={styles.errorText}>
            {errors.email}
          </span>
        )}
      </div>

      {/* Password */}
      <div className={styles.inputGroup}>
        <label>Password</label>

        <div
          className={`${styles.inputWrapper} ${
            errors.password ? styles.inputError : ""
          }`}
        >
          <Lock size={18} />

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {errors.password && (
          <span className={styles.errorText}>
            {errors.password}
          </span>
        )}
      </div>

      {/* Options */}
      <div className={styles.formOptions}>
        <label className={styles.remember}>
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />

          Remember me
        </label>

        <a href="#forgot-password">
          Forgot Password?
        </a>
      </div>

      {/* Server Error */}
      {serverError && (
        <p className={styles.errorText} role="alert">
          {serverError}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        className={styles.submitButton}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login to Account"}
      </button>

      <p className={styles.bottomText}>
        Secure access to your LAX account.
      </p>

    </form>
  );
};

export default LoginForm;