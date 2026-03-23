"use client";
import React, { useEffect, useState } from "react";
import { COLORS } from "../../constants";
import { gradeColor, statusColor } from "../../utils";
import { supabase } from "../../lib/supabase";

interface Batch {
  id: string;
  batch_code: string;
  farmer_name: string;
  location: string;
  rice_variety: string;
  quantity: number;
  quality_grade: string;
  status: string;
  price: number;
  harvest_date: string;
}

interface StockSummary {
  variety: string;
  total_qty: number;
  available: number;
  avg_price: number;
}

export function Marketplace() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [buyerName, setBuyerName] = useState("");
  const [tradeQty, setTradeQty] = useState("");
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<"listings" | "stocks">("listings");

  const types = ["All", "Sinandomeng", "Dinorado", "NSIC Rc 222", "Milagrosa", "C4", "IR64", "Jasmine"];

  useEffect(() => { fetchBatches(); }, []);

  const fetchBatches = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("harvest_batches")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setBatches(data || []);
    setLoading(false);
  };

  // Stock summary per variety
  const stockSummary: StockSummary[] = types.filter(t => t !== "All").map(variety => {
    const varietyBatches = batches.filter(b => b.rice_variety === variety);
    const available = varietyBatches.filter(b => b.status === "Pending" || b.status === "Listed");
    const avgPrice = available.length > 0
      ? available.reduce((sum, b) => sum + (b.price || 0), 0) / available.length
      : 0;
    return {
      variety,
      total_qty: varietyBatches.reduce((sum, b) => sum + b.quantity, 0),
      available: available.reduce((sum, b) => sum + b.quantity, 0),
      avg_price: avgPrice,
    };
  }).filter(s => s.total_qty > 0);

  const filtered = filter === "All" ? batches : batches.filter(b => b.rice_variety === filter);

  const handleBuy = async () => {
    if (!selectedBatch || !buyerName) return;
    setProcessing(true);
    const { error } = await supabase.from("transactions").insert({
      batch_id: selectedBatch.id,
      batch_code: selectedBatch.batch_code,
      buyer_name: buyerName,
      seller_name: selectedBatch.farmer_name,
      rice_variety: selectedBatch.rice_variety,
      quantity: selectedBatch.quantity,
      price_per_kg: selectedBatch.price || 0,
      total_amount: (selectedBatch.price || 0) * selectedBatch.quantity,
      type: "Buy",
      status: "Completed",
    });

    if (!error) {
      await supabase.from("harvest_batches").update({ status: "Sold" }).eq("id", selectedBatch.id);
      alert(`✅ Successfully purchased ${selectedBatch.batch_code}!`);
      setShowBuyModal(false);
      setBuyerName("");
      fetchBatches();
    } else {
      alert("Error: " + error.message);
    }
    setProcessing(false);
  };

  const handleTrade = async () => {
    if (!selectedBatch || !buyerName || !tradeQty) return;
    setProcessing(true);
    const { error } = await supabase.from("transactions").insert({
      batch_id: selectedBatch.id,
      batch_code: selectedBatch.batch_code,
      buyer_name: buyerName,
      seller_name: selectedBatch.farmer_name,
      rice_variety: selectedBatch.rice_variety,
      quantity: Number(tradeQty),
      price_per_kg: selectedBatch.price || 0,
      total_amount: (selectedBatch.price || 0) * Number(tradeQty),
      type: "Trade",
      status: "Completed",
    });

    if (!error) {
      alert(`✅ Trade offer submitted for ${selectedBatch.batch_code}!`);
      setShowTradeModal(false);
      setBuyerName("");
      setTradeQty("");
      fetchBatches();
    } else {
      alert("Error: " + error.message);
    }
    setProcessing(false);
  };

  const modalOverlay: React.CSSProperties = {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.5)", display: "flex",
    alignItems: "center", justifyContent: "center", zIndex: 1000
  };

  const modalBox: React.CSSProperties = {
    background: "#fff", borderRadius: 12, padding: 28,
    width: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: `1px solid ${COLORS.border}`, fontSize: 13,
    outline: "none", boxSizing: "border-box", marginTop: 6
  };

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {(["listings", "stocks"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: "8px 20px", borderRadius: 8,
            background: activeTab === tab ? COLORS.primary : "#fff",
            color: activeTab === tab ? "#fff" : COLORS.muted,
            border: `1px solid ${activeTab === tab ? COLORS.primary : COLORS.border}`,
            cursor: "pointer", fontWeight: 600, fontSize: 13, textTransform: "capitalize"
          }}>{tab === "listings" ? "🛒 Listings" : "📦 Stock Overview"}</button>
        ))}
      </div>

      {/* Stock Overview Tab */}
      {activeTab === "stocks" && (
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>📦 Available Rice Stocks by Variety</div>
          {stockSummary.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: COLORS.muted }}>No stocks available.</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
              {stockSummary.map(s => (
                <div key={s.variety} style={{
                  background: "#fff", borderRadius: 12,
                  border: `1px solid ${COLORS.border}`, padding: 20
                }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🌾</div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{s.variety}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 2 }}>
                    Total: <strong>{s.total_qty} kg</strong>
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 2 }}>
                    Available: <strong style={{ color: s.available > 0 ? "green" : "red" }}>{s.available} kg</strong>
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>
                    Avg Price: <strong>{s.avg_price > 0 ? `₱${s.avg_price.toFixed(2)}/kg` : "Not set"}</strong>
                  </div>
                  <div style={{
                    marginTop: 10, padding: "3px 10px", borderRadius: 20, fontSize: 10,
                    background: s.available > 0 ? "#dcfce7" : "#fee2e2",
                    color: s.available > 0 ? "#16a34a" : "#dc2626",
                    display: "inline-block", fontWeight: 700
                  }}>
                    {s.available > 0 ? "● Available" : "● Out of Stock"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Listings Tab */}
      {activeTab === "listings" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {types.map(t => (
              <button key={t} onClick={() => setFilter(t)} style={{
                padding: "6px 14px", borderRadius: 20,
                background: filter === t ? COLORS.primary : "#fff",
                color: filter === t ? "#fff" : COLORS.muted,
                border: `1px solid ${filter === t ? COLORS.primary : COLORS.border}`,
                cursor: "pointer", fontSize: 12, fontWeight: 500
              }}>{t}</button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: 60, color: COLORS.muted }}>Loading marketplace...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: COLORS.muted }}>No batches available.</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
              {filtered.map(b => (
                <div key={b.id} style={{
                  background: "#fff", borderRadius: 12,
                  border: `1px solid ${COLORS.border}`, overflow: "hidden"
                }}>
                  <div style={{
                    height: 80, background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36
                  }}>🌾</div>
                  <div style={{ padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 13 }}>{b.rice_variety}</span>
                      <span style={{
                        padding: "2px 8px", borderRadius: 20, fontSize: 10,
                        background: statusColor(b.status).bg, color: statusColor(b.status).color, fontWeight: 700
                      }}>{b.status}</span>
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 8 }}>
                      {b.farmer_name} • {b.location} • {b.quantity}kg
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.primary }}>
                        {b.price ? `₱${b.price}/kg` : <span style={{ fontSize: 11, color: COLORS.muted }}>No price</span>}
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: gradeColor(b.quality_grade) }}>Grade {b.quality_grade}</span>
                    </div>
                    <div style={{ fontSize: 10, color: COLORS.muted, marginBottom: 10 }}>
                      Token: {b.batch_code} • {new Date(b.harvest_date).toLocaleDateString()}
                    </div>

                    {b.status === "Sold" ? (
                      <div style={{
                        width: "100%", padding: "8px", borderRadius: 8,
                        background: "#f3f4f6", color: COLORS.muted,
                        textAlign: "center", fontSize: 12, fontWeight: 600
                      }}>Sold Out</div>
                    ) : (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => { setSelectedBatch(b); setShowBuyModal(true); }} style={{
                          flex: 1, padding: "8px", borderRadius: 8,
                          background: COLORS.primary, color: "#fff",
                          border: "none", cursor: "pointer", fontWeight: 600, fontSize: 12
                        }}>🛒 Buy</button>
                        <button onClick={() => { setSelectedBatch(b); setShowTradeModal(true); }} style={{
                          flex: 1, padding: "8px", borderRadius: 8,
                          background: "#fff", color: COLORS.primary,
                          border: `1px solid ${COLORS.primary}`, cursor: "pointer", fontWeight: 600, fontSize: 12
                        }}>🔄 Trade</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Buy Modal */}
      {showBuyModal && selectedBatch && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>🛒 Buy Rice Batch</div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 20 }}>
              {selectedBatch.batch_code} — {selectedBatch.rice_variety} — {selectedBatch.quantity}kg
            </div>
            <div style={{ background: "#f8f9fa", borderRadius: 8, padding: 12, marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: COLORS.muted }}>Total Amount</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.primary }}>
                ₱{((selectedBatch.price || 0) * selectedBatch.quantity).toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: COLORS.muted }}>
                ₱{selectedBatch.price}/kg × {selectedBatch.quantity}kg
              </div>
            </div>
            <label style={{ fontSize: 12, fontWeight: 600 }}>Your Name</label>
            <input style={inputStyle} value={buyerName} onChange={e => setBuyerName(e.target.value)} placeholder="Enter your name" />
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <button onClick={() => { setShowBuyModal(false); setBuyerName(""); }} style={{
                flex: 1, padding: "10px", borderRadius: 8, background: "#f3f4f6",
                border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13
              }}>Cancel</button>
              <button onClick={handleBuy} disabled={processing || !buyerName} style={{
                flex: 1, padding: "10px", borderRadius: 8,
                background: processing || !buyerName ? "#ccc" : COLORS.primary,
                color: "#fff", border: "none", cursor: processing || !buyerName ? "not-allowed" : "pointer",
                fontWeight: 600, fontSize: 13
              }}>{processing ? "Processing..." : "Confirm Purchase"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Trade Modal */}
      {showTradeModal && selectedBatch && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>🔄 Trade Offer</div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 20 }}>
              {selectedBatch.batch_code} — {selectedBatch.rice_variety}
            </div>
            <label style={{ fontSize: 12, fontWeight: 600 }}>Your Name</label>
            <input style={inputStyle} value={buyerName} onChange={e => setBuyerName(e.target.value)} placeholder="Enter your name" />
            <label style={{ fontSize: 12, fontWeight: 600, marginTop: 12, display: "block" }}>Quantity to Trade (kg)</label>
            <input style={inputStyle} type="number" value={tradeQty} onChange={e => setTradeQty(e.target.value)}
              placeholder={`Max: ${selectedBatch.quantity}kg`} max={selectedBatch.quantity} />
            {tradeQty && (
              <div style={{ marginTop: 8, fontSize: 12, color: COLORS.muted }}>
                Estimated: ₱{((selectedBatch.price || 0) * Number(tradeQty)).toLocaleString()}
              </div>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <button onClick={() => { setShowTradeModal(false); setBuyerName(""); setTradeQty(""); }} style={{
                flex: 1, padding: "10px", borderRadius: 8, background: "#f3f4f6",
                border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13
              }}>Cancel</button>
              <button onClick={handleTrade} disabled={processing || !buyerName || !tradeQty} style={{
                flex: 1, padding: "10px", borderRadius: 8,
                background: processing || !buyerName || !tradeQty ? "#ccc" : COLORS.primary,
                color: "#fff", border: "none",
                cursor: processing || !buyerName || !tradeQty ? "not-allowed" : "pointer",
                fontWeight: 600, fontSize: 13
              }}>{processing ? "Processing..." : "Submit Trade"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}