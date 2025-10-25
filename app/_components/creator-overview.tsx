"use client";

import { PriceChart } from "./price-chart";
import { CoinDetails } from "./coin-details";
import { FlywheelCards } from "./flywheel-cards";
import { FlywheelAllocationChart } from "./flywheel-allocation-chart";
import { DollarSign, TrendingUp, Zap, Activity } from "lucide-react";

// Mock earnings data
const mockStatsData = {
  creatorEarningsAllTime: 1350,
  creatorEarnings24h: 15,
  creatorEarnings24hChange: 12,
  flywheelAmountAllTime: 4,
  flywheelAmount24h: 4,
  flywheelAmount24hChange: -5,
};

export function CreatorOverview() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (percentage: number, isPositive: boolean) => {
    const sign = isPositive ? "+" : "-";
    return `${sign}${Math.abs(percentage)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-6">Overview</h1>

        {/* Earnings and Allocation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left Section - Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Creator Earnings (All Time) */}
            <div className="bg-[#151515] border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 text-white/60 text-xs mb-2">
                <DollarSign size={14} />
                <span>Creator Earnings (All Time)</span>
              </div>
              <div className="text-white text-xl font-bold">
                {formatCurrency(mockStatsData.creatorEarningsAllTime)}
              </div>
            </div>

            {/* Creator Earnings (24hr) */}
            <div className="bg-[#151515] border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 text-white/60 text-xs mb-2">
                <TrendingUp size={14} />
                <span>Creator Earnings (24hr)</span>
              </div>
              <div className="text-white text-xl font-bold">
                {formatCurrency(mockStatsData.creatorEarnings24h)}
              </div>
            </div>

            {/* Flywheel Amount (All Time) */}
            <div className="bg-[#151515] border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 text-white/60 text-xs mb-2">
                <Zap size={14} />
                <span>Flywheel Amount (All Time)</span>
              </div>
              <div className="text-white text-xl font-bold">
                {formatCurrency(mockStatsData.flywheelAmountAllTime)}
              </div>
            </div>

            {/* Flywheel Amount (24hr) */}
            <div className="bg-[#151515] border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 text-white/60 text-xs mb-2">
                <Activity size={14} />
                <span>Flywheel Amount (24hr)</span>
              </div>
              <div className="text-white text-xl font-bold">
                {formatCurrency(mockStatsData.flywheelAmount24h)}
              </div>
            </div>
          </div>

          {/* Right Section - Flywheel Allocation Chart */}
          <div>
            <FlywheelAllocationChart />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2">
          <div className="bg-[#151515] border border-white/10 rounded-xl p-6">
            <PriceChart />
          </div>
        </div>

        {/* Coin Details Sidebar */}
        <div className="lg:col-span-1">
          <CoinDetails />
        </div>
      </div>

      {/* Flywheel Cards */}
      <div>
        <FlywheelCards />
      </div>
    </div>
  );
}
