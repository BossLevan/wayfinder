"use client";

import { useAccount, useSignMessage } from "wagmi";
import { useState } from "react";

/**
 * Example component showing how to sign a message with the connected wallet
 * You can use this as a reference for signing transactions
 */
export function SignMessageExample() {
  const { address, isConnected } = useAccount();
  const { signMessage, data: signature, isPending, error } = useSignMessage();
  const [message, setMessage] = useState("Hello from Wayfinder!");

  const handleSignMessage = () => {
    signMessage({ message });
  };

  if (!isConnected) {
    return (
      <div className="p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
        <p className="text-yellow-200">
          Please connect your wallet to sign messages
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#1a1a1a] border border-white/10 rounded-lg space-y-4">
      <h3 className="text-lg font-semibold text-white">Sign Message</h3>

      <div>
        <p className="text-sm text-gray-400 mb-2">Connected Address:</p>
        <p className="text-xs font-mono text-white bg-black/30 p-2 rounded">
          {address}
        </p>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Message to sign:
        </label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
          placeholder="Enter message to sign"
        />
      </div>

      <button
        onClick={handleSignMessage}
        disabled={isPending || !message}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
      >
        {isPending ? "Signing..." : "Sign Message"}
      </button>

      {error && (
        <div className="p-3 bg-red-900/20 border border-red-600/30 rounded-lg">
          <p className="text-sm text-red-200">Error: {error.message}</p>
        </div>
      )}

      {signature && (
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Signature:</p>
          <div className="p-3 bg-green-900/20 border border-green-600/30 rounded-lg">
            <p className="text-xs font-mono text-green-200 break-all">
              {signature}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
