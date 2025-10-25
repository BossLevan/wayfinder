"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type FlywheelAllocation = {
  name: "Revenue Share" | "Airdrop" | "Burns" | "Buyback";
  percentage: number;
  isActive: boolean;
};

type FlywheelState = {
  allocations: FlywheelAllocation[];
  updateAllocation: (
    name: FlywheelAllocation["name"],
    percentage: number,
    isActive: boolean
  ) => void;
  getTotalPercentage: () => number;
};

const STORAGE_KEY = "wayfinder_flywheel_allocations";

const defaultAllocations: FlywheelAllocation[] = [
  { name: "Revenue Share", percentage: 10, isActive: true },
  { name: "Airdrop", percentage: 6, isActive: true },
  { name: "Burns", percentage: 5, isActive: true },
  { name: "Buyback", percentage: 4, isActive: true },
];

const FlywheelStateContext = createContext<FlywheelState | null>(null);

export function FlywheelProvider({ children }: { children: React.ReactNode }) {
  const [allocations, setAllocations] =
    useState<FlywheelAllocation[]>(defaultAllocations);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setAllocations(parsed);
        } catch (err) {
          console.error("Failed to load flywheel allocations:", err);
        }
      }
    }
  }, []);

  // Save to localStorage whenever allocations change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allocations));
    }
  }, [allocations]);

  const updateAllocation = (
    name: FlywheelAllocation["name"],
    percentage: number,
    isActive: boolean
  ) => {
    setAllocations((prev) =>
      prev.map((alloc) =>
        alloc.name === name ? { ...alloc, percentage, isActive } : alloc
      )
    );
  };

  const getTotalPercentage = () => {
    return allocations
      .filter((a) => a.isActive)
      .reduce((sum, a) => sum + a.percentage, 0);
  };

  return (
    <FlywheelStateContext.Provider
      value={{ allocations, updateAllocation, getTotalPercentage }}
    >
      {children}
    </FlywheelStateContext.Provider>
  );
}

export function useFlywheelState() {
  const ctx = useContext(FlywheelStateContext);
  if (!ctx)
    throw new Error("useFlywheelState must be used within FlywheelProvider");
  return ctx;
}
