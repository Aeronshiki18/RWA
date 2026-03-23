export interface Batch {
  id: string;
  farmer: string;
  location: string;
  type: string;
  qty: number;
  grade: string;
  date: string;
  price: number;
  status: string;
  owner?: string;
  qr?: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
}

export const COLORS = {
  primary: "#1a5c2e",
  primaryLight: "#2d8a47",
  primaryDark: "#0f3d1e",
  accent: "#e8a020",
  accentLight: "#f5c842",
  bg: "#f7f5f0",
  card: "#ffffff",
  text: "#1a1a18",
  muted: "#6b7280",
  border: "#e5e1d8",
  success: "#16a34a",
  warning: "#d97706",
  danger: "#dc2626",
  info: "#2563eb",
};

export const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "farmer", label: "Farmer Registration", icon: "🌾" },
  { id: "tokenize", label: "Tokenization", icon: "🏷️" },
  { id: "marketplace", label: "Marketplace", icon: "🛒" },
  { id: "trading", label: "Trading", icon: "💰" },
  { id: "logistics", label: "Logistics", icon: "🚚" },
  { id: "verify", label: "Verify QR", icon: "📱" },
  { id: "admin", label: "Admin", icon: "🧑💼" },
];

export const SAMPLE_BATCHES: Batch[] = [
  { id: "RWA-2024-001", farmer: "Juan dela Cruz", location: "Nueva Ecija", type: "Sinandomeng", qty: 500, grade: "A", date: "2024-03-01", price: 45, status: "Listed", owner: "Juan dela Cruz", qr: "QR001" },
  { id: "RWA-2024-002", farmer: "Maria Santos", location: "Pangasinan", type: "Dinorado", qty: 300, grade: "B+", date: "2024-03-05", price: 52, status: "In Transit", owner: "Trader A", qr: "QR002" },
  { id: "RWA-2024-003", farmer: "Pedro Reyes", location: "Isabela", type: "NSIC Rc 222", qty: 800, grade: "A+", date: "2024-03-10", price: 60, status: "Delivered", owner: "SM Supermarket", qr: "QR003" },
  { id: "RWA-2024-004", farmer: "Ana Bautista", location: "Tarlac", type: "Milagrosa", qty: 200, grade: "A", date: "2024-03-12", price: 48, status: "Listed", owner: "Ana Bautista", qr: "QR004" },
];

export const HISTORY: Record<string, any[]> = {
  "RWA-2024-003": [
    { date: "2024-03-10", event: "Harvest Logged", actor: "Pedro Reyes (Farmer)", location: "Isabela Farm", status: "origin" },
    { date: "2024-03-11", event: "Token Created", actor: "System", location: "Platform", status: "token" },
    { date: "2024-03-12", event: "Listed on Market", actor: "Pedro Reyes", location: "Marketplace", status: "market" },
    { date: "2024-03-14", event: "Purchased", actor: "Trader Alliance Co.", location: "Online", status: "trade" },
    { date: "2024-03-15", event: "Shipment Started", actor: "FastCargo PH", location: "Isabela → Manila", status: "transit" },
    { date: "2024-03-17", event: "Arrived Warehouse", actor: "FastCargo PH", location: "Manila Warehouse A", status: "transit" },
    { date: "2024-03-18", event: "Delivered to Retailer", actor: "SM Supermarket", location: "SM North EDSA", status: "delivered" },
  ]
};
