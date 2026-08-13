/* global React, window */
/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// engage-banner.jsx (v5 spec)
// v5 change: lavender variant bg #FAE2FE → #F3E7F4 (Engage-only identity color;
// #FAE2FE is reserved for Channel banner / Replied pill / Intent Help tag).
//
// Icon: uses the actual Engage mascot illustration (purple chat bubble with
// 3 dot-eyes) from the design — sourced from uploads/engage.svg, copied as
// engage-aisee-v2/engage-banner-icon.svg so the icon ships with this folder.
// ─────────────────────────────────────────────────────────────────────────────

const { cn } = window;

window.EngageBanner = function EngageBanner({ variant = "lavender", title, subtitle, stats }) {
  const bg = variant === "lime" ? "#F0FFBA" : "#F3E7F4";
  return (
    <div
      className="mx-6 mt-5 rounded-[14px] h-[76px] px-[22px] py-[15px] flex items-center overflow-hidden"
      style={{ backgroundColor: bg }}
    >
      <div className="flex items-center gap-3.5 w-full h-[46px]">
        <img
          src={window.__resources?.engageBannerIcon || "engage-aisee-v2/engage-banner-icon.svg"}
          alt="Engage"
          width={46}
          height={46}
          className="shrink-0 rounded-[10px]"
          style={{ boxShadow: "0 1px 2px rgba(17,17,17,0.06)" }}
        />

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
