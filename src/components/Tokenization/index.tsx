"use client";
import React, { useState } from "react";
import { COLORS, SAMPLE_BATCHES, Batch } from "../../constants";
import { gradeColor } from "../../utils";

export function Tokenization() {
  const [selected, setSelected] = useState<Batch | null>(null);

  return (
    <div>
      <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 16 }}>
        Select a batch to generate its RWA Token and QR Code.
      </div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {SAMPLE_BATCHES.map(b => (
          <div key={b.id} onClick={() => setSelected(b)} style={{
            background: "#fff", borderRadius: 12, border: `2px solid ${selected?.id === b.id ? COLORS.primary : COLORS.border}`,
            padding: 18, width: 220, cursor: "pointer", transition: "all 0.15s",
          }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.primary, marginBottom: 6 }}>{b.id}</div>
            <div style={{ fontSize: 12, color: COLORS.muted }}>{b.farmer}</div>
            <div style={{ fontSize: 12, color: COLORS.muted }}>{b.type} • {b.qty}kg</div>
            <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: gradeColor(b.grade) }}>Grade {b.grade}</span>
              <span style={{ fontSize: 11, color: COLORS.muted }}>{b.location}</span>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ marginTop: 28, background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 28, maxWidth: 500 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.primary, marginBottom: 16 }}>🏷️ Token Generated</div>
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
            <div style={{
              width: 100, height: 100, background: COLORS.primaryDark, borderRadius: 10,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 11, gap: 4,
            }}>
              <span style={{ fontSize: 28 }}>▦</span>
              <span style={{ fontSize: 9, opacity: 0.7 }}>{selected.qr}</span>
            </div>
            <div style={{ flex: 1 }}>
              {[
                ["Token ID", selected.id],
                ["Farmer", selected.farmer],
                ["Type", selected.type],
                ["Qty", `${selected.qty} kg`],
                ["Grade", selected.grade],
                ["Owner", selected.farmer],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${COLORS.border}`, padding: "6px 0", fontSize: 12 }}>
                  <span style={{ color: COLORS.muted }}>{k}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{
            marginTop: 16, padding: "10px 16px", background: "#f0fdf4", borderRadius: 8,
            fontSize: 12, color: COLORS.success, fontWeight: 600, textAlign: "center"
          }}>
            ✅ RWA Token Created & QR Code Generated
          </div>
        </div>
      )}
    </div>
  );
}
