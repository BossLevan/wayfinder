"use client";

import React, { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "../settings/_components/ui";
import { useCommitmentTransaction } from "./use-commitment-transaction";

interface DeactivateWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  workflow: {
    id: string;
    title: string;
    description: string;
    category: string;
  } | null;
}

type ModalStep = "confirm" | "signing";

export function DeactivateWorkflowModal({
  isOpen,
  onClose,
  onComplete,
  workflow,
}: DeactivateWorkflowModalProps) {
  const {
    sendCommitment,
    isProcessing,
    isSuccess,
    error: txError,
    commitmentAmount,
  } = useCommitmentTransaction();
  const [step, setStep] = useState<ModalStep>("confirm");
  const hasCompletedRef = React.useRef(false);

  // Reset completion flag when modal opens
  useEffect(() => {
    if (isOpen) {
      hasCompletedRef.current = false;
    }
  }, [isOpen]);

  // Listen for transaction success and then deactivate workflow
  useEffect(() => {
    if (isSuccess && isProcessing === false && !hasCompletedRef.current) {
      // Transaction confirmed! Deactivate the workflow
      hasCompletedRef.current = true; // Mark as completed to prevent duplicates
      onComplete?.();
      onClose();

      // Reset state
      setTimeout(() => {
        setStep("confirm");
      }, 300);
    }
  }, [isSuccess, isProcessing, onComplete, onClose]);

  if (!isOpen || !workflow) return null;

  const handleSignAndDeactivate = async () => {
    setStep("signing");
    try {
      // Send commitment transaction (real blockchain transaction!)
      await sendCommitment(`Deactivate Workflow: ${workflow.title}`);

      // Transaction sent successfully! Now wait for confirmation
    } catch (err) {
      console.error("Failed to send transaction:", err);
      // Reset to confirm step on error
      setStep("confirm");
    }
  };

  const handleCancel = () => {
    if (!isProcessing) {
      onClose();
      // Reset state after modal closes
      setTimeout(() => {
        setStep("confirm");
      }, 300);
    }
  };

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
            <h2 className="text-white font-semibold text-lg">
              {step === "confirm"
                ? "Deactivate Workflow"
                : "Signing Transaction"}
            </h2>
            <button
              onClick={handleCancel}
              className="text-white/60 hover:text-white transition-colors disabled:opacity-50"
              disabled={isProcessing}
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            {step === "confirm" ? (
              <div className="space-y-6">
                {/* Warning Box */}
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertTriangle
                      size={20}
                      className="text-red-400 shrink-0 mt-0.5"
                    />
                    <div>
                      <div className="text-red-400 font-semibold text-sm mb-1">
                        Are you sure?
                      </div>
                      <div className="text-red-300/80 text-sm">
                        This will permanently deactivate the workflow and stop
                        all scheduled executions. This action requires a
                        signature to confirm.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Workflow Info */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="text-xs font-semibold text-white/90 mb-3 uppercase tracking-wide">
                    Workflow to Deactivate
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-white font-semibold text-base">
                      {workflow.title}
                    </h3>
                    <p className="text-white/60 text-sm">
                      {workflow.description}
                    </p>
                    <div className="pt-2">
                      <span className="px-2 py-1 bg-white/10 rounded text-xs text-white/70">
                        {workflow.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Transaction Summary */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="text-xs font-semibold text-white/90 mb-3 uppercase tracking-wide">
                    Transaction Summary
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Action</span>
                      <span className="text-white">Deactivate Workflow</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Estimated Gas</span>
                      <span className="text-white">~0.001 ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Network</span>
                      <span className="text-white">Base</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Signing state
              <div className="py-8 space-y-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-semibold mb-1">
                      Confirm in your wallet
                    </div>
                    <div className="text-white/60 text-sm">
                      Please sign the transaction to deactivate this workflow
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="text-xs text-white/60 text-center">
                    Waiting for wallet confirmation...
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {step === "confirm" && (
            <div className="px-6 py-4 border-t border-white/10 flex gap-3">
              <Button
                variant="ghost"
                onClick={handleCancel}
                disabled={isProcessing}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleSignAndDeactivate}
                disabled={isProcessing}
                className="flex-1"
              >
                Sign & Deactivate
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
