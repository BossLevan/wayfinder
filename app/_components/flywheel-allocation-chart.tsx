"use client";

import { DollarSign, Gift, Repeat, Flame, Settings } from "lucide-react";
import Link from "next/link";
import { useFlywheelState } from "../_state/flywheel-state";

type FlywheelDisplay = {
  name: string;
  percentage: number;
  color: string;
  icon: React.ReactNode;
};

const flywheelConfig: Record<string, { color: string; icon: React.ReactNode }> =
  {
    "Revenue Share": {
      color: "bg-blue-600/60",
      icon: <Repeat size={14} />,
    },
    Airdrop: {
      color: "bg-blue-500/70",
      icon: <Gift size={14} />,
    },
    Burns: {
      color: "bg-blue-700/50",
      icon: <Flame size={14} />,
    },
    Buyback: {
      color: "bg-blue-400/80",
      icon: <DollarSign size={14} />,
    },
  };

export function FlywheelAllocationChart() {
  const { allocations, getTotalPercentage } = useFlywheelState();

  // Filter active allocations and map to display format
  const displayAllocations: FlywheelDisplay[] = allocations
    .filter((a) => a.isActive)
    .map((a) => ({
      name: a.name,
      percentage: a.percentage,
      color: flywheelConfig[a.name].color,
      icon: flywheelConfig[a.name].icon,
    }));

  const totalPercentage = getTotalPercentage();

  return (
    <div className="bg-[#151515] border border-white/10 rounded-xl p-5">
      <div className="mb-4">
        <div className="flex items-start justify-between mb-1">
          <div className="flex-1">
            <h3 className="text-white/90 font-semibold text-sm mb-1">
              Flywheel Allocation
            </h3>
            <p className="text-white/60 text-xs">
              Distributed as a percentage of your creator earnings • Total:{" "}
              {totalPercentage}%
            </p>
          </div>
          <Link
            href="/settings"
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            title="Configure allocation"
          >
            <Settings size={16} className="text-white/60 hover:text-white/90" />
          </Link>
        </div>
      </div>

      {/* Horizontal Stacked Bar */}
      <div className="mb-4">
        {displayAllocations.length > 0 ? (
          <div className="h-5 flex rounded-lg overflow-hidden bg-white/5">
            {displayAllocations.map((allocation, index) => (
              <div
                key={allocation.name}
                className={`${allocation.color} flex items-center justify-center text-white text-xs font-medium transition-all hover:opacity-80 cursor-pointer`}
                style={{
                  width: `${(allocation.percentage / totalPercentage) * 100}%`,
                }}
                title={`${allocation.name}: ${allocation.percentage}%`}
              >
                {allocation.percentage >= 4 && `${allocation.percentage}%`}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-5 flex items-center justify-center rounded-lg bg-white/5 text-white/40 text-xs">
            No active flywheels
          </div>
        )}
      </div>

      {/* Legends */}
      <div className="grid grid-cols-2 gap-3">
        {displayAllocations.map((allocation) => (
          <div
            key={allocation.name}
            className="flex items-center gap-2 text-xs"
          >
            <div
              className={`w-8 h-8 ${allocation.color} rounded-lg flex items-center justify-center text-white`}
            >
              {allocation.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white/90 font-medium truncate">
                {allocation.name}
              </div>
              <div className="text-white/60 text-xs">
                {allocation.percentage}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
