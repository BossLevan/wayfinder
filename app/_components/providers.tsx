"use client";

import { FlywheelProvider } from "../_state/flywheel-state";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { darkTheme, RainbowKitProvider, Theme } from "@rainbow-me/rainbowkit";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, base, zora, zoraSepolia } from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";
import { ToastProvider } from "./toast-provider";

const config = getDefaultConfig({
  appName: "Wayfinder",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  chains: [mainnet, base, zora, zoraSepolia],
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ToastProvider>
            <FlywheelProvider>{children}</FlywheelProvider>
          </ToastProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
