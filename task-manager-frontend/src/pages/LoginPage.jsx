import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice.js";
import { useLoginMutation } from "../api/auth.jsx";
import { getAvatar } from "../utils/avatarStore.js";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const [login, { isLoading }] = useLoginMutation();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username.trim() || !form.password) {
      setError("Please enter your username and password.");
      return;
    }

    try {
      const data = await login({
        username: form.username.trim(),
        password: form.password,
      }).unwrap();

      // data: { userId, username, accessToken, refreshToken, tokenType }
      // Backend doesn't return an avatar (no such field), so pull any locally
      // saved picture for this username back in on login.
      const avatar = getAvatar(data.username);
      dispatch(setUser(avatar ? { ...data, avatar } : data));
      navigate("/tasks");
    } catch (err) {
      const data = err?.data;
      const message =
        data?.message ||
        (typeof data === "object" && data ? Object.values(data).flat().join(" ") : null) ||
        "Invalid username or password.";
      setError(message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-mark" aria-hidden="true" />
          Tasks
        </div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Log in to pick up where you left off.</p>

        {error && <div className="auth-message auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="username"
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Your password"
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}
