import React, { useState, ComponentType } from "react";
import { COLORS } from "./constants";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { Dashboard } from "./components/Dashboard";
import { FarmerRegistration } from "./components/FarmerRegistration";
import { Tokenization } from "./components/Tokenization";
import { Marketplace } from "./components/Marketplace";
import { Trading } from "./components/Trading";
import { Logistics } from "./components/Logistics";
import { VerifyQR } from "./components/VerifyQR";
import { Admin } from "./components/Admin";

import { Auth } from "./components/Auth";

const PAGES: Record<string, ComponentType<any>> = { 
  dashboard: Dashboard, 
  farmer: FarmerRegistration, 
  tokenize: Tokenization, 
  marketplace: Marketplace, 
  trading: Trading, 
  logistics: Logistics, 
  verify: VerifyQR, 
  admin: Admin 
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  
  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  const PageComponent = PAGES[page] || Dashboard;
  const sidebarW = collapsed ? 60 : 220;

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Sidebar active={page} setActive={setPage} collapsed={collapsed} setCollapsed={setCollapsed} onLogout={() => setUser(null)} />
      <div style={{ marginLeft: sidebarW, transition: "margin-left 0.2s", minHeight: "100vh" }}>
        <TopBar page={page} user={user} />
        <main style={{ padding: "24px" }}>
          <PageComponent />
        </main>
      </div>
    </div>
  );
}

