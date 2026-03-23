import React from "react";
import { COLORS } from "../../constants";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}

export function StatCard({ label, value, sub, color }: StatCardProps) {
  return (
    <div style={{
      background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`,
      padding: "16px 20px", flex: 1, minWidth: 140,
    }}>
      <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: color || COLORS.text }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}
