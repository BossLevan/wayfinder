"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Clock, Zap } from "lucide-react";
import { Button, NumberInput, Field } from "../settings/_components/ui";
import { useCommitmentTransaction } from "./use-commitment-transaction";

type WorkflowParameter = {
  key: string;
  label: string;
  type: "number" | "text" | "select";
  defaultValue: string | number;
  suffix?: string;
  options?: { value: string; label: string }[];
  hint?: string;
};

interface ActivateWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (config: Record<string, string | number>) => void;
  workflow: {
    id: string;
    title: string;
    description: string;
    steps: string[];
    category: string;
    parameters?: WorkflowParameter[];
  } | null;
  initialConfig: Record<string, string | number>;
}

type ModalStep = "configure" | "confirm" | "signing";

export function ActivateWorkflowModal({
  isOpen,
  onClose,
  onComplete,
  workflow,
  initialConfig,
}: ActivateWorkflowModalProps) {
  const {
    sendCommitment,
    isProcessing,
    isSuccess,
    error: txError,
    commitmentAmount,
  } = useCommitmentTransaction();
  const [step, setStep] = useState<ModalStep>("configure");
  const [config, setConfig] =
    useState<Record<string, string | number>>(initialConfig);
  const hasCompletedRef = React.useRef(false);

  useEffect(() => {
    if (isOpen && initialConfig) {
      setConfig(initialConfig);
      hasCompletedRef.current = false; // Reset when modal opens
    }
  }, [isOpen, initialConfig]);

  // Listen for transaction success and then activate workflow
  useEffect(() => {
    if (
      isSuccess &&
      isProcessing === false &&
      workflow &&
      !hasCompletedRef.current
    ) {
      // Transaction confirmed! Activate the workflow
      hasCompletedRef.current = true; // Mark as completed to prevent duplicates
      const hasParameters =
        workflow.parameters && workflow.parameters.length > 0;
      onComplete?.(config);
      onClose();

      // Reset state
      setTimeout(() => {
        setStep(hasParameters ? "configure" : "confirm");
      }, 300);
    }
  }, [isSuccess, isProcessing, config, workflow, onComplete, onClose]);

  if (!isOpen || !workflow) return null;

  const hasParameters = workflow.parameters && workflow.parameters.length > 0;

  const handleContinue = () => {
    if (step === "configure") {
      setStep("confirm");
    }
  };

  const handleSignAndActivate = async () => {
    setStep("signing");
    try {
      // Send commitment transaction (real blockchain transaction!)
      await sendCommitment(`Activate Workflow: ${workflow.title}`);

      // Transaction sent successfully! Now wait for confirmation
    } catch (err) {
      console.error("Failed to send transaction:", err);
      // Reset to confirm step on error
      setStep("confirm");
    }
  };

  const handleBack = () => {
    if (step === "confirm" && !isProcessing) {
      setStep("configure");
    }
  };

  const handleCancel = () => {
    if (!isProcessing) {
      onClose();
      // Reset state after modal closes
      setTimeout(() => {
        setStep(hasParameters ? "configure" : "confirm");
      }, 300);
    }
  };

  const handleConfigChange = (key: string, value: string) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value === "" ? "" : parseFloat(value) || 0,
    }));
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
              {step === "configure"
                ? "Configure Workflow"
                : step === "confirm"
                ? "Activate Workflow"
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
          <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
            {step === "configure" ? (
              <div className="space-y-6">
                {/* Workflow Info */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <Zap size={20} className="text-white/70" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-base mb-1">
                        {workflow.title}
                      </h3>
                      <p className="text-white/60 text-sm">
                        {workflow.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Configuration Parameters */}
                {workflow.parameters && workflow.parameters.length > 0 && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="text-xs font-semibold text-white/90 mb-4 uppercase tracking-wide">
                      Workflow Parameters
                    </div>
                    <div className="space-y-4">
                      {workflow.parameters.map((param) => (
                        <Field
                          key={param.key}
                          label={param.label}
                          hint={param.hint}
                        >
                          <div className="relative">
                            <NumberInput
                              value={
                                config[param.key] !== undefined &&
                                config[param.key] !== ""
                                  ? config[param.key]
                                  : ""
                              }
                              onChange={(e) =>
                                handleConfigChange(param.key, e.target.value)
                              }
                              placeholder={String(param.defaultValue)}
                              className={param.suffix ? "pr-20" : ""}
                            />
                            {param.suffix && (
                              <div className="absolute right-10 top-1/2 transform -translate-y-1/2 text-white/60 text-sm pointer-events-none">
                                {param.suffix}
                              </div>
                            )}
                          </div>
                        </Field>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : step === "confirm" ? (
              <div className="space-y-6">
                {/* Workflow Info */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <Zap size={20} className="text-white/70" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-base mb-1">
                        {workflow.title}
                      </h3>
                      <p className="text-white/60 text-sm">
                        {workflow.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-2 py-1 bg-white/5 rounded text-xs text-white/70 inline-block">
                    {workflow.category}
                  </div>
                </div>

                {/* Steps */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="text-xs font-semibold text-white/90 mb-3 uppercase tracking-wide">
                    Workflow Steps
                  </div>
                  <div className="space-y-2">
                    {workflow.steps.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 text-sm text-white/70"
                      >
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs">{index + 1}</span>
                        </div>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Clock
                      size={16}
                      className="text-blue-400 shrink-0 mt-0.5"
                    />
                    <div className="text-sm text-blue-300">
                      This workflow will run automatically based on the
                      configured triggers. You can pause or modify it anytime
                      from your active workflows.
                    </div>
                  </div>
                </div>

                {/* Configuration Summary */}
                {workflow.parameters && workflow.parameters.length > 0 && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="text-xs font-semibold text-white/90 mb-3 uppercase tracking-wide">
                      Configuration
                    </div>
                    <div className="space-y-2 text-sm">
                      {workflow.parameters.map((param) => (
                        <div key={param.key} className="flex justify-between">
                          <span className="text-white/60">{param.label}</span>
                          <span className="text-white">
                            {config[param.key] !== undefined &&
                            config[param.key] !== ""
                              ? config[param.key]
                              : param.defaultValue}
                            {param.suffix && ` ${param.suffix}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Transaction Summary */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="text-xs font-semibold text-white/90 mb-3 uppercase tracking-wide">
                    Transaction Summary
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Action</span>
                      <span className="text-white">Activate Workflow</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Estimated Gas</span>
                      <span className="text-white">~0.002 ETH</span>
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
                      Please sign the transaction to activate this workflow
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
          {step === "configure" && (
            <div className="px-6 py-4 border-t border-white/10 flex gap-3">
              <Button variant="ghost" onClick={handleCancel} className="flex-1">
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleContinue}
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          )}
          {step === "confirm" && (
            <div className="px-6 py-4 border-t border-white/10 flex gap-3">
              {hasParameters && (
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  Back
                </Button>
              )}
              <Button
                variant="primary"
                onClick={handleSignAndActivate}
                disabled={isProcessing}
                className="flex-1"
              >
                Sign & Activate
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
