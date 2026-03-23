"use client";
import React, { useEffect, useState } from "react";
import { COLORS } from "../../constants";
import { supabase } from "../../lib/supabase";

interface Batch {
  id: string;
  batch_code: string;
  farmer_name: string;
  rice_variety: string;
  quantity: number;
  status: string;
}

interface Logistics {
  id: string;
  batch_id: string;
  batch_code: string;
  rice_variety: string;
  quantity: number;
  farmer_name: string;
  current_status: string;
  current_location: string;
  updated_at: string;
}

interface LogisticsHistory {
  id: string;
  status: string;
  location: string;
  scanned_by: string;
  created_at: string;
}

const STATUSES = ["Order Placed", "Picked Up", "In Transit", "Arrived at Warehouse", "Out for Delivery", "Delivered"];

export function Logistics() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [logistics, setLogistics] = useState<Logistics[]>([]);
  const [history, setHistory] = useState<LogisticsHistory[]>([]);
  const [selectedLogistics, setSelectedLogistics] = useState<Logistics | null>(null);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [newStatus, setNewStatus] = useState("Order Placed");
  const [newLocation, setNewLocation] = useState("");
  const [scannedBy, setScannedBy] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const { data: batchData } = await supabase
      .from("harvest_batches")
      .select("*")
      .not("status", "eq", "Sold");

    const { data: logisticsData } = await supabase
      .from("logistics")
      .select("*")
      .order("updated_at", { ascending: false });

    setBatches(batchData || []);
    setLogistics(logisticsData || []);
    setLoading(false);
  };

  const fetchHistory = async (logisticsId: string) => {
    const { data } = await supabase
      .from("logistics_history")
      .select("*")
      .eq("logistics_id", logisticsId)
      .order("created_at", { ascending: true });
    setHistory(data || []);
  };

  const handleSelectLogistics = (l: Logistics) => {
    setSelectedLogistics(l);
    fetchHistory(l.id);
  };

  const handleAddShipment = async () => {
    if (!selectedBatchId) return;
    setProcessing(true);

    const batch = batches.find(b => b.id === selectedBatchId);
    if (!batch) return;

    const { data, error } = await supabase.from("logistics").insert({
      batch_id: batch.id,
      batch_code: batch.batch_code,
      rice_variety: batch.rice_variety,
      quantity: batch.quantity,
      farmer_name: batch.farmer_name,
      current_status: "Order Placed",
      current_location: "Origin",
    }).select().single();

    if (!error && data) {
      await supabase.from("logistics_history").insert({
        logistics_id: data.id,
        status: "Order Placed",
        location: "Origin",
        scanned_by: "System",
      });
      alert("✅ Shipment created!");
      setShowAddModal(false);
      setSelectedBatchId("");
      fetchData();
    } else {
      alert("Error: " + error?.message);
    }
    setProcessing(false);
  };

  const handleUpdateStatus = async () => {
    if (!selectedLogistics || !newStatus || !newLocation || !scannedBy) return;
    setProcessing(true);

    await supabase.from("logistics").update({
      current_status: newStatus,
      current_location: newLocation,
      updated_at: new Date().toISOString(),
    }).eq("id", selectedLogistics.id);

    await supabase.from("logistics_history").insert({
      logistics_id: selectedLogistics.id,
      status: newStatus,
      location: newLocation,
      scanned_by: scannedBy,
    });

    if (newStatus === "Delivered") {
      await supabase.from("harvest_batches").update({ status: "Delivered" }).eq("id", selectedLogistics.batch_id);
    }

    alert("✅ Status updated!");
    setNewLocation("");
    setScannedBy("");
    fetchData();
    fetchHistory(selectedLogistics.id);
    setSelectedLogistics(prev => prev ? { ...prev, current_status: newStatus, current_location: newLocation } : null);
    setProcessing(false);
  };

  const modalOverlay: React.CSSProperties = {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.5)", display: "flex",
    alignItems: "center", justifyContent: "center", zIndex: 1000
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: `1px solid ${COLORS.border}`, fontSize: 13,
    outline: "none", boxSizing: "border-box", marginTop: 6
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

      {/* Left: Shipment List */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>🚚 Active Shipments</div>
          <button onClick={() => setShowAddModal(true)} style={{
            padding: "6px 14px", background: COLORS.primary, color: "#fff",
            border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 12
          }}>+ New Shipment</button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: COLORS.muted }}>Loading...</div>
        ) : logistics.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: COLORS.muted }}>No shipments yet.</div>
        ) : (
          logistics.map(l => (
            <div key={l.id} onClick={() => handleSelectLogistics(l)} style={{
              background: selectedLogistics?.id === l.id ? "#f0f7ff" : "#fff",
              borderRadius: 10, border: `1px solid ${selectedLogistics?.id === l.id ? COLORS.primary : COLORS.border}`,
              padding: 14, marginBottom: 10, cursor: "pointer"
            }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: COLORS.primary }}>{l.batch_code}</div>
              <div style={{ fontSize: 11, color: COLORS.muted }}>{l.rice_variety} • {l.quantity}kg • {l.farmer_name}</div>
              <div style={{ fontSize: 11, marginTop: 4 }}>
                <span style={{
                  padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700,
                  background: l.current_status === "Delivered" ? "#dcfce7" : "#fef9c3",
                  color: l.current_status === "Delivered" ? "#16a34a" : "#92400e"
                }}>{l.current_status}</span>
                <span style={{ color: COLORS.muted, marginLeft: 8 }}>📍 {l.current_location}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Right: Tracking + Update */}
      <div>
        {!selectedLogistics ? (
          <div style={{
            background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`,
            padding: 40, textAlign: "center", color: COLORS.muted, fontSize: 13
          }}>Select a shipment to view tracking</div>
        ) : (
          <>
            {/* Tracking Timeline */}
            <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>📦 {selectedLogistics.batch_code}</div>
              <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 16 }}>
                {selectedLogistics.rice_variety} • {selectedLogistics.quantity}kg • {selectedLogistics.farmer_name}
              </div>

              <div style={{ position: "relative", paddingLeft: 24 }}>
                <div style={{ position: "absolute", left: 8, top: 8, bottom: 8, width: 2, background: COLORS.border }}></div>
                {STATUSES.map((s, i) => {
                  const currentIdx = STATUSES.indexOf(selectedLogistics.current_status);
                  const historyItem = history.find(h => h.status === s);
                  return (
                    <div key={i} style={{ position: "relative", marginBottom: 18, display: "flex", alignItems: "flex-start", gap: 14 }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                        background: i < currentIdx ? COLORS.success : i === currentIdx ? COLORS.primary : COLORS.border,
                        border: i === currentIdx ? `3px solid ${COLORS.primaryLight}` : "none",
                        position: "relative", zIndex: 1, marginLeft: -8
                      }}></div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: i <= currentIdx ? 600 : 400, color: i <= currentIdx ? COLORS.text : COLORS.muted }}>{s}</div>
                        {historyItem && (
                          <div style={{ fontSize: 11, color: COLORS.muted }}>
                            {new Date(historyItem.created_at).toLocaleString()} • {historyItem.location} • by {historyItem.scanned_by}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Update Status */}
            <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>📍 Update Location</div>
              <select value={newStatus} onChange={e => setNewStatus(e.target.value)} style={{ ...inputStyle, marginBottom: 10 }}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
              <input value={newLocation} onChange={e => setNewLocation(e.target.value)}
                placeholder="Current location (e.g. Cabanatuan City)" style={{ ...inputStyle, marginBottom: 10 }} />
              <input value={scannedBy} onChange={e => setScannedBy(e.target.value)}
                placeholder="Scanned by (e.g. Juan dela Cruz)" style={{ ...inputStyle, marginBottom: 12 }} />
              <button onClick={handleUpdateStatus} disabled={processing || !newLocation || !scannedBy} style={{
                width: "100%", padding: "10px", background: processing ? "#ccc" : COLORS.primary,
                color: "#fff", border: "none", borderRadius: 8,
                cursor: processing ? "not-allowed" : "pointer", fontWeight: 600, fontSize: 13
              }}>{processing ? "Updating..." : "Update Status"}</button>
            </div>
          </>
        )}
      </div>

      {/* Add Shipment Modal */}
      {showAddModal && (
        <div style={modalOverlay}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 28, width: 400 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>🚚 New Shipment</div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 20 }}>Select a batch to create a shipment</div>
            <select value={selectedBatchId} onChange={e => setSelectedBatchId(e.target.value)} style={inputStyle}>
              <option value="">Select batch...</option>
              {batches.map(b => (
                <option key={b.id} value={b.id}>{b.batch_code} — {b.rice_variety} — {b.quantity}kg</option>
              ))}
            </select>
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <button onClick={() => setShowAddModal(false)} style={{
                flex: 1, padding: "10px", borderRadius: 8, background: "#f3f4f6",
                border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13
              }}>Cancel</button>
              <button onClick={handleAddShipment} disabled={processing || !selectedBatchId} style={{
                flex: 1, padding: "10px", borderRadius: 8,
                background: processing || !selectedBatchId ? "#ccc" : COLORS.primary,
                color: "#fff", border: "none",
                cursor: processing || !selectedBatchId ? "not-allowed" : "pointer",
                fontWeight: 600, fontSize: 13
              }}>{processing ? "Creating..." : "Create Shipment"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}