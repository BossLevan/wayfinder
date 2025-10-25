"use client";

import { SettingsLayout } from "../settings/_components/settings-layout";
import { SignMessageExample } from "../_components/sign-message-example";
import { SendTransactionExample } from "../_components/send-transaction-example";
import { ContractInteractionExample } from "../_components/contract-interaction-example";
import { SimpleContractInteraction } from "../_components/simple-contract-interaction";
import { QuickTestTransaction } from "../_components/quick-test-transaction";

export default function DemoWalletPage() {
  return (
    <SettingsLayout
      header={undefined}
      sidebarActive="Demo Wallet"
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Wallet Demo</h1>
          <p className="text-gray-400">
            Test wallet connection, message signing, and transactions
          </p>
        </div>

        <QuickTestTransaction />

        <SimpleContractInteraction />

        <SendTransactionExample />

        <ContractInteractionExample />

        <SignMessageExample />
      </div>
    </SettingsLayout>
  );
}
