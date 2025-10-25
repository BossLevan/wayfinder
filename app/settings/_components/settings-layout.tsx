"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { Button, Card } from "./ui"; // Note: Card import is no longer needed here
import Image from "next/image";
import ZoraTerminalLogo from "../../ZoraTerminal.svg";
import { WalletConnectButton } from "../../_components/wallet-connect-button";

/**
 * Page shell for Settings — header, sidebar, and content card.
 * Keeps the page file free of layout concerns.
 */

export function SettingsLayout({
  header = "Settings",
  sidebarActive = "Settings",
  tabs,
  activeTab,
  onTabChange,
  children,
  headerContent, // NEW
  aboveContent,
}: {
  header?: string;
  sidebarActive?:
    | "Creator Home"
    | "Workflows"
    | "Leaderboard"
    | "Settings"
    | "Demo Wallet";
  tabs: { key: string; label: string }[];
  activeTab: string;
  onTabChange: (key: string) => void;
  children: React.ReactNode;
  headerContent?: React.ReactNode; // NEW
  aboveContent?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f0f] text-[#E6E8EC]">
      {header ? (
        <div className="w-full bg-[#151515] text-white">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Zora Terminal Logo */}
                <Image
                  src={ZoraTerminalLogo}
                  alt="Zora Terminal"
                  height={28}
                  className="h-7 w-auto"
                />
              </div>

              {/* Top Right Controls */}
              <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 hover:bg-white/5 transition text-sm">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  <span>saintlevan</span>
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Import Button */}
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 hover:bg-white/5 transition text-sm">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Import</span>
                </button>

                {/* Dark Mode Toggle */}
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 hover:bg-white/5 transition text-sm">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                  <span>Dark</span>
                </button>

                {/* Wallet Connect Button */}
                <WalletConnectButton />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-6xl w-full grow grid grid-cols-12 gap-6 px-4 py-6">
        <aside className="col-span-12 sm:col-span-3 lg:col-span-2">
          <nav className="flex sm:block gap-2 sm:gap-0">
            <SidebarLink
              href="/"
              label="Creator Home"
              active={sidebarActive === "Creator Home"}
            />
            <SidebarLink
              href="/workflows"
              label="Workflows"
              active={sidebarActive === "Workflows"}
            />
            <SidebarLink
              href="/leaderboard"
              label="Leaderboard"
              active={sidebarActive === "Leaderboard"}
            />
            <SidebarLink
              href="/demo-wallet"
              label="Demo Wallet"
              active={sidebarActive === "Demo Wallet"}
            />
            <SidebarLink
              href="/settings"
              label="Settings"
              active={sidebarActive === "Settings"}
            />
          </nav>
        </aside>

        <section className="col-span-12 sm:col-span-9 lg:col-span-10">
          {/* ABOVE the content (completely outside) */}
          {aboveContent ? <div className="mb-4">{aboveContent}</div> : null}

          {/* --- CHANGE IS HERE ---
              The <Card> and padding <div className="p-4 ..."> 
              have been removed. 
              {children} is now rendered directly inside the <section>.
            */}
          {children}
        </section>
      </div>
    </div>
  );
}

function SidebarLink({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex-1 sm:flex-none flex items-center gap-2 px-3 py-2 rounded-md text-sm transition border ${
        active
          ? "bg-white/10 border-white/10"
          : "bg-white/0 hover:bg-white/10 border-transparent hover:border-white/10"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function SidebarButton({
  label,
  icon,
  active,
}: {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      className={`flex-1 sm:flex-none w-full flex items-center gap-2 text-left px-3 py-2 rounded-md text-sm transition border ${
        active
          ? "bg-white/10 border-white/10"
          : "bg-white/0 hover:bg-white/10 border-transparent hover:border-white/10"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
