import { useSendTransaction, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { useCallback, useState, useEffect, useRef } from "react";
import { parseEther } from "viem";
import { useToast } from "./toast-provider";

/**
 * Hook for sending a trivial "commitment transaction"
 * 
 * Sends a tiny amount of ETH to yourself as proof you activated a feature
 * This creates an on-chain record of your action
 */

// The commitment amount (very small - just proof of action)
const COMMITMENT_AMOUNT = "0.0001"; // ETH

export function useCommitmentTransaction() {
  const { address, isConnected } = useAccount();
  const { sendTransactionAsync, data: hash } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });
  const { showToast, updateToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toastIdRef = useRef<string | null>(null);

  // Show toast when transaction is confirming
  useEffect(() => {
    if (hash && isConfirming && !toastIdRef.current) {
      toastIdRef.current = showToast(
        "Transaction sent, waiting for confirmation...",
        "loading"
      );
    }
  }, [hash, isConfirming, showToast]);

  // Update toast when transaction is confirmed
  useEffect(() => {
    if (isSuccess && toastIdRef.current) {
      updateToast(
        toastIdRef.current,
        "Transaction confirmed! Feature activated ✓",
        "success"
      );
      toastIdRef.current = null;
    }
  }, [isSuccess, updateToast]);

  const sendCommitment = useCallback(
    async (action: string) => {
      if (!isConnected || !address) {
        throw new Error("Please connect your wallet first");
      }

      setIsProcessing(true);
      setError(null);

      // Show initial "signing" toast
      const toastId = showToast("Please sign the transaction in your wallet...", "loading");
      toastIdRef.current = toastId;

      try {
        // Send ETH to yourself as a commitment transaction
        const txHash = await sendTransactionAsync({
          to: address, // Send to yourself
          value: parseEther(COMMITMENT_AMOUNT),
        });

        // Update toast to show transaction sent
        updateToast(toastId, "Transaction sent, waiting for confirmation...", "loading");

        setIsProcessing(false);
        return { hash: txHash };
      } catch (err: any) {
        const errorMessage = err.message || "Failed to send commitment transaction";
        setError(errorMessage);
        setIsProcessing(false);

        // Update toast to show error
        updateToast(
          toastId,
          err.code === "ACTION_REJECTED" 
            ? "Transaction rejected by user" 
            : "Transaction failed: " + errorMessage,
          "error"
        );
        toastIdRef.current = null;

        throw new Error(errorMessage);
      }
    },
    [isConnected, address, sendTransactionAsync, showToast, updateToast]
  );

  return {
    sendCommitment,
    isProcessing: isProcessing || isConfirming,
    isConfirming,
    isSuccess,
    error,
    transactionHash: hash,
    commitmentAmount: COMMITMENT_AMOUNT,
  };
}

