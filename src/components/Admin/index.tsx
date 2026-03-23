import React, { useEffect, useState } from "react";
import { COLORS } from "../../constants";
import { gradeColor, statusColor } from "../../utils";
import { StatCard } from "../StatCard";
import { supabase } from "../../lib/supabase";

interface Batch {
  id: string;
  batch_code: string;
  farmer_name: string;
  rice_variety: string;
  quantity: number;
  quality_grade: string;
  status: string;
  location: string;
  harvest_date: string;
  created_at: string;
}

export function Admin() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("harvest_batches")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching batches:", error.message);
    } else {
      setBatches(data || []);
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard label="Total Batches" value={String(batches.length)} color={COLORS.primary} />
        <StatCard label="Pending" value={String(batches.filter(b => b.status === "Pending").length)} color={COLORS.danger} />
        <StatCard label="Tokenized" value={String(batches.filter(b => b.status === "Tokenized").length)} color={COLORS.info} />
        <StatCard label="Total Quantity (kg)" value={String(batches.reduce((sum, b) => sum + b.quantity, 0))} color={COLORS.accent} />
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>All Rice Batches</div>
          <button onClick={fetchBatches} style={{
            padding: "5px 14px", background: COLORS.primary, color: "#fff",
            border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600
          }}>🔄 Refresh</button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: COLORS.muted }}>Loading batches...</div>
        ) : batches.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: COLORS.muted }}>No batches submitted yet.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
                {["Batch ID", "Farmer", "Location", "Variety", "Qty (kg)", "Grade", "Status", "Date"].map(h => (
                  <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: COLORS.muted, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {batches.map(b => (
                <tr key={b.id} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  <td style={{ padding: "10px", fontWeight: 700, color: COLORS.primary }}>{b.batch_code}</td>
                  <td style={{ padding: "10px" }}>{b.farmer_name}</td>
                  <td style={{ padding: "10px" }}>{b.location}</td>
                  <td style={{ padding: "10px" }}>{b.rice_variety}</td>
                  <td style={{ padding: "10px" }}>{b.quantity}</td>
                  <td style={{ padding: "10px", fontWeight: 700, color: gradeColor(b.quality_grade) }}>{b.quality_grade}</td>
                  <td style={{ padding: "10px" }}>
                    <span style={{
                      padding: "2px 8px", borderRadius: 20, fontSize: 10,
                      background: statusColor(b.status).bg, color: statusColor(b.status).color, fontWeight: 700
                    }}>{b.status}</span>
                  </td>
                  <td style={{ padding: "10px" }}>{new Date(b.harvest_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}