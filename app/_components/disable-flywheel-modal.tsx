"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "../settings/_components/ui";

interface DisableFlywheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  flywheelName: string;
}

export function DisableFlywheelModal({
  isOpen,
  onClose,
  onConfirm,
  flywheelName,
}: DisableFlywheelModalProps) {
  const [isSigning, setIsSigning] = useState(false);

  if (!isOpen) return null;

  const handleSignAndDisable = () => {
    setIsSigning(true);
    // Simulate signing process
    setTimeout(() => {
      onConfirm();
      onClose();
      setIsSigning(false);
    }, 2000);
  };

  const handleCancel = () => {
    if (!isSigning) {
      onClose();
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
              Disable {flywheelName}
            </h2>
            <button
              onClick={handleCancel}
              className="text-white/60 hover:text-white transition-colors disabled:opacity-50"
              disabled={isSigning}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Warning Banner */}
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="text-orange-500 mt-0.5">
                  <AlertTriangle size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="text-orange-500 text-sm font-semibold mb-1">
                    Warning
                  </h4>
                  <p className="text-white/80 text-sm">
                    This will reset the{" "}
                    <span className="font-semibold">{flywheelName}</span>{" "}
                    flywheel to default. Are you sure you want to continue?
                  </p>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div>
              <h3 className="text-white/60 text-sm font-medium mb-3">
                Transaction Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Action</span>
                  <span className="text-white">Disable {flywheelName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Status</span>
                  <span className="text-white">Reset to Default</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Gas</span>
                  <span className="text-white">~0.001 ETH (estimated)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 px-6 py-5 border-t border-white/10">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="flex-1"
              disabled={isSigning}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleSignAndDisable}
              className="flex-1"
              disabled={isSigning}
            >
              {isSigning ? (
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
                "Sign & Disable"
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
