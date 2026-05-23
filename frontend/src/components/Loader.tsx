"use client";

const STEPS = [
  { icon: "🔍", label: "Researching market & competitors…" },
  { icon: "🏗️", label: "Designing architecture…" },
  { icon: "🗓️", label: "Building 12-week roadmap…" },
  { icon: "🎤", label: "Crafting pitch deck…" },
  { icon: "📄", label: "Generating PDF report…" },
];

export default function Loader({ step }: { step: number }) {
  return (
    <div className="flex flex-col items-center gap-6 py-16">
      <div className="relative w-20 h-20">
        <div
          className="absolute inset-0 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin"
          style={{ animationDuration: "0.9s" }}
        />
        <div className="absolute inset-3 rounded-full bg-[var(--slate)] flex items-center justify-center text-2xl">
          {STEPS[Math.min(step, STEPS.length - 1)].icon}
        </div>
      </div>

      <div className="text-center">
        <p className="text-[var(--accent)] font-mono text-sm mb-1">
          Step {step + 1} of {STEPS.length}
        </p>
        <p className="text-[#c8c8d8]">
          {STEPS[Math.min(step, STEPS.length - 1)].label}
        </p>
      </div>

      <div className="flex gap-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: i <= step ? "32px" : "8px",
              background: i <= step ? "var(--accent)" : "var(--muted)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
