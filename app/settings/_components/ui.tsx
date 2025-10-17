"use client";

import React from "react";

/**
 * Minimal UI primitives to keep styles consistent.
 * These wrap Tailwind classes so the rest of the code stays lean.
 */

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className = "", ...rest } = props;
  return (
    <div
      className={`bg-[#0F1424] border border-white/10 rounded-xl ${className}`}
      {...rest}
    />
  );
}

export function Button({
  variant = "ghost",
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "danger" | "ghost";
}) {
  const base = "px-3 py-2 rounded-md text-sm transition border";
  const look =
    variant === "primary"
      ? "bg-white text-[#0B1424] border-transparent hover:opacity-95"
      : variant === "danger"
      ? "bg-[#E5484D] text-white border-white/10 hover:opacity-90"
      : "bg-white/0 text-white/90 border-transparent hover:bg-white/10 hover:border-white/10";
  return <button className={`${base} ${look} ${className}`} {...rest} />;
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-white/90">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <div className="text-xs text-white/60 mb-1">{label}</div>
      {children}
      {hint ? <div className="text-[11px] text-white/40 mt-1">{hint}</div> : null}
    </label>
  );
}

export function Input(
  props: React.InputHTMLAttributes<HTMLInputElement> & { mono?: boolean }
) {
  const { className = "", mono, ...rest } = props;
  return (
    <input
      {...rest}
      className={`w-full bg-[#0B0F1A] border border-white/10 rounded-md px-3 py-2 text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#0B5FFF] ${
        mono ? "font-mono" : ""
      } ${className}`}
    />
  );
}

export function NumberInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & { mono?: boolean }
) {
  return <Input type="number" step="any" inputMode="decimal" {...props} />;
}

/**
 * Lightweight tabs that manage active state in parent.
 */
export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: string; label: string }[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg bg-white/5 p-1">
      {tabs.map((t) => (
        <Button
          key={t.key}
          variant={active === t.key ? "primary" : "ghost"}
          className={active === t.key ? "" : "text-white/80"}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </Button>
      ))}
    </div>
  );
}