"use client";

import { useState, useEffect } from "react";
import { Settings, TrendingUp, Gift, Zap, Rocket, Flame } from "lucide-react";
import { BuybackModal } from "./buyback-modal";
import { RevenueSharingModal } from "./revenue-sharing-modal";
import { AirdropModal } from "./airdrop-modal";
import { BurnsModal } from "./burns-modal";
import { DisableFlywheelModal } from "./disable-flywheel-modal";
import { useFlywheelState } from "../_state/flywheel-state";

// Mock flywheel data
const flywheelData = [
  {
    id: "revenue-sharing",
    title: "Revenue Sharing",
    description: "Share profit with holders.",
    icon: <TrendingUp size={20} />,
    allocation: "2%",
    details: "List: Top 10 holders",
    enabled: true,
  },
  {
    id: "buybacks",
    title: "Buybacks",
    description: "Auto-buy your coin on intervals",
    icon: <Zap size={20} />,
    allocation: "3%",
    details: "Frequency: Weekly\nLimit: < $1.00",
    enabled: true,
  },
  {
    id: "airdrop",
    title: "Airdrop",
    description: "Send tokens to selected holders",
    icon: <Gift size={20} />,
    allocation: "",
    details: "",
    enabled: false,
  },
  {
    id: "index-buys",
    title: "Index Buys",
    description: "",
    icon: <Settings size={20} />,
    allocation: "",
    details: "Coming soon",
    enabled: false,
    comingSoon: true,
  },
  {
    id: "launchpad",
    title: "Launchpad",
    description: "",
    icon: <Rocket size={20} />,
    allocation: "",
    details: "Coming soon",
    enabled: false,
    comingSoon: true,
  },
  {
    id: "burns",
    title: "Burns",
    description: "Permanently remove tokens from circulation",
    icon: <Flame size={20} />,
    allocation: "",
    details: "",
    enabled: false,
    comingSoon: false,
  },
];

interface FlywheelCardProps {
  flywheel: (typeof flywheelData)[0];
  onToggle: (id: string, enabled: boolean) => void;
}

function FlywheelCard({ flywheel, onToggle }: FlywheelCardProps) {
  const handleToggle = () => {
    if (!flywheel.comingSoon) {
      onToggle(flywheel.id, !flywheel.enabled);
    }
  };

  return (
    <div className="bg-[#151515] border border-white/10 rounded-xl p-4 space-y-4">
      {/* Header with icon and toggle */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="text-white/70 shrink-0">{flywheel.icon}</div>
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-semibold text-base">
              {flywheel.title}
            </h3>
            {flywheel.description && (
              <p className="text-white/60 text-xs">{flywheel.description}</p>
            )}
          </div>
        </div>

        {/* iOS-style toggle */}
        <button
          onClick={handleToggle}
          disabled={flywheel.comingSoon}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-gray-800 ${
            flywheel.enabled
              ? "bg-blue-600"
              : flywheel.comingSoon
              ? "bg-white/10 cursor-not-allowed"
              : "bg-white/20"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              flywheel.enabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Details */}
      {flywheel.enabled && !flywheel.comingSoon && (
        <div className="space-y-2">
          {flywheel.allocation && (
            <div className="flex justify-between text-xs">
              <span className="text-white/60">Allocation:</span>
              <span className="text-white">{flywheel.allocation}</span>
            </div>
          )}
          {flywheel.details && (
            <div className="text-xs text-white/60 whitespace-pre-line">
              {flywheel.details}
            </div>
          )}
        </div>
      )}

      {flywheel.comingSoon && (
        <div className="text-xs text-white/40">{flywheel.details}</div>
      )}

      {/* Configure button for enabled flywheels */}
      {flywheel.enabled && !flywheel.comingSoon && (
        <button className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors">
          <Settings size={12} />
          Configure
        </button>
      )}

      {/* Add button for disabled but available flywheels */}
      {!flywheel.enabled && !flywheel.comingSoon && (
        <button
          onClick={handleToggle}
          className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span className="text-lg">+</span>
          Add
        </button>
      )}
    </div>
  );
}

export function FlywheelCards() {
  const { allocations, updateAllocation } = useFlywheelState();
  const [flywheels, setFlywheels] = useState(flywheelData);
  const [isBuybackModalOpen, setIsBuybackModalOpen] = useState(false);
  const [isRevenueSharingModalOpen, setIsRevenueSharingModalOpen] =
    useState(false);
  const [isAirdropModalOpen, setIsAirdropModalOpen] = useState(false);
  const [isBurnsModalOpen, setIsBurnsModalOpen] = useState(false);
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
  const [pendingToggle, setPendingToggle] = useState<{
    id: string;
    enabled: boolean;
  } | null>(null);

  // Sync local flywheel state with shared allocation state
  useEffect(() => {
    setFlywheels((prev) =>
      prev.map((fw) => {
        const allocation = allocations.find((a) => {
          if (fw.id === "revenue-sharing") return a.name === "Revenue Share";
          if (fw.id === "buybacks") return a.name === "Buyback";
          if (fw.id === "airdrop") return a.name === "Airdrop";
          if (fw.id === "burns") return a.name === "Burns";
          return false;
        });

        if (allocation) {
          return {
            ...fw,
            enabled: allocation.isActive,
            allocation: allocation.isActive ? `${allocation.percentage}%` : "",
          };
        }
        return fw;
      })
    );
  }, [allocations]);

  const handleToggle = (id: string, enabled: boolean) => {
    // If disabling any flywheel, show the disable confirmation modal
    if (!enabled) {
      setPendingToggle({ id, enabled });
      setIsDisableModalOpen(true);
      return;
    }

    // If enabling buybacks, show the buyback modal first
    if (id === "buybacks" && enabled) {
      setPendingToggle({ id, enabled });
      setIsBuybackModalOpen(true);
      return;
    }

    // If enabling revenue sharing, show the revenue sharing modal first
    if (id === "revenue-sharing" && enabled) {
      setPendingToggle({ id, enabled });
      setIsRevenueSharingModalOpen(true);
      return;
    }

    // If enabling airdrop, show the airdrop modal first
    if (id === "airdrop" && enabled) {
      setPendingToggle({ id, enabled });
      setIsAirdropModalOpen(true);
      return;
    }

    // If enabling burns, show the burns modal first
    if (id === "burns" && enabled) {
      setPendingToggle({ id, enabled });
      setIsBurnsModalOpen(true);
      return;
    }

    // For other flywheels, just toggle directly
    setFlywheels((prev) =>
      prev.map((fw) => (fw.id === id ? { ...fw, enabled } : fw))
    );
  };

  const handleModalComplete = (percentage?: number) => {
    // Complete the toggle after modal configuration
    if (pendingToggle) {
      // Update shared flywheel state
      const allocationName =
        pendingToggle.id === "revenue-sharing"
          ? "Revenue Share"
          : pendingToggle.id === "buybacks"
          ? "Buyback"
          : pendingToggle.id === "airdrop"
          ? "Airdrop"
          : pendingToggle.id === "burns"
          ? "Burns"
          : null;

      if (allocationName) {
        const currentAllocation = allocations.find(
          (a) => a.name === allocationName
        );
        const finalPercentage =
          percentage ?? currentAllocation?.percentage ?? 0;
        updateAllocation(
          allocationName as any,
          finalPercentage,
          pendingToggle.enabled
        );
      }

      setFlywheels((prev) =>
        prev.map((fw) =>
          fw.id === pendingToggle.id
            ? { ...fw, enabled: pendingToggle.enabled }
            : fw
        )
      );
      setPendingToggle(null);
    }
  };

  const handleBuybackModalClose = () => {
    setIsBuybackModalOpen(false);
    setPendingToggle(null);
  };

  const handleRevenueSharingModalClose = () => {
    setIsRevenueSharingModalOpen(false);
    setPendingToggle(null);
  };

  const handleAirdropModalClose = () => {
    setIsAirdropModalOpen(false);
    setPendingToggle(null);
  };

  const handleBurnsModalClose = () => {
    setIsBurnsModalOpen(false);
    setPendingToggle(null);
  };

  const handleDisableModalClose = () => {
    setIsDisableModalOpen(false);
    setPendingToggle(null);
  };

  const getPendingFlywheelName = () => {
    if (!pendingToggle) return "";
    const flywheel = flywheels.find((fw) => fw.id === pendingToggle.id);
    return flywheel?.title || "";
  };

  const activeFlywheels = flywheels.filter(
    (fw) => fw.enabled && !fw.comingSoon
  );
  const availableFlywheels = flywheels.filter(
    (fw) => !fw.enabled && !fw.comingSoon
  );
  const comingSoonFlywheels = flywheels.filter((fw) => fw.comingSoon);

  return (
    <>
      <BuybackModal
        isOpen={isBuybackModalOpen}
        onClose={handleBuybackModalClose}
        onComplete={handleModalComplete}
      />

      <RevenueSharingModal
        isOpen={isRevenueSharingModalOpen}
        onClose={handleRevenueSharingModalClose}
        onComplete={handleModalComplete}
      />

      <AirdropModal
        isOpen={isAirdropModalOpen}
        onClose={handleAirdropModalClose}
        onComplete={handleModalComplete}
      />

      <BurnsModal
        isOpen={isBurnsModalOpen}
        onClose={handleBurnsModalClose}
        onComplete={handleModalComplete}
      />

      <DisableFlywheelModal
        isOpen={isDisableModalOpen}
        onClose={handleDisableModalClose}
        onConfirm={handleModalComplete}
        flywheelName={getPendingFlywheelName()}
      />

      <div className="space-y-6">
        {/* Active Flywheels */}
        {activeFlywheels.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-white font-semibold text-lg">
                Active Flywheels
              </h2>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeFlywheels.map((flywheel) => (
                <FlywheelCard
                  key={flywheel.id}
                  flywheel={flywheel}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </div>
        )}

        {/* Available Flywheels */}
        {availableFlywheels.length > 0 && (
          <div>
            <h2 className="text-white font-semibold text-lg mb-4">Utilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableFlywheels.map((flywheel) => (
                <FlywheelCard
                  key={flywheel.id}
                  flywheel={flywheel}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </div>
        )}

        {/* Coming Soon */}
        {comingSoonFlywheels.length > 0 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comingSoonFlywheels.map((flywheel) => (
                <FlywheelCard
                  key={flywheel.id}
                  flywheel={flywheel}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
