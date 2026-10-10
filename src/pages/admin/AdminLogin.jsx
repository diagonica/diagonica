import React, { useState } from "react";

const API =
  import.meta.env.VITE_API_BASE_URL ||
  "https://api.rjrinfinity.com/api";

export default function AdminLogin() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usernameOrEmail,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Invalid login credentials."
        );
      }

      localStorage.setItem(
        "griphill_admin_token",
        data.token
      );

      window.location.href = "/admin";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
        padding: 20,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          padding: 35,
          borderRadius: 16,
          boxShadow: "0 10px 35px rgba(0,0,0,.1)",
        }}
      >
        <h1>Grip Hill Admin</h1>

        <p style={{ color: "#777" }}>
          Sign in to manage orders and sales.
        </p>

        <label>Username / Email</label>

        <input
          value={usernameOrEmail}
          onChange={(e) =>
            setUsernameOrEmail(e.target.value)
          }
          style={inputStyle}
          autoComplete="username"
        />

        <label>Password</label>

        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={inputStyle}
          autoComplete="current-password"
        />

        {error && (
          <div
            style={{
              color: "#b42318",
              background: "#fff1f1",
              padding: 12,
              borderRadius: 8,
              marginBottom: 15,
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={buttonStyle}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  margin: "8px 0 18px",
  border: "1px solid #ddd",
  borderRadius: 8,
};

const buttonStyle = {
  width: "100%",
  padding: 13,
  border: 0,
  borderRadius: 8,
  background: "#111",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};