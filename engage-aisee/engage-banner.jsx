/* global React, window */
/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// engage-banner.jsx
// Compact banner used on both the initial-config screen (lime accent) and
// the main signal-feed screen (lavender accent).
//
// In the real repo this lives at:
//   app/(pages)/engage/_components/engage-banner.tsx
// ─────────────────────────────────────────────────────────────────────────────

const { cn } = window;
const I = window.Icons;

// Inline Engage chat-bubble icon (the same one Slidebar uses).
const EngageIcon = ({ className = "" }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={cn("w-7 h-7", className)}>
    <path d="M2 3.65517C2 2.74105 2.74105 2 3.65517 2H12.3448C13.259 2 14 2.74105 14 3.65517V9.86207C14 10.7762 13.259 11.5172 12.3448 11.5172H10.1724L8 14L5.82759 11.5172H3.65517C2.74105 11.5172 2 10.7762 2 9.86207V3.65517Z" strokeWidth="1.4"/>
    <circle cx="5.5"  cy="7.17" r="0.55" fill="currentColor"/>
    <circle cx="8"    cy="7.17" r="0.55" fill="currentColor"/>
    <circle cx="10.5" cy="7.17" r="0.55" fill="currentColor"/>
  </svg>
);

/**
 * @param {{
 *   variant?: "lavender" | "lime",
 *   title: string,
 *   subtitle: string,
 *   stats: Array<{ label: string, value: string | number }>,
 * }} props
 */
window.EngageBanner = function EngageBanner({ variant = "lavender", title, subtitle, stats }) {
  return (
    <div
      className={cn(
        "mx-6 mt-5 rounded-[14px] h-[76px] px-[22px] py-[15px] flex items-center overflow-hidden",
        variant === "lime" ? "bg-green-f0ffba" : "bg-purple-fae2fe"
      )}
    >
      <div className="flex items-center gap-3.5 w-full h-[46px]">
        <div className="w-[46px] h-[46px] rounded-[10px] bg-white inline-flex items-center justify-center shrink-0 shadow-[0_1px_2px_rgba(17,17,17,0.06)]">
          <EngageIcon className="w-6 h-6 text-primary" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h1 className="font-karla font-bold text-[20px] leading-6 text-primary m-0">{title}</h1>
          <div className="text-[12.5px] leading-[18px] text-primary/60 mt-1 truncate">{subtitle}</div>
        </div>

        {stats?.length > 0 && (
          <div className="flex items-center gap-[26px] shrink-0">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col items-start">
                <span className="text-[10px] font-medium tracking-[0.04em] uppercase text-primary/55 leading-[14px] mb-px">
                  {s.label}
                </span>
                <span className="font-bold text-[19px] leading-[22px] text-primary tabular-nums">
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
