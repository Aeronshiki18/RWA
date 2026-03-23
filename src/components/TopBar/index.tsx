import React from "react";
import { COLORS, NAV_ITEMS } from "../../constants";
import { 
  ConnectWallet, 
  Wallet, 
  WalletDropdown, 
  WalletDropdownDisconnect, 
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
} from '@coinbase/onchainkit/identity';

interface TopBarProps {
  page: string;
  user: any;
}

export function TopBar({ page, user }: TopBarProps) {
  const item = NAV_ITEMS.find(n => n.id === page);
  return (
    <header style={{
      height: 56, display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", background: "#fff", borderBottom: `1px solid ${COLORS.border}`,
      position: "sticky", top: 0, zIndex: 50,
    }}>
      <div style={{ fontWeight: 600, fontSize: 15, color: COLORS.text }}>
        {item?.icon} {item?.label}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 12, color: COLORS.muted }}>Central DB: </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: COLORS.success }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.success, display: "inline-block" }}></span>
          Online
        </span>
        
        <div style={{ display: 'flex', alignItems: 'center', scale: '0.8' }}>
          <Wallet>
            <ConnectWallet className="onchainkit-connect-button">
              <Avatar className="h-6 w-6" />
              <Name />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
              </Identity>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </div>

        <div style={{
          width: 32, height: 32, borderRadius: "50%", background: COLORS.primary,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 700, fontSize: 12
        }} title={user.email}>{user.name?.charAt(0).toUpperCase() || "U"}</div>
      </div>
    </header>
  );
}
