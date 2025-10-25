"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, Loader2, AlertCircle } from "lucide-react";

type ToastType = "success" | "error" | "loading" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType, duration?: number) => string;
  dismissToast: (id: string) => void;
  updateToast: (id: string, message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType, duration = 5000): string => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      // Auto dismiss after duration (unless it's a loading toast)
      if (type !== "loading" && duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }

      return id;
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const updateToast = useCallback(
    (id: string, message: string, type: ToastType) => {
      setToasts((prev) =>
        prev.map((toast) =>
          toast.id === id ? { ...toast, message, type } : toast
        )
      );

      // Auto dismiss success/error toasts after update
      if (type === "success" || type === "error") {
        setTimeout(() => {
          dismissToast(id);
        }, 5000);
      }
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, dismissToast, updateToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={() => dismissToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: () => void;
}) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    loading: <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />,
    info: <AlertCircle className="w-5 h-5 text-blue-400" />,
  };

  const backgrounds = {
    success: "bg-green-900/90 border-green-600/50",
    error: "bg-red-900/90 border-red-600/50",
    loading: "bg-blue-900/90 border-blue-600/50",
    info: "bg-gray-900/90 border-gray-600/50",
  };

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm shadow-lg ${
        backgrounds[toast.type]
      } animate-in slide-in-from-right`}
    >
      {icons[toast.type]}
      <p className="text-sm text-white flex-1">{toast.message}</p>
      {toast.type !== "loading" && (
        <button
          onClick={onDismiss}
          className="text-white/60 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
