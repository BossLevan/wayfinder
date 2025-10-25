"use client";

import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useState } from "react";
import { parseEther, isAddress } from "viem";

/**
 * Example component for sending ETH transactions
 * User can sign and send a transaction to any address
 */
export function SendTransactionExample() {
  const { address, isConnected, chain } = useAccount();
  const {
    sendTransaction,
    data: hash,
    isPending,
    error,
  } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("0.001");
  const [isValidAddress, setIsValidAddress] = useState(true);

  const handleRecipientChange = (value: string) => {
    setRecipient(value);
    if (value.length > 0) {
      setIsValidAddress(isAddress(value));
    } else {
      setIsValidAddress(true);
    }
  };

  const handleSendTransaction = () => {
    if (!isAddress(recipient)) {
      setIsValidAddress(false);
      return;
    }

    try {
      sendTransaction({
        to: recipient as `0x${string}`,
        value: parseEther(amount),
      });
    } catch (err) {
      console.error("Transaction error:", err);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
        <p className="text-yellow-200">
          Please connect your wallet to send transactions
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#1a1a1a] border border-white/10 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Send Transaction</h3>
        {chain && (
          <span className="text-xs px-2 py-1 bg-blue-600/20 border border-blue-600/30 rounded text-blue-200">
            {chain.name}
          </span>
        )}
      </div>

      <div>
        <p className="text-sm text-gray-400 mb-2">Your Address:</p>
        <p className="text-xs font-mono text-white bg-black/30 p-2 rounded break-all">
          {address}
        </p>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Recipient Address:
        </label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => handleRecipientChange(e.target.value)}
          className={`w-full px-3 py-2 bg-black/30 border rounded-lg text-white focus:outline-none font-mono text-sm ${
            !isValidAddress
              ? "border-red-500 focus:border-red-500"
              : "border-white/10 focus:border-blue-500"
          }`}
          placeholder="0x..."
        />
        {!isValidAddress && (
          <p className="text-xs text-red-400 mt-1">Invalid Ethereum address</p>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Amount (ETH):
        </label>
        <input
          type="number"
          step="0.001"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
          placeholder="0.001"
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setAmount("0.001")}
            className="px-2 py-1 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 transition"
          >
            0.001 ETH
          </button>
          <button
            onClick={() => setAmount("0.01")}
            className="px-2 py-1 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 transition"
          >
            0.01 ETH
          </button>
          <button
            onClick={() => setAmount("0.1")}
            className="px-2 py-1 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 transition"
          >
            0.1 ETH
          </button>
        </div>
      </div>

      <button
        onClick={handleSendTransaction}
        disabled={
          isPending || isConfirming || !recipient || !amount || !isValidAddress
        }
        className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
      >
        {isPending
          ? "Waiting for approval..."
          : isConfirming
          ? "Confirming..."
          : "Send Transaction"}
      </button>

      {error && (
        <div className="p-3 bg-red-900/20 border border-red-600/30 rounded-lg">
          <p className="text-sm font-semibold text-red-200 mb-1">
            Transaction Error
          </p>
          <p className="text-xs text-red-300">{error.message}</p>
        </div>
      )}

      {hash && (
        <div className="space-y-2">
          <div className="p-3 bg-blue-900/20 border border-blue-600/30 rounded-lg">
            <p className="text-sm font-semibold text-blue-200 mb-2">
              Transaction Hash:
            </p>
            <p className="text-xs font-mono text-blue-300 break-all">{hash}</p>
            {chain?.blockExplorers?.default && (
              <a
                href={`${chain.blockExplorers.default.url}/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mt-2 underline"
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
                Waiting for confirmation...
              </p>
            </div>
          )}

          {isConfirmed && (
            <div className="p-3 bg-green-900/20 border border-green-600/30 rounded-lg">
              <p className="text-sm font-semibold text-green-200">
                ✓ Transaction confirmed!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
