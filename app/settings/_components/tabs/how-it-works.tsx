"use client";

export default function HowItWorks() {
  const steps = [
    { title: "Unpause Your Coin", body: "Unpause to allow creator actions to interact with the contract across the network." },
    { title: "Choose a Flywheel", body: "Pick from buybacks, invites, boosts, and airdrops to match your motion." },
    { title: "Configure & Review", body: "Set guardrails, percentages, and timing blocks. Inspect impact before deploying." },
    { title: "Begin the Transaction", body: "We simulate and sign with your wallet. Pause or tweak as needed." },
    { title: "Show & Track", body: "Share or embed widgets. Track performance live via analytics." },
  ];

  return (
    <div className="space-y-4">
      {steps.map((s, i) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-sm font-semibold mb-1">{i + 1}. {s.title}</div>
          <p className="text-sm text-white/70">{s.body}</p>
        </div>
      ))}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="text-sm font-semibold mb-1">Why Flywheels Matter</div>
        <p className="text-sm text-white/70">
          Flywheels compound growth by recycling positive outputs and building momentum, while guardrails protect treasury and predictability.
        </p>
      </div>
    </div>
  );
}