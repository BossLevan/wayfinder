"use client";

export default function Help() {
  const faqs = [
    {
      q: "What is a flywheel?",
      a: "A compounding motion that creates momentum for your coin via rewards, buybacks, and coordination.",
    },
    {
      q: "How do I fund my flywheel?",
      a: "Allocate a percentage of revenue or a fixed amount. The smart contract handles distribution.",
    },
    {
      q: "Can I pause a flywheel?",
      a: "Yes. Disable any flywheel from Settings. To reset all flywheels, use the Danger Zone.",
    },
    {
      q: "What are spend caps?",
      a: "Daily and weekly caps prevent runaway costs across flywheels.",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="text-sm font-semibold mb-1">{f.q}</div>
            <p className="text-sm text-white/70">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
        <div className="text-sm font-semibold mb-2">Need More Help?</div>
        <ul className="text-sm text-white/80 space-y-1 list-disc pl-5">
          <li>
            <a className="underline hover:text-white" href="#">
              Submit a ticket
            </a>
          </li>
          <li>
            <a className="underline hover:text-white" href="#">
              Email support@wayfinder.xyz
            </a>
          </li>
          <li>
            <a className="underline hover:text-white" href="#">
              Join our Discord
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}