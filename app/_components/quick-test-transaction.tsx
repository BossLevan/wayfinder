"use client";

import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useBalance,
} from "wagmi";
import { useState } from "react";
import { parseEther, formatEther, isAddress } from "viem";

/**
 * Quick Test Transaction
 *
 * Send a tiny amount of ETH to yourself or another address
 * Perfect for testing wallet signing with a real transaction!
 */
export function QuickTestTransaction() {
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({ address });
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
  const [amount, setAmount] = useState("0.0001");
  const [isValidAddress, setIsValidAddress] = useState(true);

  const handleRecipientChange = (value: string) => {
    setRecipient(value);
    if (value.length > 0) {
      setIsValidAddress(isAddress(value));
    } else {
      setIsValidAddress(true);
    }
  };

  const fillMyAddress = () => {
    if (address) {
      setRecipient(address);
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
        <h3 className="text-lg font-semibold text-white">
          Quick Test Transaction
        </h3>
        {chain && (
          <span className="text-xs px-2 py-1 bg-orange-600/20 border border-orange-600/30 rounded text-orange-200">
            {chain.name}
          </span>
        )}
      </div>

      <div className="p-4 bg-orange-900/10 border border-orange-600/20 rounded-lg">
        <p className="text-sm text-orange-200 mb-2">
          🔥 This sends REAL cryptocurrency!
        </p>
        <ul className="text-xs text-orange-300 space-y-1 list-disc list-inside">
          <li>Costs real gas fees (~$0.10 - $5)</li>
          <li>Transaction is permanent and irreversible</li>
          <li>Use testnet first, or send to yourself to be safe</li>
          <li>Perfect for testing actual blockchain transactions</li>
        </ul>
      </div>

      <div>
        <p className="text-sm text-gray-400 mb-2">Your Address:</p>
        <div className="flex items-center gap-2">
          <p className="text-xs font-mono text-white bg-black/30 p-2 rounded flex-1 break-all">
            {address}
          </p>
          <button
            onClick={fillMyAddress}
            className="px-3 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition whitespace-nowrap"
          >
            Send to Self
          </button>
        </div>
        {balance && (
          <p className="text-xs text-gray-500 mt-1">
            Balance: {formatEther(balance.value)} {balance.symbol}
          </p>
        )}
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
              : "border-white/10 focus:border-orange-500"
          }`}
          placeholder="0x... (your other address)"
        />
        {!isValidAddress && (
          <p className="text-xs text-red-400 mt-1">Invalid Ethereum address</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          💡 Tip: Send to your own address to test safely!
        </p>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Amount ({chain?.nativeCurrency?.symbol || "ETH"}):
        </label>
        <input
          type="number"
          step="0.0001"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500"
          placeholder="0.0001"
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setAmount("0.0001")}
            className="px-2 py-1 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 transition"
          >
            0.0001 {chain?.nativeCurrency?.symbol || "ETH"}
          </button>
          <button
            onClick={() => setAmount("0.001")}
            className="px-2 py-1 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 transition"
          >
            0.001 {chain?.nativeCurrency?.symbol || "ETH"}
          </button>
          <button
            onClick={() => setAmount("0.01")}
            className="px-2 py-1 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 transition"
          >
            0.01 {chain?.nativeCurrency?.symbol || "ETH"}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          ⚠️ Plus ~$0.50-$5 gas fee on mainnet (free on testnet)
        </p>
      </div>

      <button
        onClick={handleSendTransaction}
        disabled={
          isPending ||
          isConfirming ||
          !recipient ||
          !amount ||
          !isValidAddress ||
          parseFloat(amount) <= 0
        }
        className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Waiting for approval...
          </>
        ) : isConfirming ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Confirming transaction...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Send Transaction
          </>
        )}
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
          <div className="p-3 bg-orange-900/20 border border-orange-600/30 rounded-lg">
            <p className="text-sm font-semibold text-orange-200 mb-2">
              Transaction Sent! 🚀
            </p>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-400">Transaction Hash:</p>
                <p className="text-xs font-mono text-orange-300 break-all">
                  {hash}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-gray-400">From:</p>
                  <p className="font-mono text-white truncate">{address}</p>
                </div>
                <div>
                  <p className="text-gray-400">To:</p>
                  <p className="font-mono text-white truncate">{recipient}</p>
                </div>
                <div>
                  <p className="text-gray-400">Amount:</p>
                  <p className="text-white">
                    {amount} {chain?.nativeCurrency?.symbol || "ETH"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Network:</p>
                  <p className="text-white">{chain?.name}</p>
                </div>
              </div>
            </div>
            {chain?.blockExplorers?.default && (
              <a
                href={`${chain.blockExplorers.default.url}/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 mt-2 underline"
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
                Waiting for blockchain confirmation... (~15 seconds)
              </p>
            </div>
          )}

          {isConfirmed && (
            <div className="p-3 bg-green-900/20 border border-green-600/30 rounded-lg">
              <p className="text-sm font-semibold text-green-200">
                ✓ Transaction confirmed on blockchain!
              </p>
              <p className="text-xs text-green-300 mt-1">
                Your transaction is now permanent and verifiable on-chain.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="p-3 bg-purple-900/10 border border-purple-600/20 rounded-lg">
        <p className="text-xs text-purple-200 mb-2 font-semibold">
          Testing Tips:
        </p>
        <ul className="text-xs text-purple-300 space-y-1">
          <li>
            • <strong>On Testnet:</strong> Use faucet ETH - completely free to
            test
          </li>
          <li>
            • <strong>On Mainnet:</strong> Send to yourself first to be safe
          </li>
          <li>
            • <strong>Start Small:</strong> Use 0.0001 ETH for your first test
          </li>
          <li>
            • <strong>Check Explorer:</strong> Click the link to see your tx
            on-chain
          </li>
        </ul>
      </div>
    </div>
  );
}
