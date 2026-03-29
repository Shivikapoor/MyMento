import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";
import { setAuth } from "../utils/auth";
import "../App.css";

const OTP_RESEND_SECONDS = 60;

async function readApiResponse(res) {
  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return res.json();
  }

  const text = await res.text();

  if (!res.ok && text.includes("<!DOCTYPE")) {
    return {
      message:
        `API route not found. Please make sure the backend server is running on ${API_URL}.`,
    };
  }

  return {
    message: text || "Unexpected server response",
  };
}

function LoginSignup({ initialMode = "login" }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(initialMode !== "signup");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState("email");
  const [forgotData, setForgotData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [authNotice, setAuthNotice] = useState("");

  useEffect(() => {
    setIsLogin(initialMode !== "signup");
    setFormData({ name: "", email: "", password: "" });
  }, [initialMode]);

  useEffect(() => {
    if (!resendTimer) return undefined;

    const timer = window.setTimeout(() => {
      setResendTimer((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendTimer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleForgotChange = (event) => {
    setForgotData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const resetFormForMode = (nextIsLogin) => {
    setIsLogin(nextIsLogin);
    setFormData({ name: "", email: "", password: "" });
    setAuthNotice("");
  };

  const closeForgotFlow = () => {
    setForgotOpen(false);
    setForgotStep("email");
    setForgotData({
      email: "",
      otp: "",
      password: "",
      confirmPassword: "",
    });
    setForgotMessage("");
    setForgotError("");
    setForgotLoading(false);
    setResendTimer(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isLogin
        ? `${API_URL}/api/auth/login`
        : `${API_URL}/api/auth/signup`;

      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await readApiResponse(res);

      if (res.ok) {
        setAuthNotice("");
        setAuth(data.token, data.user);
        navigate(
          data.user?.role === "counsellor"
            ? "/counsellor-dashboard"
            : "/"
        );
      } else {
        alert(data.message || "Authentication failed");
      }
    } catch (error) {
      alert("Server error: " + error.message);
    }
  };

  const sendOtpRequest = async (email) => {
    const res = await fetch(`${API_URL}/api/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await readApiResponse(res);

    if (!res.ok) {
      throw new Error(data.message || "Unable to send OTP");
    }

    return data;
  };

  const handleReceiveOtp = async (event) => {
    event.preventDefault();
    setForgotLoading(true);
    setForgotError("");
    setForgotMessage("");

    try {
      const data = await sendOtpRequest(forgotData.email);
      setForgotStep("otp");
      setForgotMessage(`${data.message}. OTP expires in 10 minutes.`);
      setResendTimer(OTP_RESEND_SECONDS);
    } catch (error) {
      setForgotError(error.message);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setForgotLoading(true);
    setForgotError("");
    setForgotMessage("");

    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotData.email,
          otp: forgotData.otp,
        }),
      });

      const data = await readApiResponse(res);

      if (!res.ok) {
        throw new Error(data.message || "Unable to verify OTP");
      }

      setForgotStep("reset");
      setForgotMessage("OTP verified. Please set your new password.");
    } catch (error) {
      setForgotError(error.message);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setForgotLoading(true);
    setForgotError("");
    setForgotMessage("");

    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(forgotData),
      });

      const data = await readApiResponse(res);

      if (!res.ok) {
        throw new Error(data.message || "Unable to reset password");
      }

      closeForgotFlow();
      resetFormForMode(true);
      setAuthNotice("Password reset successful. Please login.");
    } catch (error) {
      setForgotError(error.message);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setForgotLoading(true);
    setForgotError("");
    setForgotMessage("");

    try {
      const data = await sendOtpRequest(forgotData.email);
      setForgotMessage(`${data.message}. OTP expires in 10 minutes.`);
      setResendTimer(OTP_RESEND_SECONDS);
    } catch (error) {
      setForgotError(error.message);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="container auth-page">
      <div className="auth-card">
        <h1 className="brand-title">
          <img src="/images/Logo.png" alt="MyMento logo" className="brand-logo brand-logo-title" />
          <span>MyMento</span>
        </h1>

        <div className={`auth-toggle ${isLogin ? "login-active" : "signup-active"}`}>
          <button
            type="button"
            className={isLogin ? "active" : ""}
            onClick={() => resetFormForMode(true)}
          >
            Login
          </button>
          <button
            type="button"
            className={!isLogin ? "active" : ""}
            onClick={() => resetFormForMode(false)}
          >
            Signup
          </button>
        </div>

        <h2>{isLogin ? "Login" : "Sign up"}</h2>

        {authNotice ? <p className="auth-notice">{authNotice}</p> : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <span className="input-icon">👤</span>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="input-group">
            <span className="input-icon">✉️</span>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {isLogin && (
            <div className="forgot-password-row">
              <button
                type="button"
                className="forgot-password"
                onClick={() => {
                  setForgotOpen(true);
                  setForgotData((prev) => ({
                    ...prev,
                    email: formData.email,
                  }));
                  setForgotStep("email");
                  setForgotError("");
                  setForgotMessage("");
                }}
              >
                Forgot password?
              </button>
            </div>
          )}

          <button type="submit" className="primary-btn">
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>

        <p className="auth-link">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => resetFormForMode(!isLogin)}
            className="toggle-auth-btn"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>

      {forgotOpen ? (
        <div className="forgot-modal-backdrop" onClick={closeForgotFlow}>
          <div
            className="auth-card forgot-password-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="forgot-card-header">
              <h2>
                {forgotStep === "email"
                  ? "Enter Email"
                  : forgotStep === "otp"
                    ? "Enter OTP"
                    : "Reset Password"}
              </h2>
              <button
                type="button"
                className="forgot-close-btn"
                onClick={closeForgotFlow}
              >
                Close
              </button>
            </div>

            {forgotMessage ? <p className="forgot-success">{forgotMessage}</p> : null}
            {forgotError ? <p className="forgot-error">{forgotError}</p> : null}

            {forgotStep === "email" ? (
              <form className="auth-form" onSubmit={handleReceiveOtp}>
                <div className="input-group">
                  <span className="input-icon">✉️</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Registered email address"
                    value={forgotData.email}
                    onChange={handleForgotChange}
                    required
                  />
                </div>

                <button type="submit" className="primary-btn" disabled={forgotLoading}>
                  {forgotLoading ? "Sending..." : "Receive OTP"}
                </button>
              </form>
            ) : null}

            {forgotStep === "otp" ? (
              <form className="auth-form" onSubmit={handleVerifyOtp}>
                <p className="forgot-helper-text">OTP expires in 10 minutes</p>
                <div className="input-group">
                  <span className="input-icon">🔐</span>
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter 6-digit OTP"
                    value={forgotData.otp}
                    onChange={handleForgotChange}
                    maxLength={6}
                    required
                  />
                </div>

                <button type="submit" className="primary-btn" disabled={forgotLoading}>
                  {forgotLoading ? "Verifying..." : "Verify OTP"}
                </button>

                <button
                  type="button"
                  className="forgot-resend-btn"
                  onClick={handleResendOtp}
                  disabled={forgotLoading || resendTimer > 0}
                >
                  {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                </button>
              </form>
            ) : null}

            {forgotStep === "reset" ? (
              <form className="auth-form" onSubmit={handleResetPassword}>
                <div className="input-group">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    name="password"
                    placeholder="New password"
                    value={forgotData.password}
                    onChange={handleForgotChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={forgotData.confirmPassword}
                    onChange={handleForgotChange}
                    required
                  />
                </div>

                <button type="submit" className="primary-btn" disabled={forgotLoading}>
                  {forgotLoading ? "Saving..." : "Reset Password"}
                </button>
              </form>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default LoginSignup;
