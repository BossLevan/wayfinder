"use client";

import { useState } from "react";
import { SettingsProvider } from "./_state/settings-state";
import { Tabs } from "./_components/ui";
import { SettingsLayout } from "./_components/settings-layout";
import General from "./_components/tabs/general";
import HowItWorks from "./_components/tabs/how-it-works";
import Help from "./_components/tabs/help";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"general" | "how" | "help">("general");

  const tabs = [
    { key: "general", label: "General" },
    { key: "how", label: "How it Works" },
    { key: "help", label: "Help / Support" },
  ] as const;

  return (
    <SettingsProvider>
      <SettingsLayout
        header={undefined}
        sidebarActive="Settings"
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(k) => setActiveTab(k as typeof activeTab)}
        aboveContent={
            <div className="flex flex-col gap-2">
              <div className="text-sm font-semibold text-white/90">Settings</div>
              <Tabs
                tabs={tabs as any}
                active={activeTab}
                onChange={(k) => setActiveTab(k as typeof activeTab)}
              />
            </div>
          }
      >
        {activeTab === "general" && <General />}
        {activeTab === "how" && <HowItWorks />}
        {activeTab === "help" && <Help />}
      </SettingsLayout>
    </SettingsProvider>
  );
}