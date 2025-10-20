"use client";

import { createContext, useContext, useMemo, useReducer } from "react";

/**
 * Settings shape kept intentionally small and lean.
 * Extend as you connect real data.
 */
export type SettingsState = {
  projectName: string;
  symbol: string;
  contract: string;
  revenueSharePct: number | "";
  boostsPerWeek: number | "";
  airdropAmountUsd: number | "";
  inviteSlots: number | "";
  dailyCapUsd: number | "";
  weeklyCapUsd: number | "";
  maxSlippagePct: number | "";
  priceImpactMax: number | "";
};

type Action =
  | { type: "update"; key: keyof SettingsState; value: string | number | "" }
  | { type: "reset" };

const initialState: SettingsState = {
  projectName: "",
  symbol: "",
  contract: "",
  revenueSharePct: "",
  boostsPerWeek: "",
  airdropAmountUsd: "",
  inviteSlots: "",
  dailyCapUsd: "",
  weeklyCapUsd: "",
  maxSlippagePct: "",
  priceImpactMax: "",
};

function reducer(state: SettingsState, action: Action): SettingsState {
  switch (action.type) {
    case "update":
      return { ...state, [action.key]: action.value as never };
    case "reset":
      return initialState;
    default:
      return state;
  }
}

const SettingsStateContext = createContext<{
  state: SettingsState;
  update: (key: keyof SettingsState, value: string | number | "") => void;
  reset: () => void;
} | null>(null);

/**
 * This provider is colocated with the page; I should lift to a higher 
 * layout when needed for better organization.
 */
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const api = useMemo(
    () => ({
      state,
      update: (key: keyof SettingsState, value: string | number | "") =>
        dispatch({ type: "update", key, value }),
      reset: () => dispatch({ type: "reset" }),
    }),
    [state]
  );

  return (
    <SettingsStateContext.Provider value={api}>
      {children}
    </SettingsStateContext.Provider>
  );
}

export function useSettingsState() {
  const ctx = useContext(SettingsStateContext);
  if (!ctx) throw new Error("useSettingsState must be used within SettingsProvider");
  return ctx;
}