"use client";

import React from "react";
import { ChevronsUpDown } from "lucide-react";

/**
 * Minimal UI primitives to keep styles consistent.
 * These wrap Tailwind classes so the rest of the code stays lean.
 */

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className = "", ...rest } = props;
  return (
    <div
      className={`bg-[#151515] border border-white/10 rounded-xl ${className}`}
      {...rest}
    />
  );
}

// button section
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
    const items = React.Children.toArray(children);
    const cols = items.length || 1;
  
    return (
      <div className="space-y-3 w-full">
        {/* Section title */}
        {title && (
          <h3 className="text-sm font-semibold text-white/90">{title}</h3>
        )}
  
        {/* Inputs (children) arranged side-by-side */}
        <div
          className="grid gap-3 w-full"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          }}
        >
          {items.map((child, i) => (
            <div key={i} className="w-full">
              {child}
            </div>
          ))}
        </div>
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
        className={`w-full bg-inherit text-white border border-white/30 rounded-md px-3 py-2 text-sm
          placeholder:text-white/70 caret-white
          focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/20
          ${mono ? "font-mono" : ""} ${className}`}
      />
    );
  }
  
  export function NumberInput(
    props: React.InputHTMLAttributes<HTMLInputElement> & { mono?: boolean }
  ) {
    const { className = "", mono, ...rest } = props;
    return (
      <div className="relative">
        <Input
          type="number"
          step="any"
          inputMode="decimal"
          className={`pr-8 ${className}`}
          {...rest}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronsUpDown size={16} className="text-white/40" />
        </div>
      </div>
    );
  }

/**
 * Lightweight tabs that manage active state in parent.
 */
export function Tabs({
    tabs,
    active,
    onChange,
  }: {
    tabs: { key: string; label: string; icon?: React.ReactNode }[];
    active: string;
    onChange: (key: string) => void;
  }) {
    return (
      <div className="inline-flex items-center gap-2">
        {tabs.map((t) => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              className={[
                "flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition rounded-md border",
                "focus:outline-none focus:ring-0",
                isActive
                  ? "bg-white text-black border-white/20"
                  : "text-white/80 hover:bg-white/10 border-white/10 hover:border-white/20",
              ].join(" ")}
              aria-pressed={isActive}
            >
              {t.icon}
              {t.label}
            </button>
          );
        })}
      </div>
    );
  }