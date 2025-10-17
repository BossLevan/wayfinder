"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { Button, Card } from "./ui";

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
  }: {
    header?: string;
    sidebarActive?: "Creator Home" | "Workflows" | "Leaderboard" | "Settings";
    tabs: { key: string; label: string }[];
    activeTab: string;
    onTabChange: (key: string) => void;
    children: React.ReactNode;
    headerContent?: React.ReactNode; // NEW
  }) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0B0F1A] text-[#E6E8EC]">
        <div className="w-full bg-[#0B5FFF] text-white">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <h1 className="text-xl font-semibold">{header}</h1>
          </div>
        </div>
  
        <div className="mx-auto max-w-6xl w-full grow grid grid-cols-12 gap-6 px-4 py-6">
          <aside className="col-span-12 sm:col-span-3 lg:col-span-2">
            <nav className="flex sm:block gap-2 sm:gap-0">
              <SidebarLink href="/" label="Creator Home" active={sidebarActive === "Creator Home"} />
              <SidebarButton label="Workflows" active={sidebarActive === "Workflows"} />
              <SidebarButton label="Leaderboard" active={sidebarActive === "Leaderboard"} />
              <SidebarButton label="Settings" active={sidebarActive === "Settings"} />
            </nav>
          </aside>
  
          <section className="col-span-12 sm:col-span-9 lg:col-span-10">
            <Card className="overflow-hidden">
              {/* Tight header area for tabs (no extra top spacing) */}
              <div className="px-4 sm:px-6 py-3">
                {headerContent}
              </div>
  
              {/* Body */}
              <div className="p-4 sm:p-6">
                {children}
              </div>
            </Card>
          </section>
        </div>
      </div>
    );
  }

  function SidebarLink({
    href,
    label,
    active,
  }: {
    href: string;
    label: string;
    active?: boolean;
  }) {
    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`flex-1 sm:flex-none block px-3 py-2 rounded-md text-sm transition border ${
          active
            ? "bg-white/10 border-white/10"
            : "bg-white/0 hover:bg-white/10 border-transparent hover:border-white/10"
        }`}
      >
        {label}
      </Link>
    );
  }

  
  function SidebarButton({ label, active }: { label: string; active?: boolean }) {
    return (
      <button
        type="button"
        aria-current={active ? "page" : undefined}
        className={`flex-1 sm:flex-none w-full text-left px-3 py-2 rounded-md text-sm transition border ${
          active
            ? "bg-white/10 border-white/10"
            : "bg-white/0 hover:bg-white/10 border-transparent hover:border-white/10"
        }`}
      >
        {label}
      </button>
    );
  }