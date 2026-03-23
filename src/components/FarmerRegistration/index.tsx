"use client";
import React, { useState } from "react";
import { COLORS } from "../../constants";
import { supabase } from "../../lib/supabase";

export function FarmerRegistration() {
  const [form, setForm] = useState({ name: "", location: "", type: "", qty: "", date: "", grade: "A" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [batchCode, setBatchCode] = useState("");

  const F = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(p => ({ ...p, [k]: e.target.value }));

  const inputStyle = {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: `1px solid ${COLORS.border}`, fontSize: 13,
    outline: "none", boxSizing: "border-box" as const, background: "#fafaf8"
  };
  const labelStyle = { fontSize: 12, color: COLORS.muted, marginBottom: 4, display: "block", fontWeight: 500 };

  const handleSubmit = async () => {
    if (!form.name || !form.location || !form.type || !form.qty || !form.date) return;

    setLoading(true);

    const code = `RWA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;

    const { error } = await supabase.from("harvest_batches").insert({
      batch_code: code,
      farmer_name: form.name,
      location: form.location,
      rice_variety: form.type,
      quantity: Number(form.qty),
      harvest_date: form.date,
      quality_grade: form.grade,
      status: "Pending",
    });

    setLoading(false);

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    setBatchCode(code);
    setSubmitted(true);
  };

  if (submitted) return (
    <div style={{ maxWidth: 500, margin: "40px auto", textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.primary, marginBottom: 8 }}>Harvest Submitted!</div>
      <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 20 }}>
        Batch <strong>{batchCode}</strong> has been created and is ready for tokenization.
      </div>
      <button onClick={() => { setSubmitted(false); setForm({ name: "", location: "", type: "", qty: "", date: "", grade: "A" }); }} style={{
        padding: "10px 24px", background: COLORS.primary, color: "#fff",
        border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13
      }}>Submit Another</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 28 }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4, color: COLORS.primary }}>🌾 Farmer Harvest Registration</div>
        <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 24 }}>Register a new rice batch for tokenization</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={labelStyle}>Farmer Name</label>
            <input style={inputStyle} value={form.name} onChange={F("name")} placeholder="e.g. Juan dela Cruz" />
          </div>
          <div>
            <label style={labelStyle}>Location / Province</label>
            <input style={inputStyle} value={form.location} onChange={F("location")} placeholder="e.g. Nueva Ecija" />
          </div>
          <div>
            <label style={labelStyle}>Rice Variety</label>
            <select style={inputStyle} value={form.type} onChange={F("type")}>
              <option value="">Select variety</option>
              {["Sinandomeng", "Dinorado", "NSIC Rc 222", "Milagrosa", "C4", "IR64", "Jasmine"].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Quantity (kg)</label>
            <input style={inputStyle} type="number" value={form.qty} onChange={F("qty")} placeholder="e.g. 500" />
          </div>
          <div>
            <label style={labelStyle}>Harvest Date</label>
            <input style={inputStyle} type="date" value={form.date} onChange={F("date")} />
          </div>
          <div>
            <label style={labelStyle}>Quality Grade</label>
            <select style={inputStyle} value={form.grade} onChange={F("grade")}>
              {["A+", "A", "B+", "B", "C"].map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            marginTop: 24, padding: "11px 28px", background: loading ? "#ccc" : COLORS.primary, color: "#fff",
            border: "none", borderRadius: 8, cursor: loading ? "not-allowed" : "pointer", fontWeight: 600, fontSize: 14,
            width: "100%",
          }}>
          {loading ? "Submitting..." : "Submit Harvest Batch"}
        </button>
      </div>
    </div>
  );
}