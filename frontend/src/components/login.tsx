// Login.js
import React, { useState } from 'react';
import '../assets/css/login.css';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/base';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiFetch(`/api/users/login`, {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setError(false);

        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.id);
        localStorage.setItem("role", data.role);

        if (data.role === "USER") {
          navigate("/");
        } else {
          navigate("/admin");
        }
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <div className="login-header">
          <h1 className="login-title">
            Welcome Back
          </h1>

          <p className="login-subtitle">
            Sign in to continue your experience
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>

            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>

            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="error">
            {error ? "Incorrect email or password" : ""}
          </div>

        </form>

        <div className="login-footer">

          <a
            href="/forgot-password"
            className="forgot-password"
          >
            Forgot Password?
          </a>

          <div className="signup-link">
            Don't have an account?{" "}
            <a href="/register">
              Sign Up Now
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;