"use client";

import Link from "next/link";
import { fetchTopCoins } from "../lib/zora-coins";
import { SettingsLayout } from "../settings/_components/settings-layout";
import { useEffect, useState } from "react";
import { 
    Search, 
    ChevronDown, 
    Send, 
    Repeat, 
    DollarSign, 
    Gift,
    BadgePercent
  } from "lucide-react";
  
// --- IMPORT CARD FOR LEADERBOARD HERE ---
import { Card } from "../settings/_components/ui";

type CoinRow = {
  address: string;
  name: string | null;
  symbol: string;
  handle: string;
  flywheels: string[];
  holders: number;
  volume24h: number;
  pnl7d: number;
  lastActivated: string;
};

const flywheelIcons = {
    Airdrop: <Gift size={12} className="text-white/70" />,
    RevShare: <Repeat size={12} className="text-white/70" />,
    Buyback: <DollarSign size={12} className="text-white/70" />,
    Staking: <BadgePercent size={12} className="text-white/70" />,
  };

export default function LeaderboardPage() {
  const [coins, setCoins] = useState<CoinRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTopCoins().then((data) => {
      setCoins(data);
      setLoading(false);
    });
  }, []);

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.handle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SettingsLayout
      header={undefined}
      sidebarActive="Leaderboard"
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      aboveContent={
        <div className="flex flex-col gap-2">
          <div className="text-3xl font-semibold text-white/90">Leaderboard</div>
        </div>
      }
    >
      {loading ? (
        <div className="text-center py-8 text-white/60">Loading...</div>
      ) : (
        
        // --- 2. WRAP YOUR CONTENT IN <Card> ---
        <Card>
          <div className="p-4 sm:p-6">
            <div className="space-y-1">
              
              {/* Container with titles and controls */}
              <div className="p-2 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-bold text-white/80">Top Coins by Flywheel Performance</div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="relative w-64">
                      <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white/40" />
                      <input
                        type="text"
                        placeholder="Search Coin, Flywheels..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.targe.value)}
                        className="w-full bg-[#151515] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                      />
                    </div>
                    
                    <div className="relative">
                      <select className="bg-[#151515] border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/30 appearance-none pr-7">
                        <option>Rank</option>
                        <option>Volume</option>
                        <option>Holders</option>
                        <option>PnL</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/40 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Headers */}
              <div className="px-2">
                <div className="grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr_1.5fr] gap-1 items-center text-xs text-white/60 font-medium">
                  <div>#</div>
                  <div>Coin</div>
                  <div>Flywheels</div>
                  <div className="text-right">Holders</div>
                  <div className="text-right">24h Volume</div>
                  <div className="text-right">7d PnL</div>
                  <div className="text-right">Last Activated</div>
                </div>
              </div>

              {/* Data Rows */}
              {filteredCoins.map((coin, i) => (
                <div 
                  key={coin.address} 
                  className="bg-white/5 border border-white/10 rounded-lg p-2 hover:bg-white/10 transition cursor-pointer"
                  onClick={() => window.location.href = `/creator/${coin.address}`}
                >
                  <div className="grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr_1.5fr] gap-1 items-center text-xs">
                    {/* Rank */}
                    <div className="text-white/60 font-medium">{i + 1}</div>
                    
                    {/* Coin */}
                    <div className="flex items-center gap-1">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="text-xs font-bold">{coin.symbol.charAt(1)}</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="font-semibold text-xs">{coin.name}</div>
                        <div className="text-xs text-white/60">{coin.symbol} • {coin.handle}</div>
                      </div>
                    </div>
                    
                    {/* Flywheels */}
                    <div className="flex gap-1">
                      {coin.flywheels.map((fw, idx) => (
                        <div key={idx} className="p-1 bg-white/10 rounded">
                          {flywheelIcons[fw as keyof typeof flywheelIcons]}
                        </div>
                      ))}
                    </div>
                    
                    {/* Holders */}
                    <div className="text-right">{Intl.NumberFormat().format(coin.holders)}</div>
                    
                    {/* 24h Volume */}
                    <div className="text-right">${Intl.NumberFormat().format(coin.volume24h)}</div>
                    
                    {/* 7d PnL */}
                    <div className={`text-right ${coin.pnl7d >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {coin.pnl7d >= 0 ? "↑" : "↓"} {Math.abs(coin.pnl7d).toFixed(1)}%
                    </div>
                    
                    {/* Last Activated */}
                    <div className="text-right">
                      <button className="inline-flex items-center gap-1 px-2 py-1 bg-white/10 rounded text-xs hover:bg-white/20 transition">
                        {flywheelIcons[coin.lastActivated as keyof typeof flywheelIcons]}
                        <span>{coin.lastActivated}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-xs text-white/50">
              Data via Zora Coins API ·{" "}
              <Link className="underline" href="https://docs.zora.co/coins/sdk/queries/coin">
                docs
              </Link>
            </div>
          </div>
        </Card> // --- END OF THE <Card> WRAPPER ---
      )}
    </SettingsLayout>
  );
}