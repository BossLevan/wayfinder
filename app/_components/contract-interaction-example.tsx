"use client";

import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { useState } from "react";
import { parseAbi, formatEther, isAddress } from "viem";

/**
 * Example component for interacting with smart contracts
 * This demonstrates both reading from and writing to contracts
 */
export function ContractInteractionExample() {
  const { address, isConnected, chain } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const [contractAddress, setContractAddress] = useState("");
  const [functionName, setFunctionName] = useState("transfer");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("1000000000000000000"); // 1 token in wei
  const [isValidContractAddress, setIsValidContractAddress] = useState(true);
  const [isValidRecipientAddress, setIsValidRecipientAddress] = useState(true);

  // Simple ERC20 ABI for common functions
  const erc20Abi = parseAbi([
    "function transfer(address to, uint256 amount) public returns (bool)",
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function balanceOf(address account) public view returns (uint256)",
    "function totalSupply() public view returns (uint256)",
    "function name() public view returns (string)",
    "function symbol() public view returns (string)",
    "function decimals() public view returns (uint8)",
  ]);

  // Example: Read token name if contract address is valid
  const { data: tokenName } = useReadContract({
    address: isAddress(contractAddress)
      ? (contractAddress as `0x${string}`)
      : undefined,
    abi: erc20Abi,
    functionName: "name",
  });

  const { data: tokenSymbol } = useReadContract({
    address: isAddress(contractAddress)
      ? (contractAddress as `0x${string}`)
      : undefined,
    abi: erc20Abi,
    functionName: "symbol",
  });

  const { data: userBalance } = useReadContract({
    address: isAddress(contractAddress)
      ? (contractAddress as `0x${string}`)
      : undefined,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const handleContractAddressChange = (value: string) => {
    setContractAddress(value);
    if (value.length > 0) {
      setIsValidContractAddress(isAddress(value));
    } else {
      setIsValidContractAddress(true);
    }
  };

  const handleRecipientChange = (value: string) => {
    setRecipientAddress(value);
    if (value.length > 0) {
      setIsValidRecipientAddress(isAddress(value));
    } else {
      setIsValidRecipientAddress(true);
    }
  };

  const handleContractWrite = () => {
    if (!isAddress(contractAddress)) {
      setIsValidContractAddress(false);
      return;
    }
    if (!isAddress(recipientAddress)) {
      setIsValidRecipientAddress(false);
      return;
    }

    try {
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: functionName as "transfer" | "approve",
        args: [recipientAddress as `0x${string}`, BigInt(amount)],
      });
    } catch (err) {
      console.error("Contract interaction error:", err);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
        <p className="text-yellow-200">
          Please connect your wallet to interact with contracts
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#1a1a1a] border border-white/10 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Contract Interaction
        </h3>
        {chain && (
          <span className="text-xs px-2 py-1 bg-purple-600/20 border border-purple-600/30 rounded text-purple-200">
            {chain.name}
          </span>
        )}
      </div>

      <div className="p-3 bg-blue-900/10 border border-blue-600/20 rounded-lg">
        <p className="text-xs text-blue-200">
          💡 This example uses a standard ERC20 token interface. Enter any ERC20
          token contract address to interact with it.
        </p>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Contract Address (ERC20):
        </label>
        <input
          type="text"
          value={contractAddress}
          onChange={(e) => handleContractAddressChange(e.target.value)}
          className={`w-full px-3 py-2 bg-black/30 border rounded-lg text-white focus:outline-none font-mono text-sm ${
            !isValidContractAddress
              ? "border-red-500 focus:border-red-500"
              : "border-white/10 focus:border-purple-500"
          }`}
          placeholder="0x..."
        />
        {!isValidContractAddress && (
          <p className="text-xs text-red-400 mt-1">Invalid contract address</p>
        )}
      </div>

      {tokenName && tokenSymbol && (
        <div className="p-3 bg-green-900/10 border border-green-600/20 rounded-lg">
          <p className="text-sm text-green-200">
            <span className="font-semibold">{tokenName as string}</span> (
            {tokenSymbol as string})
          </p>
          {userBalance !== undefined && (
            <p className="text-xs text-gray-400 mt-1">
              Your balance: {formatEther(userBalance as bigint)}{" "}
              {tokenSymbol as string}
            </p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Function to call:
        </label>
        <select
          value={functionName}
          onChange={(e) => setFunctionName(e.target.value)}
          className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
        >
          <option value="transfer">transfer</option>
          <option value="approve">approve</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">
          {functionName === "transfer" ? "Recipient" : "Spender"} Address:
        </label>
        <input
          type="text"
          value={recipientAddress}
          onChange={(e) => handleRecipientChange(e.target.value)}
          className={`w-full px-3 py-2 bg-black/30 border rounded-lg text-white focus:outline-none font-mono text-sm ${
            !isValidRecipientAddress
              ? "border-red-500 focus:border-red-500"
              : "border-white/10 focus:border-purple-500"
          }`}
          placeholder="0x..."
        />
        {!isValidRecipientAddress && (
          <p className="text-xs text-red-400 mt-1">Invalid address</p>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">
          Amount (in wei):
        </label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 font-mono text-sm"
          placeholder="1000000000000000000"
        />
        <p className="text-xs text-gray-500 mt-1">
          {amount && !isNaN(Number(amount))
            ? `≈ ${formatEther(BigInt(amount || "0"))} tokens`
            : ""}
        </p>
      </div>

      <button
        onClick={handleContractWrite}
        disabled={
          isPending ||
          isConfirming ||
          !contractAddress ||
          !recipientAddress ||
          !amount ||
          !isValidContractAddress ||
          !isValidRecipientAddress
        }
        className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
      >
        {isPending
          ? "Waiting for approval..."
          : isConfirming
          ? "Confirming..."
          : `Call ${functionName}`}
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
          <div className="p-3 bg-purple-900/20 border border-purple-600/30 rounded-lg">
            <p className="text-sm font-semibold text-purple-200 mb-2">
              Transaction Hash:
            </p>
            <p className="text-xs font-mono text-purple-300 break-all">
              {hash}
            </p>
            {chain?.blockExplorers?.default && (
              <a
                href={`${chain.blockExplorers.default.url}/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 mt-2 underline"
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
