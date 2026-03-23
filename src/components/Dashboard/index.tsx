import React from "react";
import { COLORS, SAMPLE_BATCHES, Batch } from "../../constants";
import { statusColor } from "../../utils";
import { StatCard } from "../StatCard";

export function Dashboard() {
  return (
    <div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard label="Total Batches" value="1,248" sub="+12 this week" color={COLORS.primary} />
        <StatCard label="Active Tokens" value="342" sub="RWA tokens" color={COLORS.info} />
        <StatCard label="Total Volume" value="₱4.2M" sub="This month" color={COLORS.accent} />
        <StatCard label="Farmers" value="186" sub="Registered" color={COLORS.success} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 14, fontSize: 14 }}>Recent Batches</div>
          {SAMPLE_BATCHES.map(b => (
            <div key={b.id} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 0", borderBottom: `1px solid ${COLORS.border}`
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{b.id}</div>
                <div style={{ fontSize: 11, color: COLORS.muted }}>{b.farmer} • {b.type}</div>
              </div>
              <span style={{
                padding: "2px 10px", borderRadius: 20, fontSize: 11,
                background: statusColor(b.status).bg, color: statusColor(b.status).color, fontWeight: 600
              }}>{b.status}</span>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 14, fontSize: 14 }}>Flow Overview</div>
          {[
            { step: "1. Farmer Registration", count: "186 farmers", color: COLORS.primary },
            { step: "2. Harvest Input", count: "1,248 batches", color: COLORS.primaryLight },
            { step: "3. Tokenization", count: "1,248 tokens", color: COLORS.accent },
            { step: "4. Marketplace Listing", count: "342 active", color: COLORS.info },
            { step: "5. Trading", count: "906 sold", color: COLORS.success },
            { step: "6. Distribution", count: "820 delivered", color: COLORS.warning },
            { step: "7. Consumer Verify", count: "4,210 scans", color: COLORS.muted },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: f.color, flexShrink: 0 }}></div>
              <div style={{ fontSize: 12, flex: 1, color: COLORS.text }}>{f.step}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: f.color }}>{f.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
