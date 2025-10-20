"use client";

import { SettingsLayout } from "./settings/_components/settings-layout";

export default function HomePage() {
  return (
    <SettingsLayout
      header={undefined}
      sidebarActive="Creator Home"
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      aboveContent={
        <div className="flex flex-col gap-2">
          <div className="text-sm font-semibold text-white/90">Creator Home</div>
        </div>
      }
    >
      <div className="text-center py-8 text-white/60">
        Welcome to Wayfinder Labs
      </div>
    </SettingsLayout>
  );
}