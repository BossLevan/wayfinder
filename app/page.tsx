"use client";

import { SettingsLayout } from "./settings/_components/settings-layout";
import { CreatorOverview } from "./_components/creator-overview";

export default function HomePage() {
  return (
    <SettingsLayout
      header={undefined}
      sidebarActive="Creator Home"
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
    >
      <CreatorOverview />
    </SettingsLayout>
  );
}
