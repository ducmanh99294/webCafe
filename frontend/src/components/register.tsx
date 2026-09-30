// Register.js
import React, { useState } from 'react';
import '../assets/css/register.css';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/base';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<any>({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<any>({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prevState: any) => ({
      ...prevState,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    // Simple validation
    if (formData.password !== formData.confirmPassword) {
      setErrors({
        confirmPassword: "Passwords do not match!"
      });
      setLoading(false);
      return;
    }

    try {
      const res = await apiFetch(`/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: "USER",
          createAt: new Date(),
          updateAt: new Date(),
        }),
      });

      const data = await res.json();

      console.log("Registration successful:", data);

      alert("Registration successful!");
      navigate("/login");

    } catch (err) {
      console.error("Registration error:", err);
      alert("Registration failed: " + err);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">

        <div className="register-header">
          <h1 className="register-title">
            Create a New Account
          </h1>

          <p className="register-subtitle">
            Join us today
          </p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Name *
              </label>

              <input
                type="text"
                id="username"
                name="username"
                className={`form-input ${errors.username ? 'error' : ''}`}
                placeholder="Enter your name"
                value={formData.username}
                onChange={handleChange}
                required
              />

              {errors.username && (
                <span className="error-message">
                  {errors.username}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email *
            </label>

            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {errors.email && (
              <span className="error-message">
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone Number *
            </label>

            <input
              type="tel"
              id="phone"
              name="phone"
              className={`form-input ${errors.phone ? 'error' : ''}`}
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            {errors.phone && (
              <span className="error-message">
                {errors.phone}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password *
            </label>

            <input
              type="password"
              id="password"
              name="password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            {errors.password && (
              <span className="error-message">
                {errors.password}
              </span>
            )}

            <div className="password-requirements">
              Password must be at least 6 characters
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password *
            </label>

            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            {errors.confirmPassword && (
              <span className="error-message">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <div className="terms-group">
            <input
              type="checkbox"
              id="terms"
              className="terms-checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
            />

            <label htmlFor="terms" className="terms-label">
              I agree to the{' '}
              <a href="/terms">Terms of Use</a>
              {' '}and{' '}
              <a href="/privacy">Privacy Policy</a>
            </label>
          </div>

          {errors.terms && (
            <span
              className="error-message"
              style={{ marginLeft: '28px' }}
            >
              {errors.terms}
            </span>
          )}

          <button
            type="submit"
            className="register-button"
            disabled={!agreeToTerms || loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <div className="register-footer">
          <div className="login-link">
            Already have an account?{' '}
            <a href="/login">
              Sign In
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;