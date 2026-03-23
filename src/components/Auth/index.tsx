import React, { useState } from "react";
import { COLORS } from "../../constants";
import { Login } from "../Login";
import { Register } from "../Register";

interface AuthProps {
  onLogin: (user: any) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: COLORS.bg,
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        padding: "40px",
        background: COLORS.card,
        borderRadius: "16px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
        border: `1px solid ${COLORS.border}`
      }}>
        {isLogin ? (
          <Login onLogin={onLogin} onToggle={() => setIsLogin(false)} />
        ) : (
          <Register onRegister={onLogin} onToggle={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};
