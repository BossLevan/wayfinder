"use client";

import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { useState } from "react";
import { parseAbi } from "viem";

/**
 * Simple Counter Contract Interaction
 *
 * This is a REAL blockchain transaction that:
 * 1. Reads a counter value from a smart contract
 * 2. Lets you increment it (costs gas!)
 * 3. Shows transaction confirmation
 */

// Simple Counter Contract ABI
const counterAbi = parseAbi([
  "function count() public view returns (uint256)",
  "function increment() public",
  "function decrement() public",
]);

// Example deployed counter contract addresses on testnets
// You can deploy your own or use these examples
const COUNTER_ADDRESSES = {
  // Base Sepolia testnet
  baseSepolia: "0x4d3B93f7e7f4e2D8e9bA5c9a8F5B3e2d1c6A8b9f" as `0x${string}`,
  // Zora Sepolia testnet - you'll need to deploy one
  zoraSepolia: "0x0000000000000000000000000000000000000000" as `0x${string}`,
};

export function SimpleContractInteraction() {
  const { address, isConnected, chain } = useAccount();
  const [customAddress, setCustomAddress] = useState("");
  const [useCustomAddress, setUseCustomAddress] = useState(false);

  // Determine which contract address to use
  const contractAddress =
    useCustomAddress && customAddress
      ? (customAddress as `0x${string}`)
      : chain?.id === 84532 // Base Sepolia
      ? COUNTER_ADDRESSES.baseSepolia
      : COUNTER_ADDRESSES.zoraSepolia;

  // Read the current counter value from the contract
  const {
    data: count,
    refetch: refetchCount,
    isLoading: isLoadingCount,
  } = useReadContract({
    address: contractAddress,
    abi: counterAbi,
    functionName: "count",
    query: {
      enabled: contractAddress !== "0x0000000000000000000000000000000000000000",
    },
  });

  // Write to the contract (increment)
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Refetch count when transaction is confirmed
  if (isConfirmed && count !== undefined) {
    refetchCount();
  }

  const handleIncrement = () => {
    writeContract({
      address: contractAddress,
      abi: counterAbi,
      functionName: "increment",
    });
  };

  const handleDecrement = () => {
    writeContract({
      address: contractAddress,
      abi: counterAbi,
      functionName: "decrement",
    });
  };

  if (!isConnected) {
    return (
      <div className="p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
        <p className="text-yellow-200">
          Please connect your wallet to interact with smart contracts
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#1a1a1a] border border-white/10 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Simple Counter Contract
        </h3>
        {chain && (
          <span className="text-xs px-2 py-1 bg-green-600/20 border border-green-600/30 rounded text-green-200">
            {chain.name}
          </span>
        )}
      </div>

      <div className="p-4 bg-blue-900/10 border border-blue-600/20 rounded-lg">
        <p className="text-sm text-blue-200 mb-2">
          💡 This is a REAL on-chain interaction!
        </p>
        <ul className="text-xs text-blue-300 space-y-1 list-disc list-inside">
          <li>Reads counter value from blockchain</li>
          <li>Clicking increment costs gas fees</li>
          <li>Transaction is permanent on-chain</li>
          <li>Use testnet for free testing (get test ETH from faucet)</li>
        </ul>
      </div>

      {/* Contract Address */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-gray-400">Contract Address:</label>
          <label className="flex items-center gap-2 text-xs text-gray-400">
            <input
              type="checkbox"
              checked={useCustomAddress}
              onChange={(e) => setUseCustomAddress(e.target.checked)}
              className="rounded"
            />
            Use custom address
          </label>
        </div>

        {useCustomAddress ? (
          <input
            type="text"
            value={customAddress}
            onChange={(e) => setCustomAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-green-500 font-mono text-xs"
          />
        ) : (
          <div className="px-3 py-2 bg-black/30 border border-white/10 rounded-lg">
            <p className="text-xs font-mono text-white break-all">
              {contractAddress}
            </p>
          </div>
        )}
      </div>

      {/* Current Count Display */}
      <div className="p-6 bg-gradient-to-br from-green-900/20 to-blue-900/20 border border-green-600/30 rounded-lg">
        <p className="text-sm text-gray-400 mb-2">Current Count:</p>
        <div className="flex items-center gap-3">
          {isLoadingCount ? (
            <div className="animate-pulse text-4xl font-bold text-white">
              ...
            </div>
          ) : count !== undefined ? (
            <div className="text-5xl font-bold text-white">
              {count.toString()}
            </div>
          ) : (
            <div className="text-2xl text-red-400">Contract not found</div>
          )}
          <button
            onClick={() => refetchCount()}
            className="px-3 py-1 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 transition"
            disabled={isLoadingCount}
          >
            {isLoadingCount ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleDecrement}
          disabled={
            isPending ||
            isConfirming ||
            contractAddress === "0x0000000000000000000000000000000000000000"
          }
          className="px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        >
          {isPending
            ? "Waiting..."
            : isConfirming
            ? "Confirming..."
            : "- Decrement"}
        </button>
        <button
          onClick={handleIncrement}
          disabled={
            isPending ||
            isConfirming ||
            contractAddress === "0x0000000000000000000000000000000000000000"
          }
          className="px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        >
          {isPending
            ? "Waiting..."
            : isConfirming
            ? "Confirming..."
            : "+ Increment"}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-900/20 border border-red-600/30 rounded-lg">
          <p className="text-sm font-semibold text-red-200 mb-1">
            Transaction Error
          </p>
          <p className="text-xs text-red-300">{error.message}</p>
        </div>
      )}

      {/* Transaction Status */}
      {hash && (
        <div className="space-y-2">
          <div className="p-3 bg-green-900/20 border border-green-600/30 rounded-lg">
            <p className="text-sm font-semibold text-green-200 mb-2">
              Transaction Sent!
            </p>
            <p className="text-xs font-mono text-green-300 break-all mb-2">
              {hash}
            </p>
            {chain?.blockExplorers?.default && (
              <a
                href={`${chain.blockExplorers.default.url}/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-green-400 hover:text-green-300 underline"
              >
                View on {chain.blockExplorers.default.name}
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}
          </div>

          {isConfirming && (
            <div className="p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
              <p className="text-sm text-yellow-200">
                Waiting for blockchain confirmation...
              </p>
            </div>
          )}

          {isConfirmed && (
            <div className="p-3 bg-green-900/20 border border-green-600/30 rounded-lg">
              <p className="text-sm font-semibold text-green-200">
                ✓ Transaction confirmed! Counter updated.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Help Text */}
      <div className="p-3 bg-purple-900/10 border border-purple-600/20 rounded-lg">
        <p className="text-xs text-purple-200 mb-2 font-semibold">
          Need testnet ETH?
        </p>
        <ul className="text-xs text-purple-300 space-y-1">
          <li>
            • Base Sepolia:{" "}
            <a
              href="https://www.coinbase.com/faucets/base-ethereum-goerli-faucet"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Coinbase Faucet
            </a>
          </li>
          <li>
            • Zora Sepolia:{" "}
            <a
              href="https://www.alchemy.com/faucets/ethereum-sepolia"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Alchemy Faucet
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
