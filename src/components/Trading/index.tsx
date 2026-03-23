"use client";
import React, { useState } from "react";
import { COLORS, SAMPLE_BATCHES, Batch } from "../../constants";

export function Trading() {
  const [step, setStep] = useState(0);
  const batch = SAMPLE_BATCHES[0];
  const steps = ["Select Batch", "Confirm Purchase", "Payment", "Ownership Transferred"];

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
            <div onClick={() => setStep(i)} style={{
              width: 28, height: 28, borderRadius: "50%",
              background: i <= step ? COLORS.primary : COLORS.border,
              color: i <= step ? "#fff" : COLORS.muted,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0
            }}>{i < step ? "✓" : i + 1}</div>
            {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: i < step ? COLORS.primary : COLORS.border, margin: "0 6px" }}></div>}
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 24 }}>
        {step === 0 && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Selected Batch</div>
            {[["Batch ID", batch.id], ["Farmer", batch.farmer], ["Type", batch.type], ["Quantity", `${batch.qty} kg`], ["Grade", batch.grade], ["Price", `₱${batch.price}/kg`], ["Total", `₱${batch.price * batch.qty}`]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 13 }}>
                <span style={{ color: COLORS.muted }}>{k}</span>
                <span style={{ fontWeight: k === "Total" ? 700 : 500, color: k === "Total" ? COLORS.primary : COLORS.text }}>{v}</span>
              </div>
            ))}
            <button onClick={() => setStep(1)} style={{ marginTop: 20, width: "100%", padding: "11px", background: COLORS.primary, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
              Proceed to Confirm
            </button>
          </div>
        )}
        {step === 1 && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Confirm Purchase</div>
            <div style={{ background: "#f0fdf4", borderRadius: 8, padding: 16, marginBottom: 16, fontSize: 13 }}>
              <div>You are buying <strong>{batch.qty}kg</strong> of <strong>{batch.type}</strong></div>
              <div style={{ marginTop: 4 }}>Total: <strong style={{ color: COLORS.primary }}>₱{batch.price * batch.qty}</strong></div>
            </div>
            <button onClick={() => setStep(2)} style={{ width: "100%", padding: "11px", background: COLORS.primary, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
              Confirm & Pay
            </button>
          </div>
        )}
        {step === 2 && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Payment Processing</div>
            <div style={{ display: "grid", gap: 12 }}>
              {["GCash", "Bank Transfer", "Cash on Delivery"].map(method => (
                <button key={method} onClick={() => setStep(3)} style={{
                  padding: "12px", background: "#f9f9f7", border: `1px solid ${COLORS.border}`,
                  borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500, textAlign: "left"
                }}>💳 {method}</button>
              ))}
            </div>
          </div>
        )}
        {step === 3 && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <div style={{ fontWeight: 700, fontSize: 18, color: COLORS.success, marginBottom: 8 }}>Purchase Complete!</div>
            <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 16 }}>
              Ownership of <strong>{batch.id}</strong> transferred to you.
            </div>
            <div style={{ background: "#f0fdf4", borderRadius: 8, padding: 12, fontSize: 12, color: COLORS.success }}>
              Transaction recorded on blockchain • Token updated
            </div>
            <button onClick={() => setStep(0)} style={{ marginTop: 16, padding: "10px 24px", background: COLORS.primary, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
              New Transaction
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
