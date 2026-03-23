import React from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { OnchainKitProvider } from '@coinbase/onchainkit'
import { WagmiProvider } from 'wagmi'
import { base } from 'wagmi/chains'
import { config } from '../wagmi'

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider 
            chain={base} 
            apiKey={import.meta.env.VITE_CDP_API_KEY || ""}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
