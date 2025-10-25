import { useSignMessage, useAccount } from "wagmi";
import { useCallback, useState } from "react";

interface SignActionParams {
  action: string;
  details: Record<string, any>;
}

export function useSignAction() {
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signAction = useCallback(
    async ({ action, details }: SignActionParams) => {
      if (!isConnected) {
        throw new Error("Please connect your wallet first");
      }

      setIsProcessing(true);
      setError(null);

      try {
        // Create a message that describes the action
        const message = JSON.stringify(
          {
            action,
            details,
            timestamp: Date.now(),
          },
          null,
          2
        );

        // Sign the message
        const signature = await signMessageAsync({ message });

        setIsProcessing(false);
        return { signature, message };
      } catch (err: any) {
        const errorMessage = err.message || "Failed to sign action";
        setError(errorMessage);
        setIsProcessing(false);
        throw new Error(errorMessage);
      }
    },
    [isConnected, signMessageAsync]
  );

  return {
    signAction,
    isProcessing,
    error,
  };
}

