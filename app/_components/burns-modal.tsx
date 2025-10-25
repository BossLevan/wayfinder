"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, ChevronsUpDown } from "lucide-react";
import { Button, NumberInput, Field } from "../settings/_components/ui";
import { useCommitmentTransaction } from "./use-commitment-transaction";

interface BurnsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (percentage?: number) => void;
}

type ModalStep = "configure" | "summary";

interface FrequencyOption {
  value: string;
  label: string;
}

const frequencyOptions: FrequencyOption[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Biweekly" },
  { value: "monthly", label: "Monthly" },
];

export function BurnsModal({ isOpen, onClose, onComplete }: BurnsModalProps) {
  const {
    sendCommitment,
    isProcessing,
    isSuccess,
    error: txError,
    commitmentAmount,
  } = useCommitmentTransaction();
  const [step, setStep] = useState<ModalStep>("configure");
  const [burnAmount, setBurnAmount] = useState("1000");
  const [frequency, setFrequency] = useState("weekly");
  const [isFrequencyOpen, setIsFrequencyOpen] = useState(false);
  const frequencyDropdownRef = useRef<HTMLDivElement>(null);
  const hasCompletedRef = React.useRef(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        frequencyDropdownRef.current &&
        !frequencyDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFrequencyOpen(false);
      }
    };

    if (isFrequencyOpen) {
      // Use timeout to avoid conflicts with button clicks
      const timer = setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [isFrequencyOpen]);

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
      onComplete?.(5); // Default 5% allocation for burns
      onClose();

      // Reset state
      setTimeout(() => {
        setStep("configure");
        setBurnAmount("1000");
        setFrequency("weekly");
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
      await sendCommitment("Configure Burns");

      // Transaction sent successfully! Now wait for confirmation
      // The modal will stay open until transaction confirms
      // Toast will show "confirming..." then "success!"
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
        setBurnAmount("1000");
        setFrequency("weekly");
      }, 300);
    }
  };

  const selectedFrequencyLabel =
    frequencyOptions.find((opt) => opt.value === frequency)?.label || "Weekly";

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
            <h2 className="text-white font-semibold text-lg">Burns</h2>
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
                {/* Burn Amount */}
                <Field label="Burn Amount (tokens)">
                  <NumberInput
                    value={burnAmount}
                    onChange={(e) => setBurnAmount(e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                </Field>

                {/* Frequency Dropdown */}
                <Field label="Frequency">
                  <div className="relative" ref={frequencyDropdownRef}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFrequencyOpen(!isFrequencyOpen);
                      }}
                      className="w-full bg-inherit text-white border border-white/30 rounded-md px-3 py-2 text-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/20"
                    >
                      <span>{selectedFrequencyLabel}</span>
                      <ChevronsUpDown size={16} className="text-white/40" />
                    </button>

                    {/* Dropdown Menu */}
                    {isFrequencyOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-[#0B1424] border border-white/20 rounded-md shadow-lg z-50 overflow-hidden">
                        {frequencyOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFrequency(option.value);
                              setIsFrequencyOpen(false);
                            }}
                            className={`w-full px-3 py-2 text-sm text-left hover:bg-white/10 transition-colors ${
                              frequency === option.value
                                ? "text-white bg-white/5"
                                : "text-white/80"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </Field>

                {/* Info about burns */}
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-orange-500 mt-0.5">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-orange-500 text-sm font-semibold mb-1">
                        Permanent Token Burn
                      </h4>
                      <p className="text-white/70 text-xs">
                        Tokens will be sent to a burn address and permanently
                        removed from circulation. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
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
                      <span className="text-white">Burns</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Burn Amount</span>
                      <span className="text-white">{burnAmount} tokens</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Frequency</span>
                      <span className="text-white">
                        {selectedFrequencyLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Burn Impact */}
                <div>
                  <h3 className="text-white/60 text-sm font-medium mb-3">
                    Burn Impact
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Per Execution</span>
                      <span className="text-white">{burnAmount} tokens</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Monthly (est.)</span>
                      <span className="text-white">
                        {frequency === "daily"
                          ? parseInt(burnAmount) * 30
                          : frequency === "weekly"
                          ? parseInt(burnAmount) * 4
                          : frequency === "biweekly"
                          ? parseInt(burnAmount) * 2
                          : parseInt(burnAmount)}{" "}
                        tokens
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Burn Method</span>
                      <span className="text-white">Dead Address</span>
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
                  disabled={!burnAmount || parseFloat(burnAmount) <= 0}
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
