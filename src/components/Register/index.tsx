import React, { useState } from "react";
import { COLORS } from "../../constants";

interface RegisterProps {
  onRegister: (user: any) => void;
  onToggle: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegister, onToggle }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister({ name: name || email.split("@")[0], email });
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1 style={{ color: COLORS.primary, fontSize: "24px", marginBottom: "8px" }}>
          Create Account
        </h1>
        <p style={{ color: COLORS.muted, fontSize: "14px" }}>
          Join the RWA platform today
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "14px", fontWeight: 500, color: COLORS.text }}>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Juan dela Cruz"
            required
            style={{
              padding: "12px 16px",
              borderRadius: "8px",
              border: `1px solid ${COLORS.border}`,
              fontSize: "14px",
              outline: "none"
            }}
          />
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "14px", fontWeight: 500, color: COLORS.text }}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            style={{
              padding: "12px 16px",
              borderRadius: "8px",
              border: `1px solid ${COLORS.border}`,
              fontSize: "14px",
              outline: "none"
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "14px", fontWeight: 500, color: COLORS.text }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{
              padding: "12px 16px",
              borderRadius: "8px",
              border: `1px solid ${COLORS.border}`,
              fontSize: "14px",
              outline: "none"
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            marginTop: "12px",
            padding: "14px",
            background: COLORS.primary,
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 0.2s"
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = COLORS.primaryLight)}
          onMouseOut={(e) => (e.currentTarget.style.background = COLORS.primary)}
        >
          Register
        </button>
      </form>

      <div style={{ marginTop: "24px", textAlign: "center", fontSize: "14px" }}>
        <span style={{ color: COLORS.muted }}>Already have an account? </span>
        <button
          onClick={onToggle}
          style={{
            background: "none",
            border: "none",
            color: COLORS.primary,
            fontWeight: 600,
            cursor: "pointer",
            padding: 0
          }}
        >
          Log in
        </button>
      </div>
    </div>
  );
};
