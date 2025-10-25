"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronsUpDown } from "lucide-react";
import { Button, NumberInput, Field } from "../settings/_components/ui";
import { useCommitmentTransaction } from "./use-commitment-transaction";

interface AirdropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (percentage?: number) => void;
}

type ModalStep = "configure" | "summary";

interface SharingListOption {
  value: string;
  label: string;
}

const sharingListOptions: SharingListOption[] = [
  { value: "top-3", label: "Top 3 Holders" },
  { value: "top-10", label: "Top 10 Holders" },
  { value: "top-50", label: "Top 50 Holders" },
  { value: "farcaster", label: "Farcaster followers" },
];

export function AirdropModal({
  isOpen,
  onClose,
  onComplete,
}: AirdropModalProps) {
  const {
    sendCommitment,
    isProcessing,
    isSuccess,
    error: txError,
    commitmentAmount,
  } = useCommitmentTransaction();
  const [step, setStep] = useState<ModalStep>("configure");
  const [amount, setAmount] = useState("1000");
  const [sharingList, setSharingList] = useState("top-3");
  const hasCompletedRef = React.useRef(false);

  // Reset completion flag when modal opens
  useEffect(() => {
    if (isOpen) {
      hasCompletedRef.current = false;
    }
  }, [isOpen]);

  // Listen for transaction success and then activate feature
  useEffect(() => {
    if (isSuccess && isProcessing === false && !hasCompletedRef.current) {
      // Transaction confirmed! Activate the feature
      hasCompletedRef.current = true; // Mark as completed to prevent duplicates
      onComplete?.(6); // Default 6% allocation for airdrops
      onClose();

      // Reset state
      setTimeout(() => {
        setStep("configure");
        setAmount("1000");
        setSharingList("top-3");
      }, 300);
    }
  }, [isSuccess, isProcessing, onComplete, onClose]);

  if (!isOpen) return null;

  const handleContinue = () => {
    if (step === "configure") {
      setStep("summary");
    }
  };

  const handleSignAndActivate = async () => {
    try {
      // Send commitment transaction (real blockchain transaction!)
      await sendCommitment("Configure Airdrop");

      // Transaction sent successfully! Now wait for confirmation
    } catch (err) {
      console.error("Failed to send transaction:", err);
      // Error is handled by the hook with toast
    }
  };

  const handleBack = () => {
    if (step === "summary" && !isProcessing) {
      setStep("configure");
    }
  };

  const handleCancel = () => {
    if (!isProcessing) {
      onClose();
      // Reset state after modal closes
      setTimeout(() => {
        setStep("configure");
        setAmount("1000");
        setSharingList("top-3");
      }, 300);
    }
  };

  const selectedSharingListLabel =
    sharingListOptions.find((opt) => opt.value === sharingList)?.label ||
    "Top 3 Holders";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-[#0B1424] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <h2 className="text-white font-semibold text-lg">Airdrop</h2>
            <button
              onClick={handleCancel}
              className="text-white/60 hover:text-white transition-colors disabled:opacity-50"
              disabled={isProcessing}
            >
              <X size={20} />
            </button>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center gap-2 px-6 pt-4">
            <div
              className={`h-1 flex-1 rounded-full ${
                step === "configure" || step === "summary"
                  ? "bg-blue-600"
                  : "bg-white/20"
              }`}
            />
            <div
              className={`h-1 flex-1 rounded-full ${
                step === "summary" ? "bg-blue-600" : "bg-white/20"
              }`}
            />
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Step 1: Configure */}
            {step === "configure" && (
              <div className="space-y-6">
                {/* Amount (tokens) */}
                <Field label="Amount (tokens)">
                  <NumberInput
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                </Field>

                {/* Sharing List */}
                <Field label="Sharing List">
                  <div className="space-y-2">
                    {sharingListOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSharingList(option.value)}
                        className={`w-full px-4 py-3 rounded-md text-sm text-left transition-colors border ${
                          sharingList === option.value
                            ? "bg-blue-600/20 border-blue-600 text-white"
                            : "bg-transparent border-white/20 text-white/80 hover:bg-white/5"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            )}

            {/* Step 2: Configuration Summary */}
            {step === "summary" && (
              <div className="space-y-6">
                {/* Configuration Summary Section */}
                <div>
                  <h3 className="text-white/60 text-sm font-medium mb-3">
                    Configuration Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Flywheel</span>
                      <span className="text-white">Airdrop</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Amount</span>
                      <span className="text-white">{amount} tokens</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Target</span>
                      <span className="text-white">
                        {selectedSharingListLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Spend Caps Check Section */}
                <div>
                  <h3 className="text-white/60 text-sm font-medium mb-3">
                    Spend Caps Check
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Daily Cap</span>
                      <span className="text-white">$2,500</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Weekly Cap</span>
                      <span className="text-white">$9,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Max Slippage</span>
                      <span className="text-white">1%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 px-6 py-5 border-t border-white/10">
            {step === "configure" && (
              <>
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleContinue}
                  className="flex-1"
                  disabled={!amount || parseFloat(amount) <= 0}
                >
                  Continue
                </Button>
              </>
            )}

            {step === "summary" && (
              <>
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSignAndActivate}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Signing...
                    </span>
                  ) : (
                    "Sign & Activate"
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
