import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiScissors } from "react-icons/fi";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
    if (message) setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/accounts/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.detail ||
            data.error ||
            "Login failed. Please check your credentials."
        );
        return;
      }

      if (!data.access || !data.refresh || !data.user) {
        setError("Login response is incomplete. Check backend LoginView.");
        return;
      }

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.full_name,
          phone: data.user.phone,
          role: data.user.role,
          is_superuser: data.user.is_superuser,
          is_staff: data.user.is_staff,
        })
      );

      setMessage("Login successful. Redirecting...");

      setTimeout(() => {
        if (
          data.user.role === "admin" ||
          data.user.is_superuser === true ||
          data.user.is_staff === true
        ) {
          navigate("/dashboard");
        } else {
          navigate("/my-account");
        }
      }, 800);
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-icon">
            <FiScissors />
          </span>
          <div>
            <h1>Welcome Back</h1>
            <p>Login to continue to Glora Stitches</p>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Email Address</label>
            <div className="auth-input-wrap">
              <FiMail />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Password</label>
            <div className="auth-input-wrap">
              <FiLock />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {error && <div className="auth-alert error">{error}</div>}
          {message && <div className="auth-alert success">{message}</div>}

          <button type="submit" className="auth-primary-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-switch-text">
          Don’t have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;