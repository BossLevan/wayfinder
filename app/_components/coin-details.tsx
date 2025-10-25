"use client";

import Image from "next/image";

// Mock coin data
const mockCoinData = {
  symbol: "$SAINTLEVAN",
  name: "Saint Levan",
  creator: "@saintlevan",
  imageUrl: "https://picsum.photos/seed/saintlevan/200",
  marketCap: "$19K",
  volume24h: "$15K",
  holders: "135",
  totalSupply: "1,000,000,000",
  contractAddress: "0x2f03...da34",
  created: "06/20/2025, 6:02 PM",
};

export function CoinDetails() {
  return (
    <div className="bg-[#151515] border border-white/10 rounded-xl p-6 space-y-6">
      {/* Coin Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden relative shrink-0">
          <Image
            src={mockCoinData.imageUrl}
            alt={mockCoinData.name}
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
        <div>
          <div className="text-white font-semibold text-xl">
            {mockCoinData.symbol}
          </div>
          <div className="text-white/60 text-sm">
            Creator: {mockCoinData.creator}
          </div>
        </div>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-white/60 text-xs mb-1">Market Cap</div>
          <div className="text-white font-semibold text-sm">
            {mockCoinData.marketCap}
          </div>
        </div>
        <div>
          <div className="text-white/60 text-xs mb-1">24H Volume</div>
          <div className="text-white font-semibold text-sm">
            {mockCoinData.volume24h}
          </div>
        </div>
        <div>
          <div className="text-white/60 text-xs mb-1">Holders</div>
          <div className="text-white font-semibold text-sm">
            {mockCoinData.holders}
          </div>
        </div>
      </div>

      {/* Coin Details */}
      <div className="space-y-4">
        <h3 className="text-white font-semibold text-base">Coin Details</h3>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-white/60 text-sm">Total Supply</span>
            <span className="text-white text-sm font-mono">
              {mockCoinData.totalSupply}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-white/60 text-sm">Contract address</span>
            <span className="text-white text-sm font-mono">
              {mockCoinData.contractAddress}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-white/60 text-sm">Created</span>
            <span className="text-white text-sm">{mockCoinData.created}</span>
          </div>
        </div>
      </div>

      {/* View on Zora Button */}
      <a
        href="https://zora.co"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
      >
        View on Zora
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </a>
    </div>
  );
}
