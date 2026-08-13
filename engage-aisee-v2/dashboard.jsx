/* global React, window */
/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// dashboard.jsx (v5 new — Engage zone Tab 1)
//
// Layout (per dapp-design.v5.md §13.4):
//   Banner → "Engagement Performance" header w/ X/Reddit toggle → 5-col KPI strip
//   → Replies sent bar chart + Your Impressions area chart (cream containers)
//   → Engage traffic donut + Top sources + Calendar/Sent
//
// All chart container cards: cream #FBFBF3 (NOT white — this is the module's
// signature dashboard look — KPI strip is the only white block).
// ─────────────────────────────────────────────────────────────────────────────

const { useState: useStateDB } = React;
const { cn } = window;
const I = window.Icons;

// ── Platform toggle group (used on Engagement Performance + each chart) ────
function PlatformToggleGroup({ active, setActive, compact }) {
  return (
    <div className="inline-flex items-center gap-1.5">
      {[
        { id: "x",      label: "X",      bg: "bg-primary",        text: "text-white",
          icon: <I.PlatformX size={9} /> },
        { id: "reddit", label: "Reddit", bg: "bg-red-ec5212",     text: "text-white",
          icon: <I.PlatformR /> },
      ].map((p) => {
        const on = active.has(p.id);
        return (
          <button
            key={p.id}
            onClick={() => {
              const n = new Set(active);
              n.has(p.id) ? n.delete(p.id) : n.add(p.id);
              if (n.size === 0) n.add(p.id);   // can't deselect last
              setActive(n);
            }}
            className={cn(
              "h-6 rounded-full px-2 inline-flex items-center gap-1 transition-colors cursor-pointer",
              compact ? "text-[11px]" : "text-[11.5px]",
              on
                ? "bg-yellow-ffe253 text-primary"
                : "bg-primary/[0.04] text-primary/60 hover:bg-primary/[0.08]"
            )}
          >
            <span className={cn("w-[14px] h-[14px] rounded-full inline-flex items-center justify-center", p.bg, p.text)}>
              {p.icon}
            </span>
            <span className="leading-none font-medium">{p.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── KPI strip ──────────────────────────────────────────────────────────────
function KPI({ value, unit, label, info }) {
  return (
    <div className="flex flex-col gap-1 px-6 first:pl-0 last:pr-0 flex-1 min-w-0">
      <div className="flex items-baseline gap-1">
        <span className="text-[28px] font-bold leading-none tabular-nums">{value}</span>
        {unit && <span className="text-[12px] font-medium text-primary/70 leading-none">{unit}</span>}
      </div>
      <div className="flex items-center gap-1 mt-2">
        <span className="text-[12px] text-primary/60 leading-tight">{label}</span>
        {info && <I.Info className="w-3 h-3 text-primary/35 shrink-0" />}
      </div>
    </div>
  );
}

// ── Replies sent — bar chart ───────────────────────────────────────────────
function RepliesSentChart() {
  const [active, setActive] = useStateDB(new Set(["x", "reddit"]));
  const days = [
    { d: "3/12", x: 60,  r: 18 },
    { d: "3/13", x: 38,  r: 12 },
    { d: "3/14", x: 70,  r: 25 },
    { d: "3/15", x: 52,  r: 20 },
    { d: "3/16", x: 72,  r: 28 },
    { d: "3/17", x:100,  r: 29, hi: true },
    { d: "3/18", x: 78,  r: 25 },
    { d: "3/19", x: 38,  r: 10 },
    { d: "3/20", x: 60,  r: 18 },
    { d: "3/21", x: 70,  r: 24 },
    { d: "3/22", x: 68,  r: 22 },
    { d: "3/23", x: 50,  r: 18 },
  ];

  const MAX = 140;
  const showX = active.has("x");
  const showR = active.has("reddit");

  const [hovered, setHovered] = useStateDB(5); // index of bar with tooltip

  return (
    <div className="rounded-[16px] p-5 pb-2 flex flex-col gap-3"
      style={{ backgroundColor: "#FBFBF3", boxShadow: "0 0 0 1px rgba(17,17,17,0.05)" }}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[13px] font-medium text-primary/70 mb-1 inline-flex items-center gap-1">
            Replies sent
            <I.Info className="w-3 h-3 text-primary/35" />
          </div>
          <div className="text-[32px] font-bold leading-none tabular-nums">129</div>
        </div>
        <div className="flex items-center gap-2">
          <PlatformToggleGroup active={active} setActive={setActive} compact />
          <button className="h-7 px-2.5 rounded-lg border border-primary/[0.05] bg-white text-[11px] font-medium inline-flex items-center gap-1 hover:border-primary/[0.18] cursor-pointer transition-colors">
            Monthly <I.ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* chart body */}
      <div className="relative h-[200px] mt-2 pl-7">
        {/* Y-axis labels + grid */}
        <div className="absolute left-0 top-0 bottom-6 w-7 flex flex-col justify-between text-[10px] text-primary/40 pr-1 text-right">
          {[140,120,100,80,60,40,20,0].map((y) => <span key={y}>{y}</span>)}
        </div>
        {/* grid lines */}
        <div className="absolute left-7 right-0 top-0 bottom-6">
          {[0,1,2,3,4,5,6,7].map((i) => (
            <div key={i} className="absolute left-0 right-0" style={{
              top: `${(i/7)*100}%`, borderTop: "1px dashed rgba(17,17,17,0.05)"
            }} />
          ))}
        </div>

        {/* bars */}
        <div className="absolute left-7 right-0 top-0 bottom-6 flex items-end justify-between gap-2">
          {days.map((d, i) => {
            const total = (showX ? d.x : 0) + (showR ? d.r : 0);
            const h = (total / MAX) * 100;
            const isHovered = hovered === i;
            return (
              <div key={i}
                className="flex-1 flex flex-col items-center justify-end relative"
                onMouseEnter={() => setHovered(i)}>
                {/* dashed connector going up (only when hovered) */}
                {isHovered && (
                  <div className="absolute left-1/2 -translate-x-1/2 -top-2 border-l border-dashed border-primary/40"
                    style={{ height: "20px" }} />
                )}
                <div
                  className={cn(
                    "rounded-t-[4px] relative transition-all",
                    isHovered ? "bg-[#FCEB63]" : "bg-yellow-ffe253"
                  )}
                  style={{ width: 18, height: `${h}%` }}
                />
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+24px)] z-10
                    bg-white rounded-lg px-3 py-2 w-[132px] shadow-[0_8px_16px_rgba(0,0,0,0.06)]
                    border border-primary/[0.05] text-left">
                    <div className="text-[11px] font-semibold text-primary/60 mb-1">Mar {17 + (i-5)}</div>
                    {showX && (
                      <div className="flex items-center justify-between text-[12px] font-semibold tabular-nums">
                        <span className="inline-flex items-center gap-1">
                          <span className="w-[14px] h-[14px] rounded-full bg-primary text-white inline-flex items-center justify-center">
                            <I.PlatformX size={8}/>
                          </span>
                          X
                        </span>
                        <span>{d.x}</span>
                      </div>
                    )}
                    {showR && (
                      <div className="flex items-center justify-between text-[12px] font-semibold tabular-nums">
                        <span className="inline-flex items-center gap-1">
                          <span className="w-[14px] h-[14px] rounded-full bg-red-ec5212 text-white inline-flex items-center justify-center">
                            <I.PlatformR/>
                          </span>
                          Reddit
                        </span>
                        <span>{d.r}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="absolute left-7 right-0 bottom-0 flex justify-between text-[10px] text-primary/40">
          {days.map((d) => <span key={d.d} className="flex-1 text-center">{d.d}</span>)}
        </div>
      </div>
    </div>
  );
}

// ── Your Impressions — area chart (single layer per v5 figma) ─────────────
function ImpressionsChart() {
  const [active, setActive] = useStateDB(new Set(["x", "reddit"]));

  // Smooth curve (path coords), normalized to 0-100 viewport
  // Single-layer gold gradient #FFD85F as confirmed by figma reverse-check
  const xPath  = "M 0,55 C 40,70 80,40 120,38 C 160,36 200,18 240,18 C 280,18 320,38 360,42 C 400,46 440,12 480,8 L 480,100 L 0,100 Z";
  const rPath  = "M 0,72 C 40,82 80,58 120,55 C 160,52 200,34 240,30 C 280,26 320,46 360,52 C 400,58 440,30 480,28 L 480,100 L 0,100 Z";

  return (
    <div className="rounded-[16px] p-5 flex flex-col gap-3"
      style={{ backgroundColor: "#FBFBF3", boxShadow: "0 0 0 1px rgba(17,17,17,0.05)" }}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[13px] font-medium text-primary/70 mb-1">Your Impressions</div>
          <div className="text-[32px] font-bold leading-none tabular-nums">17K</div>
        </div>
        <div className="flex items-center gap-2">
          <PlatformToggleGroup active={active} setActive={setActive} compact />
          <button className="h-7 px-2.5 rounded-lg border border-primary/[0.05] bg-white text-[11px] font-medium inline-flex items-center gap-1 hover:border-primary/[0.18] cursor-pointer transition-colors">
            Monthly <I.ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="relative h-[200px] mt-2 pl-9">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-6 w-9 flex flex-col justify-between text-[10px] text-primary/40 pr-1 text-right">
          {["400K","300K","200K","100K","0"].map((y) => <span key={y}>{y}</span>)}
        </div>
        {/* grid lines */}
        <div className="absolute left-9 right-0 top-0 bottom-6">
          {[0,1,2,3,4].map((i) => (
            <div key={i} className="absolute left-0 right-0" style={{
              top: `${(i/4)*100}%`, borderTop: "1px dashed rgba(17,17,17,0.12)"
            }} />
          ))}
        </div>

        {/* SVG chart */}
        <svg
          className="absolute left-9 right-0 top-0 bottom-6 w-[calc(100%-2.25rem)]"
          viewBox="0 0 480 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="xFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#FFD85F" stopOpacity="0.9"/>
              <stop offset="100%" stopColor="#FFD85F" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="rFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#8C7400" stopOpacity="0.55"/>
              <stop offset="100%" stopColor="#8C7400" stopOpacity="0"/>
            </linearGradient>
          </defs>
          {active.has("reddit") && (<>
            <path d={rPath} fill="url(#rFill)" />
            <path d="M 0,72 C 40,82 80,58 120,55 C 160,52 200,34 240,30 C 280,26 320,46 360,52 C 400,58 440,30 480,28"
              stroke="#8C7400" strokeWidth="1.6" fill="none" vectorEffect="non-scaling-stroke" />
          </>)}
          {active.has("x") && (<>
            <path d={xPath} fill="url(#xFill)" />
            <path d="M 0,55 C 40,70 80,40 120,38 C 160,36 200,18 240,18 C 280,18 320,38 360,42 C 400,46 440,12 480,8"
              stroke="#111" strokeWidth="1.6" fill="none" vectorEffect="non-scaling-stroke" />
          </>)}
          {/* Hover dots at x=240 (Mar 20) */}
          <circle cx="240" cy="30" r="3" fill="#8C7400" />
          <circle cx="240" cy="18" r="3" fill="#111" />
          {/* Vertical dashed indicator */}
          <line x1="240" y1="0" x2="240" y2="100" stroke="rgba(17,17,17,0.35)" strokeWidth="0.4"
            strokeDasharray="2,2" vectorEffect="non-scaling-stroke"/>
        </svg>

        {/* Tooltip near Mar 20 */}
        <div className="absolute left-[calc(50%-20px)] top-[16px] z-10
          bg-white rounded-lg px-3 py-2 w-[120px] shadow-[0_8px_16px_rgba(0,0,0,0.06)]
          border border-primary/[0.05]">
          <div className="text-[11px] font-semibold text-primary/60 mb-1">Mar 20</div>
          <div className="flex items-center justify-between text-[12px] font-semibold tabular-nums">
            <span className="inline-flex items-center gap-1">
              <span className="w-[14px] h-[14px] rounded-full text-white inline-flex items-center justify-center"
                style={{ backgroundColor:"#8C7400" }}>
                <I.PlatformR/>
              </span>
              Reddit
            </span>
            <span>12</span>
          </div>
          <div className="flex items-center justify-between text-[12px] font-semibold tabular-nums">
            <span className="inline-flex items-center gap-1">
              <span className="w-[14px] h-[14px] rounded-full bg-primary text-white inline-flex items-center justify-center">
                <I.PlatformX size={8}/>
              </span>
              X
            </span>
            <span>5</span>
          </div>
        </div>

        {/* X-axis labels */}
        <div className="absolute left-9 right-0 bottom-0 flex justify-between text-[10px] text-primary/40">
          {["3/1","3/5","3/10","3/15","3/18","3/20","3/22","3/25","3/29"].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Donut chart (Engage traffic by platform) ──────────────────────────────
function TrafficDonut() {
  // 43 Reddit + 8 X = 51 total. Reddit is the bigger slice in this dataset.
  const reddit = 43, x = 8;
  const total = reddit + x;
  // SVG donut: outer r=70, ring 28 = inner r=42
  const C = 2 * Math.PI * 56;          // circumference at mid-radius (56)
  const xLen = (x / total) * C;
  const rLen = (reddit / total) * C;

  return (
    <div className="rounded-[16px] p-5 flex flex-col gap-3"
      style={{ backgroundColor: "#FBFBF3", boxShadow: "0 0 0 1px rgba(17,17,17,0.05)" }}>
      <div>
        <div className="text-[13px] font-medium text-primary/70 mb-1">Engage traffic by platform</div>
        <div className="text-[32px] font-bold leading-none tabular-nums">51</div>
      </div>

      <div className="flex justify-center my-2">
        <svg width="170" height="170" viewBox="0 0 170 170">
          <g transform="translate(85,85) rotate(-90)">
            {/* base track */}
            <circle r="56" fill="none" stroke="rgba(17,17,17,0.06)" strokeWidth="28" />
            {/* Reddit segment (deep mustard #8C7400 per v5) */}
            <circle r="56" fill="none" stroke="#8C7400" strokeWidth="28"
              strokeDasharray={`${rLen} ${C}`} strokeDashoffset="0" />
            {/* X segment (yellow) */}
            <circle r="56" fill="none" stroke="#FFE253" strokeWidth="28"
              strokeDasharray={`${xLen} ${C}`} strokeDashoffset={`-${rLen}`} />
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2 text-[12px]">
        {[
          { name: "Reddit", val: 43, color: "#8C7400", icon: <I.PlatformR/>, bg: "bg-red-ec5212" },
          { name: "X",      val: 8,  color: "#FFE253", icon: <I.PlatformX size={9}/>, bg: "bg-primary" },
        ].map((row) => (
          <div key={row.name} className="flex items-center gap-2">
            <span className={cn("w-[16px] h-[16px] rounded-full text-white inline-flex items-center justify-center", row.bg)}>
              {row.icon}
            </span>
            <span className="font-medium">{row.name}:</span>
            <div className="flex-1 h-[6px] rounded bg-primary/[0.06] overflow-hidden">
              <span className="block h-full" style={{
                width: `${(row.val/total)*100}%`, backgroundColor: row.color,
              }}/>
            </div>
            <span className="font-bold tabular-nums w-7 text-right">{row.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Top engage sources ────────────────────────────────────────────────────
function TopSources() {
  const sources = [
    { handle: "@koraygubur", time: "1h ago", body: "This is one of the most common gaps we see most brands score under 30 on AI Presence even with solid content. Thr…", likes: 10, avatar: "#F3E7F4", initial: "K" },
    { handle: "vvcal",       time: "1h ago", body: "This is one of the most common gaps we see most brands score under 30 on AI Presence even with solid content. Thr…", likes:  8, avatar: "#DCEEFF", initial: "V" },
    { handle: "ccbaka",      time: "1h ago", body: "This is one of the most common gaps we see most brands score under 30 on AI Presence even with solid content. Thr…", likes:  4, avatar: "#FFFADD", initial: "C" },
  ];

  return (
    <div className="rounded-[16px] p-5 flex flex-col gap-3"
      style={{ backgroundColor: "#FBFBF3", boxShadow: "0 0 0 1px rgba(17,17,17,0.05)" }}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[13px] font-medium text-primary/70 mb-1">Top engage sources</div>
          <div className="text-[32px] font-bold leading-none tabular-nums">22 <span className="text-[12px] text-primary/60 font-normal align-middle ml-0.5">Likes</span></div>
        </div>
        <button className="h-7 px-2.5 rounded-lg border border-primary/[0.05] bg-white text-[11px] font-medium inline-flex items-center gap-1 hover:border-primary/[0.18] cursor-pointer transition-colors">
          <span className="w-[14px] h-[14px] rounded-full bg-primary text-white inline-flex items-center justify-center">
            <I.PlatformX size={8}/>
          </span>
          <I.ChevronDown className="w-3 h-3" />
        </button>
      </div>

      <div className="flex flex-col">
        {sources.map((s, i) => (
          <div key={i} className={cn("py-2.5 flex flex-col gap-1.5", i > 0 && "border-t border-dashed border-primary/[0.06]")}>
            <div className="flex items-center gap-2">
              <span className="w-[24px] h-[24px] rounded-full inline-flex items-center justify-center text-[11px] font-bold shrink-0"
                style={{ backgroundColor: s.avatar }}>{s.initial}</span>
              <span className="text-[12.5px] font-semibold truncate flex-1">{s.handle}</span>
              <span className="text-[10.5px] text-primary/50">{s.time}</span>
              <I.ExternalLink className="w-3 h-3 text-primary/50" />
            </div>
            <div className="text-[11px] text-primary/65 leading-[1.45]" style={{
              display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden"
            }}>{s.body}</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-[4px] rounded bg-primary/[0.06] overflow-hidden">
                <span className="block h-full bg-yellow-ffe253" style={{ width: `${(s.likes/10)*100}%` }} />
              </div>
              <span className="text-[10.5px] text-primary/55 tabular-nums">{s.likes} likes</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Calendar + Sent panel ─────────────────────────────────────────────────
function CalendarSent() {
  const dayCells = [
    [null,1,2,3,4,5,6],
    [7,8,9,10,11,12,13],
    [14,15,16,17,18,19,20],
    [21,22,23,24,25,26,27],
    [28,29,30,31,null,null,null],
  ];
  const eventDays = new Set([10,18,19,23,27]);
  const selected = 27;
  const today = 11;

  return (
    <div className="rounded-[16px] p-5 grid grid-cols-[1fr_180px] gap-4"
      style={{ backgroundColor: "#FBFBF3", boxShadow: "0 0 0 1px rgba(17,17,17,0.05)" }}>
      {/* Calendar */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <button className="w-6 h-6 inline-flex items-center justify-center rounded hover:bg-primary/[0.04] cursor-pointer">
            <I.ChevronDown className="w-3 h-3 rotate-90" />
          </button>
          <span className="text-[13px] font-semibold">Oct 2025</span>
          <button className="w-6 h-6 inline-flex items-center justify-center rounded hover:bg-primary/[0.04] cursor-pointer">
            <I.ChevronDown className="w-3 h-3 -rotate-90" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-1">
          {["S","M","T","W","T","F","S"].map((d, i) => (
            <span key={i} className="text-[10px] text-primary/45 text-center uppercase">{d}</span>
          ))}
        </div>
        <div className="grid grid-rows-5 gap-1">
          {dayCells.map((row, ri) => (
            <div key={ri} className="grid grid-cols-7 gap-1">
              {row.map((d, ci) => {
                if (!d) return <div key={ci} />;
                const isSel = d === selected;
                const isToday = d === today;
                const isEvent = eventDays.has(d);
                return (
                  <div key={ci} className={cn(
                    "h-[28px] inline-flex items-center justify-center text-[12px] rounded-md cursor-pointer transition-colors",
                    isSel    ? "bg-yellow-ffe253 text-primary font-bold ring-1 ring-primary"
                    : isToday  ? "ring-[1.5px] ring-primary text-primary font-medium"
                    : isEvent  ? "bg-yellow-fffadd text-primary"
                    : "text-primary/70 hover:bg-primary/[0.04]"
                  )}>
                    {d}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Sent block list */}
      <div className="flex flex-col gap-2">
        <div className="text-[13px] font-medium text-primary/70 mb-0.5">Sent</div>
        {[
          { date: "27 Oct 2025", time: "02:00", platform: "x"  },
          { date: "27 Oct 2025", time: "12:00", platform: "reddit" },
          { date: "27 Oct 2025", time: "15:44", platform: "x" },
        ].map((s, i) => (
          <div key={i} className="rounded-[10px] bg-white border border-primary/[0.05] p-2.5 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-primary/55 font-medium">{s.date}</span>
              <span className={cn(
                "w-[14px] h-[14px] rounded-full text-white inline-flex items-center justify-center",
                s.platform === "x" ? "bg-primary" : "bg-red-ec5212"
              )}>
                {s.platform === "x" ? <I.PlatformX size={8} /> : <I.PlatformR />}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[18px] font-bold tabular-nums leading-none">{s.time}</span>
            </div>
            <div className="text-[10.5px] text-primary/65 font-medium">Introduction for AISee</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Dashboard tab ────────────────────────────────────────────────────
window.EngageDashboard = function EngageDashboard() {
  const [perfActive, setPerfActive] = useStateDB(new Set(["x", "reddit"]));

  return (
    <div className="font-karla flex flex-col gap-6 pb-12">
      {/* Header row */}
      <div className="px-8 pt-4 flex items-center justify-between">
        <h2 className="text-[18px] font-bold inline-flex items-center gap-1.5">
          Engagement Performance
          <I.Info className="w-3.5 h-3.5 text-primary/35" />
        </h2>
        <PlatformToggleGroup active={perfActive} setActive={setPerfActive} />
      </div>

      {/* KPI strip */}
      <div className="mx-8 rounded-[14px] bg-white p-6 flex items-center divide-x divide-primary/[0.05]"
        style={{ boxShadow: "0 0 0 1px rgba(17,17,17,0.05)" }}>
        <KPI value="2"     label="Replies" />
        <KPI value="100"   unit="%" label="Response rate" />
        <KPI value="18.9"  unit="K" label="Total impressions" />
        <KPI value="1,650" label="Traffic index" info />
        <KPI value="1,650" label="Total likes" />
      </div>

      {/* Two charts (2 cols) */}
      <div className="mx-8 grid grid-cols-2 gap-6">
        <RepliesSentChart />
        <ImpressionsChart />
      </div>

      {/* Bottom 3 (3 cols, last spans calendar+sent inside) */}
      <div className="mx-8 grid grid-cols-3 gap-6">
        <TrafficDonut />
        <TopSources />
        <CalendarSent />
      </div>
    </div>
  );
};
