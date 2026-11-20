import { useState } from "react";
import { useNavigate } from "react-router";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
} from "lucide-react";

import useAuthContext from "../../../hooks/useAuthContext";

import styles from "./RegisterForm.module.css";

const RegisterForm = () => {
  const navigate = useNavigate();

  const { register } = useAuthContext();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    terms: false,
  });

  // Error State
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
    const mobileRegex = /^[6-9]\d{9}$/;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;

    // Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Name must be at least 3 characters";
    } else if (!/^[a-zA-Z ]+$/.test(formData.fullName.trim())) {
      newErrors.fullName = "Name can only contain letters and spaces";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    // Mobile
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    }

    // Password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Use 12+ characters with uppercase, lowercase, number & special character";
    }

    // Terms
    if (!formData.terms) {
      newErrors.terms = "Please accept Terms & Conditions";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerError("");

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      // Backend expected field: name
      const userData = {
        name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: formData.mobile,
        password: formData.password,
      };

      const response = await register(userData);

      if (response.success) {
        navigate("/login", {
          replace: true,
          state: {
            successMessage:
              response.message || "Account created successfully. Please login.",
          },
        });
      }

    } catch (error) {
      setServerError(
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again."
      );

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
    >

      {/* Server Error */}
      {serverError && (
        <div className={styles.serverError}>
          {serverError}
        </div>
      )}

      {/* Full Name */}
      <div className={styles.inputGroup}>
        <label>Full Name</label>

        <div
          className={`${styles.inputWrapper} ${
            errors.fullName ? styles.inputError : ""
          }`}
        >
          <User size={18} />

          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>

        {errors.fullName && (
          <span className={styles.errorText}>
            {errors.fullName}
          </span>
        )}
      </div>

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
          />
        </div>

        {errors.email && (
          <span className={styles.errorText}>
            {errors.email}
          </span>
        )}
      </div>

      {/* Mobile */}
      <div className={styles.inputGroup}>
        <label>Mobile Number</label>

        <div
          className={`${styles.inputWrapper} ${
            errors.mobile ? styles.inputError : ""
          }`}
        >
          <Phone size={18} />

          <input
            type="tel"
            name="mobile"
            placeholder="Enter mobile number"
            value={formData.mobile}
            onChange={(e) => {
              const value = e.target.value
                .replace(/\D/g, "")
                .slice(0, 10);

              setFormData((prev) => ({
                ...prev,
                mobile: value,
              }));

              setErrors((prev) => ({
                ...prev,
                mobile: "",
              }));
            }}
            maxLength={10}
          />
        </div>

        {errors.mobile && (
          <span className={styles.errorText}>
            {errors.mobile}
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
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
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

      {/* Terms */}
      <div>
        <label className={styles.terms}>
          <input
            type="checkbox"
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
          />

          <span>
            I agree to the{" "}
            <a href="/terms">Terms & Conditions</a>
          </span>
        </label>

        {errors.terms && (
          <span className={styles.errorText}>
            {errors.terms}
          </span>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className={styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </button>

      <p className={styles.bottomText}>
        Join the LAX intelligent ecosystem.
      </p>

    </form>
  );
};

export default RegisterForm;