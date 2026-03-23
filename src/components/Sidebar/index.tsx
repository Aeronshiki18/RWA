import React from "react";
import { COLORS, NAV_ITEMS, NavItem } from "../../constants";

interface SidebarProps {
  active: string;
  setActive: (id: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onLogout: () => void;
}

export function Sidebar({ active, setActive, collapsed, setCollapsed, onLogout }: SidebarProps) {
  return (
    <aside style={{
      width: collapsed ? 60 : 220,
      minHeight: "100vh",
      background: COLORS.primaryDark,
      display: "flex",
      flexDirection: "column",
      transition: "width 0.2s",
      position: "fixed",
      left: 0,
      top: 0,
      bottom: 0,
      zIndex: 100,
    }}>
      <div style={{ padding: "20px 12px 12px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid rgba(255,255,255,0.1)` }}>
        <span style={{ fontSize: 22 }}>🌾</span>
        {!collapsed && <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>RiceChain PH</div>
          <div style={{ color: COLORS.accentLight, fontSize: 10 }}>RWA Trading Platform</div>
        </div>}
      </div>

      <nav style={{ flex: 1, padding: "12px 0" }}>
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)} style={{
            display: "flex", alignItems: "center", gap: 10,
            width: "100%", padding: collapsed ? "10px 18px" : "10px 16px",
            background: active === item.id ? "rgba(255,255,255,0.12)" : "transparent",
            border: "none", borderLeft: active === item.id ? `3px solid ${COLORS.accentLight}` : "3px solid transparent",
            color: active === item.id ? "#fff" : "rgba(255,255,255,0.6)",
            cursor: "pointer", fontSize: 13, fontWeight: active === item.id ? 600 : 400,
            transition: "all 0.15s",
            whiteSpace: "nowrap", overflow: "hidden",
          }}>
            <span style={{ fontSize: 16, minWidth: 20, textAlign: "center" }}>{item.icon}</span>
            {!collapsed && item.label}
          </button>
        ))}
      </nav>

      <button onClick={onLogout} style={{
        margin: "0 12px 12px", padding: "10px", background: "rgba(220, 38, 38, 0.15)",
        border: "none", borderRadius: 6, color: "#fca5a5",
        cursor: "pointer", fontSize: 13, fontWeight: 600, textAlign: "center",
        transition: "all 0.2s"
      }} onMouseOver={(e) => e.currentTarget.style.background = "rgba(220, 38, 38, 0.25)"}
         onMouseOut={(e) => e.currentTarget.style.background = "rgba(220, 38, 38, 0.15)"}>
        {collapsed ? "⏻" : "Log Out"}
      </button>

      <button onClick={() => setCollapsed(!collapsed)} style={{
        margin: "0 12px 12px", padding: "8px", background: "rgba(255,255,255,0.08)",
        border: "none", borderRadius: 6, color: "rgba(255,255,255,0.5)",
        cursor: "pointer", fontSize: 12, textAlign: "center"
      }}>
        {collapsed ? "→" : "← Collapse"}
      </button>
    </aside>
  );
}
