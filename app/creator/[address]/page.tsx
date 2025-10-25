"use client";

import { useParams } from "next/navigation";
import { SettingsLayout } from "../../settings/_components/settings-layout";
import { Send, RotateCcw, DollarSign, ArrowLeft, Share2, TrendingUp, Users, DollarSign as DollarIcon } from "lucide-react";
import Link from "next/link";

const flywheelIcons = {
  Airdrop: <Send size={16} className="text-purple-400" />,
  RevShare: <RotateCcw size={16} className="text-blue-400" />,
  Buyback: <DollarSign size={16} className="text-green-400" />,
};

// Use the same mock data from zora-coins.ts
const MOCK_CREATORS = [
  { address: "0x9cfa8a8b8c8d8e8f909192939495969798999a", name: "MOLLY", symbol: "$MOLLY", handle: "@ilovemolly4ever", flywheels: ["Airdrop", "RevShare"], holders: 2380, volume24h: 58200, pnl7d: 12.5, lastActivated: "Airdrop" },
  { address: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef", name: "BORED", symbol: "$BORED", handle: "@bored", flywheels: ["Buyback", "RevShare"], holders: 3020, volume24h: 76400, pnl7d: 18.2, lastActivated: "Buyback" },
  { address: "0x7f8e9d0c1b2a3948576e5d4c3b2a1908f7e6d5c", name: "DEFI", symbol: "$DEFI", handle: "@definitive", flywheels: ["Airdrop", "Buyback"], holders: 1750, volume24h: 41700, pnl7d: 18.2, lastActivated: "RevShare" },
  { address: "0x3c4d5e6f7890abcdef1234567890abcdef123456", name: "OXEN", symbol: "$OXEN", handle: "@Oxen", flywheels: ["Airdrop", "Buyback", "RevShare"], holders: 2110, volume24h: 48500, pnl7d: 9.3, lastActivated: "Buyback" },
  { address: "0x5e6f7890abcdef1234567890abcdef1234567890", name: "ZORAT", symbol: "$ZORAT", handle: "@zoraterminal", flywheels: ["RevShare", "Airdrop"], holders: 4890, volume24h: 102300, pnl7d: 21.7, lastActivated: "Airdrop" },
  { address: "0x890abcdef1234567890abcdef1234567890abcd", name: "LGHT", symbol: "$LGHT", handle: "@lght", flywheels: ["Buyback"], holders: 980, volume24h: 14800, pnl7d: -2.4, lastActivated: "RevShare" },
  { address: "0xabcdef1234567890abcdef1234567890abcdef12", name: "GREMP", symbol: "$GREMP", handle: "@gremplin", flywheels: ["Airdrop", "RevShare"], holders: 3440, volume24h: 63900, pnl7d: 11.8, lastActivated: "Buyback" },
  { address: "0xcdef1234567890abcdef1234567890abcdef1234", name: "WBNNS", symbol: "$WBNNS", handle: "@wbnns", flywheels: ["Buyback", "Airdrop"], holders: 1220, volume24h: 22500, pnl7d: 3.6, lastActivated: "Airdrop" },
];

export default function CreatorProfilePage() {
  const params = useParams();
  const address = params.address as string;

  // Find creator from mock data
  const creator = MOCK_CREATORS.find(c => c.address === address);
  
  if (!creator) {
    return (
      <SettingsLayout
        header={undefined}
        sidebarActive="Leaderboard"
        tabs={[]}
        activeTab=""
        onTabChange={() => {}}
        aboveContent={
          <div className="flex items-center gap-4">
            <Link href="/leaderboard" className="text-white/60 hover:text-white">
              <ArrowLeft size={20} />
            </Link>
            <div className="text-sm font-semibold text-white/90">Creator Not Found</div>
          </div>
        }
      >
        <div className="text-center py-8 text-white/60">Creator not found</div>
      </SettingsLayout>
    );
  }

  // Calculate derived values
  const price = (creator.volume24h / creator.holders / 1000).toFixed(4);
  const marketCap = Math.round(creator.volume24h * 0.8);

  return (
    <SettingsLayout
      header={undefined}
      sidebarActive="Leaderboard"
      tabs={[]}
      activeTab=""
      onTabChange={() => {}}
      aboveContent={
        <div className="flex items-center gap-4">
          <Link href="/leaderboard" className="text-white/60 hover:text-white">
            <ArrowLeft size={20} />
          </Link>
          <div className="text-sm font-semibold text-white/90">Creator Profile</div>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-2xl font-bold">{creator.symbol.charAt(1)}</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">{creator.name}</h1>
                <p className="text-white/60">{creator.symbol} • {creator.handle}</p>
                <p className="text-xs text-white/40 font-mono">{creator.address.slice(0, 6)}...{creator.address.slice(-4)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-sm text-white/60">Price</div>
                <div className="text-lg font-semibold">${price}</div>
              </div>
              <div>
                <div className="text-sm text-white/60">Market Cap</div>
                <div className="text-lg font-semibold">${Intl.NumberFormat().format(marketCap)}</div>
              </div>
              <div>
                <div className="text-sm text-white/60">24h Volume</div>
                <div className="text-lg font-semibold">${Intl.NumberFormat().format(creator.volume24h)}</div>
              </div>
              <div>
                <div className="text-sm text-white/60">Holders</div>
                <div className="text-lg font-semibold">{Intl.NumberFormat().format(creator.holders)}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                <DollarIcon size={16} />
                Buy Coin
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition">
                <Share2 size={16} />
                Share Profile
              </button>
            </div>
          </div>

          {/* Active Flywheels */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Active Flywheels</h3>
            <div className="flex gap-3">
              {creator.flywheels.map((fw, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg">
                  {flywheelIcons[fw as keyof typeof flywheelIcons]}
                  <span className="text-sm">{fw}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Chart Placeholder */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Price Chart</h3>
              <div className={`text-sm ${creator.pnl7d >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {creator.pnl7d >= 0 ? "+" : ""}{creator.pnl7d}%
              </div>
            </div>
            <div className="h-32 bg-white/5 rounded-lg flex items-center justify-center">
              <TrendingUp size={32} className="text-white/40" />
            </div>
          </div>

          {/* Coin Details */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Coin Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Total Supply</span>
                <span>{Intl.NumberFormat().format(creator.holders * 1000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Contract</span>
                <span className="font-mono text-xs">{creator.address.slice(0, 6)}...{creator.address.slice(-4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Last Activated</span>
                <span>{creator.lastActivated}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}