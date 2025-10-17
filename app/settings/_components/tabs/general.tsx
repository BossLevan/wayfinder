"use client";

import { Field, NumberInput, Section, Input, Button } from "../ui";
import { useSettingsState } from "../../_state/settings-state";

export default function General() {
  const { state, update, reset } = useSettingsState();

  return (
    <div className="space-y-6">
      <Section title="Coin Profile">
        <Field label="Project Name">
          <Input value={state.projectName} onChange={(e) => update("projectName", e.target.value)} placeholder="Wayfinder Labs" />
        </Field>
        <Field label="Symbol">
          <Input value={state.symbol} onChange={(e) => update("symbol", e.target.value)} placeholder="WFL" />
        </Field>
        <Field label="Contract">
          <Input mono value={state.contract} onChange={(e) => update("contract", e.target.value)} placeholder="0x1e9d...a3f2" />
        </Field>
        <div />
      </Section>

      <Section title="Default Flywheel Allocations">
        <Field label="Revenue Share (%)">
          <NumberInput value={state.revenueSharePct} onChange={(e) => update("revenueSharePct", e.target.value === "" ? "" : Number(e.target.value))} placeholder="2" />
        </Field>
        <Field label="Boosts/week">
          <NumberInput value={state.boostsPerWeek} onChange={(e) => update("boostsPerWeek", e.target.value === "" ? "" : Number(e.target.value))} placeholder="3" />
        </Field>
        <Field label="Airdrop Amount ($)">
          <NumberInput value={state.airdropAmountUsd} onChange={(e) => update("airdropAmountUsd", e.target.value === "" ? "" : Number(e.target.value))} placeholder="1000" />
        </Field>
        <Field label="Invite Slots">
          <NumberInput value={state.inviteSlots} onChange={(e) => update("inviteSlots", e.target.value === "" ? "" : Number(e.target.value))} placeholder="5" />
        </Field>
      </Section>

      <Section title="Spend Caps & Guardrails">
        <Field label="Daily Cap ($)">
          <NumberInput value={state.dailyCapUsd} onChange={(e) => update("dailyCapUsd", e.target.value === "" ? "" : Number(e.target.value))} placeholder="2000" />
        </Field>
        <Field label="Weekly Cap ($)">
          <NumberInput value={state.weeklyCapUsd} onChange={(e) => update("weeklyCapUsd", e.target.value === "" ? "" : Number(e.target.value))} placeholder="9000" />
        </Field>
        <Field label="Max Slippage (%)">
          <NumberInput value={state.maxSlippagePct} onChange={(e) => update("maxSlippagePct", e.target.value === "" ? "" : Number(e.target.value))} placeholder="1" />
        </Field>
        <Field label="Price Impact Max">
          <NumberInput value={state.priceImpactMax} onChange={(e) => update("priceImpactMax", e.target.value === "" ? "" : Number(e.target.value))} placeholder="0.75" />
        </Field>
      </Section>

      <div className="pt-2 flex gap-2">
        <Button variant="danger">Danger Zone</Button>
        <Button onClick={reset}>Reset</Button>
      </div>
    </div>
  );
}