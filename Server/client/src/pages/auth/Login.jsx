import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../api/axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      console.log("LOGIN SUCCESS:", response.data);

      // Save JWT
      localStorage.setItem(
        "diq_token",
        response.data.token
      );

      console.log(
        "TOKEN AFTER SAVE:",
        localStorage.getItem("diq_token")
      );

      console.log("NAVIGATING TO DASHBOARD...");

      navigate("/dashboard");

    } catch (err) {
      console.error("LOGIN ERROR:", err);

      setError(
        err.response?.data?.message ||
        "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
      }}
    >
      <div
        style={{
          width: "400px",
          background: "#1e293b",
          padding: "30px",
          borderRadius: "10px",
          color: "#fff",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          🚀 DeployIQ Login
        </h1>

        {error && (
          <div
            style={{
              background: "#ef4444",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "5px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
            }}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;