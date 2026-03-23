"use client";
import React, { useState } from "react";
import { COLORS, HISTORY, SAMPLE_BATCHES, Batch } from "../../constants";

export function VerifyQR() {
  const [scanned, setScanned] = useState(false);
  const [batchId, setBatchId] = useState("RWA-2024-003");
  const batch = SAMPLE_BATCHES.find(b => b.id === batchId);
  const history = HISTORY[batchId] || [];

  const historyIcon = (s: string) => ({ origin: "🌱", token: "🏷️", market: "🛒", trade: "💰", transit: "🚚", delivered: "🏪" }[s] || "📍");

  return (
    <div style={{ maxWidth: 560 }}>
      {!scanned ? (
        <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 28, textAlign: "center" }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>📱</div>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Scan QR Code</div>
          <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 20 }}>Scan the QR code on the rice packaging to verify authenticity and view full history.</div>
          <div style={{
            width: 160, height: 160, margin: "0 auto 20px", background: COLORS.primaryDark,
            borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 72, cursor: "pointer"
          }} onClick={() => setScanned(true)}>▦</div>
          <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 16 }}>— or enter batch ID manually —</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={batchId} onChange={e => setBatchId(e.target.value)} style={{
              flex: 1, padding: "9px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 13
            }} />
            <button onClick={() => setScanned(true)} style={{
              padding: "9px 18px", background: COLORS.primary, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13
            }}>Verify</button>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ background: "#f0fdf4", borderRadius: 12, border: `1px solid #bbf7d0`, padding: 16, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 28 }}>✅</span>
            <div>
              <div style={{ fontWeight: 700, color: COLORS.success }}>Authentic & Verified</div>
              <div style={{ fontSize: 12, color: COLORS.muted }}>This rice batch has a valid RWA token</div>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20, marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Batch Details</div>
            {batch && [
              ["Batch ID", batch.id], ["Farm Origin", `${batch.farmer}, ${batch.location}`],
              ["Rice Variety", batch.type], ["Harvest Date", batch.date],
              ["Quality Grade", batch.grade], ["Current Owner", batch.owner || ""],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 13 }}>
                <span style={{ color: COLORS.muted }}>{k}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>📦 Movement History</div>
            <div style={{ position: "relative", paddingLeft: 12 }}>
              <div style={{ position: "absolute", left: 16, top: 12, bottom: 12, width: 2, background: COLORS.border }}></div>
              {history.map((h, i) => (
                <div key={i} style={{ display: "flex", gap: 14, marginBottom: 16 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", background: "#f0fdf4",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, flexShrink: 0, zIndex: 1, border: `2px solid #bbf7d0`
                  }}>{historyIcon(h.status)}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{h.event}</div>
                    <div style={{ fontSize: 11, color: COLORS.muted }}>{h.actor} • {h.location}</div>
                    <div style={{ fontSize: 10, color: COLORS.muted }}>{h.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => setScanned(false)} style={{ marginTop: 14, width: "100%", padding: "10px", background: "transparent", color: COLORS.primary, border: `1px solid ${COLORS.primary}`, borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
            Scan Another
          </button>
        </div>
      )}
    </div>
  );
}
