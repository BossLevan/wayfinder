"use client";

import { useState } from "react";
import { Input, NumberInput, Field, Button } from "../ui";
import { useSettingsState } from "../../_state/settings-state";
import { useFlywheelState } from "../../../_state/flywheel-state";
import {
  SlidersHorizontal,
  Settings,
  TriangleAlert,
  Check,
  Zap,
} from "lucide-react";

function Row({ cols, children }: { cols: number; children: React.ReactNode }) {
  // Single line with exactly `cols` equal-width columns that stretch to container.
  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {children}
    </div>
  );
}

function SectionBlock({
  title,
  children,
  hint,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  hint?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
          {icon}
          {title}
        </div>
        {children}
        {hint ? <div className="text-xs text-white/50">{hint}</div> : null}
      </div>
    </div>
  );
}

export default function General() {
  const { state, update, reset, save } = useSettingsState();
  const { allocations, updateAllocation } = useFlywheelState();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await save();
      setSaveSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Coin Profile — 3 columns full stretch */}
      <SectionBlock
        title="Coin Profile"
        icon={<SlidersHorizontal size={16} className="text-white/70" />}
      >
        <Row cols={3}>
          <Field label="Project Name">
            <Input
              placeholder="Wayfinder Labs"
              value={state.projectName}
              onChange={(e) => update("projectName", e.target.value)}
            />
          </Field>

          <Field label="Symbol">
            <Input
              placeholder="WFL"
              value={state.symbol}
              onChange={(e) => update("symbol", e.target.value)}
            />
          </Field>

          <Field label="Contract">
            <Input
              mono
              placeholder="0x1e9d...a3f2"
              value={state.contract}
              onChange={(e) => update("contract", e.target.value)}
            />
          </Field>
        </Row>
      </SectionBlock>

      {/* Default Flywheel Allocations — 4 columns full stretch */}
      <SectionBlock
        title="Default Flywheel Allocations"
        icon={<Settings size={16} className="text-white/70" />}
        hint="These defaults will be pre‑filled when you configure new flywheels."
      >
        <Row cols={4}>
          <Field label="Revenue Sharing (%)">
            <NumberInput
              placeholder="2"
              value={state.revenueSharePct}
              onChange={(e) =>
                update(
                  "revenueSharePct",
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
          </Field>

          <Field label="Buybacks (%)">
            <NumberInput
              placeholder="3"
              value={state.boostsPerWeek}
              onChange={(e) =>
                update(
                  "boostsPerWeek",
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
          </Field>

          <Field label="Airdrop Amount ($)">
            <NumberInput
              placeholder="1,000"
              value={state.airdropAmountUsd}
              onChange={(e) =>
                update(
                  "airdropAmountUsd",
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
          </Field>

          <Field label="Index Buys (%)">
            <NumberInput
              placeholder="5"
              value={state.inviteSlots}
              onChange={(e) =>
                update(
                  "inviteSlots",
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
          </Field>
        </Row>
      </SectionBlock>

      {/* Active Flywheel Allocations */}
      <SectionBlock
        title="Active Flywheel Allocations"
        icon={<Zap size={16} className="text-white/70" />}
        hint="Set percentages for each active flywheel (updates the allocation chart)"
      >
        <Row cols={4}>
          {allocations.map((allocation) => (
            <Field key={allocation.name} label={`${allocation.name} (%)`}>
              <div className="flex items-center gap-2">
                <NumberInput
                  placeholder="0"
                  value={allocation.percentage}
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? 0 : Number(e.target.value);
                    updateAllocation(
                      allocation.name,
                      value,
                      allocation.isActive
                    );
                  }}
                  disabled={!allocation.isActive}
                />
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allocation.isActive}
                    onChange={(e) => {
                      updateAllocation(
                        allocation.name,
                        allocation.percentage,
                        e.target.checked
                      );
                    }}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-blue-600"
                  />
                </label>
              </div>
            </Field>
          ))}
        </Row>
      </SectionBlock>

      {/* Spend Caps & Guardrails — 4 columns full stretch */}
      <SectionBlock
        title="Spend Caps & Guardrails"
        icon={<SlidersHorizontal size={16} className="text-white/70" />}
        hint="Limits apply across flywheels"
      >
        <Row cols={4}>
          <Field label="Daily Cap ($)">
            <NumberInput
              placeholder="2,500"
              value={state.dailyCapUsd}
              onChange={(e) =>
                update(
                  "dailyCapUsd",
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
          </Field>

          <Field label="Weekly Cap ($)">
            <NumberInput
              placeholder="9,000"
              value={state.weeklyCapUsd}
              onChange={(e) =>
                update(
                  "weeklyCapUsd",
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
          </Field>

          <Field label="Max Slippage (%)">
            <NumberInput
              placeholder="1"
              value={state.maxSlippagePct}
              onChange={(e) =>
                update(
                  "maxSlippagePct",
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
          </Field>

          <Field label="Pause if Price < ($)">
            <NumberInput
              placeholder="0.75"
              value={state.priceImpactMax}
              onChange={(e) =>
                update(
                  "priceImpactMax",
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
          </Field>
        </Row>
      </SectionBlock>

      {/* Danger Zone */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        {/* Title (normal white color) */}
        <div className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-3">
          <TriangleAlert size={16} className="text-red-400" />
          Danger Zone
        </div>

        {/* The Button (the only colored part) */}
        <div>
          <button
            onClick={() => {
              // We add a confirmation here for safety
              if (confirm("Are you sure? This action cannot be undone.")) {
                console.log("TODO: Resetting all flywheels...");
                //  function to reset all flywheels goeshere
              }
            }}
            className="bg-orange-500/10 border border-red-500/60 text-red-400 px-3 py-1.5 text-xs font-medium rounded-lg 
                 hover:bg-red-500/10 hover:border-red-500/90 transition-colors
                 focus:outline-none focus:ring-2 focus:ring-red-500/50"
          >
            Reset All Flywheels (requires re-signing each)
          </button>
        </div>
        {/* Description text from the screenshot's design */}
        <div className="text-xs text-white/70 mt-3">
          This will disable all active flywheels. You'll need to reconfigure and
          sign transactions for each one
        </div>
      </div>
      {/* --- End: Danger Zone --- */}

      {/* Save Button */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed transition-colors rounded-lg px-6 py-2 text-sm font-medium inline-flex items-center gap-2"
        >
          {saveSuccess ? (
            <>
              <Check size={16} />
              Saved!
            </>
          ) : (
            <>{isSaving ? "Saving..." : "Save Settings"}</>
          )}
        </button>
      </div>
    </div>
  );
}

// function ResetAllFlywheels() {
//   return (
//     <Button hint="This action cannot be undone." variant="danger">Reset All Flywheels (requires re‑signing each)</Button>
//   );
// }
