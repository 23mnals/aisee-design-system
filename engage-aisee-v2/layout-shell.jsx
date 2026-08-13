/* global React, window */
/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// layout-shell.jsx (v5 spec)
//
// Updates from v4:
// - Sidebar width 211 → 224
// - Top Tab Toggle now has 3 items (Analysis / Post Agent / Engage), all peer
// - Active tab shows icon + text on white bg + 1px inset + 0 1px 2px drop shadow
// - Inactive tabs show only icon at 50% opacity, hover → 100%
// - Sidebar sub-items (only shown when Engage tab is active) at 30px height:
//     Dashboard / Signal Feed / Keywords & Accounts / Replies
// - Replies badge text removed (kept mustard tint dot indicator)
// ─────────────────────────────────────────────────────────────────────────────

const { useState: useStateL } = React;
const { Button, cn } = window;
const I = window.Icons;

// Read once — set by page.jsx from ?plugin= URL param.
// "sidebar" → install card above account card (RECOMMENDED)
// "header"  → puzzle-icon button next to the bell
// "banner"  → handled inside signal-feed.jsx
const PLUGIN_OPT_L = (typeof window !== "undefined" && window.PLUGIN_OPT) || "none";

// Puzzle piece — Lucide-style, used by the sidebar card + header icon variants
const PuzzleIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.302.515.08.876.532 1.073 1.013a2.5 2.5 0 1 0 3.259-3.259c-.482-.197-.933-.558-1.014-1.073-.05-.336.062-.676.302-.916l1.525-1.525A2.402 2.402 0 0 1 11.998 2c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z"/>
  </svg>
);

// ── Logo ────────────────────────────────────────────────────────────────────
const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="w-[26px] h-[26px] bg-green-cfff29 rounded-t-full" />
    <span className="text-[22px] font-bold tracking-[-0.02em] font-karla">aisee</span>
  </div>
);

// ── Top Tab icons (used inactive when only icon shows) ─────────────────────
const AnalysisIcon = ({ className = "" }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="7" cy="7" r="4.5"/>
    <path d="M10.5 10.5 14 14"/>
  </svg>
);
const PostAgentIcon = ({ className = "" }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2.5" y="2.5" width="11" height="11" rx="1.6"/>
    <path d="M5.5 6.5h5M5.5 9h3"/>
  </svg>
);
const EngageIcon = ({ className = "" }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 3.65517C2 2.74105 2.74105 2 3.65517 2H12.3448C13.259 2 14 2.74105 14 3.65517V9.86207C14 10.7762 13.259 11.5172 12.3448 11.5172H10.1724L8 14L5.82759 11.5172H3.65517C2.74105 11.5172 2 10.7762 2 9.86207V3.65517Z"/>
    <circle cx="5.5" cy="7.17" r="0.45" fill="currentColor"/>
    <circle cx="8"   cy="7.17" r="0.45" fill="currentColor"/>
    <circle cx="10.5" cy="7.17" r="0.45" fill="currentColor"/>
  </svg>
);

// ── Header (unchanged from v4) ─────────────────────────────────────────────
window.Header = function Header() {
  return (
    <header className="w-full h-[70px] fixed top-0 z-20 bg-white backdrop-blur-[2px] flex items-center justify-between transition-all duration-300 px-4 md:px-6 border-b border-primary/[0.05]">
      <Logo />
      <div className="flex items-center gap-3">
        {/* Option 2 — Header puzzle-icon entry */}
        {PLUGIN_OPT_L === "header" && (
          <div className="relative group">
            <button
              aria-label="Install browser extension"
              className="relative w-9 h-9 inline-flex items-center justify-center rounded-[8px] bg-yellow-fffadd hover:bg-yellow-fff2b3 transition-colors cursor-pointer"
            >
              <PuzzleIcon className="w-[18px] h-[18px] text-primary" />
              <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] rounded-full bg-green-92bc01 ring-2 ring-white" />
            </button>
            <span className="pointer-events-none absolute top-full right-0 mt-1.5 px-2 py-1 rounded-md bg-primary text-white text-[11px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Install browser extension
            </span>
          </div>
        )}
        <button
          aria-label="Notifications"
          className="relative w-9 h-9 inline-flex items-center justify-center rounded-[8px] bg-yellow-fffadd hover:bg-yellow-fff2b3 transition-colors cursor-pointer"
        >
          <I.Bell className="w-4 h-4 text-primary" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-ec5212 ring-2 ring-white" />
        </button>
        <Button variant="yellow_bg" className="px-2.5 h-8 text-base">
          <I.Plus className="w-4 h-4" />
          <span>New</span>
        </Button>
        <div className="w-8 h-8 rounded-full bg-[#E1E1E1] inline-flex items-center justify-center font-semibold text-[12px]">G</div>
      </div>
    </header>
  );
};

// ── 3-tab Toggle (Analysis / Post Agent / Engage) ─────────────────────────
function TopTabToggle({ tab, setTab }) {
  // Active state shows icon + text on WHITE bg with double-layer shadow.
  // Inactive shows only icon @ 50% opacity → 100% on hover.
  const tabs = [
    { id: "analysis",   label: "Analysis",   Icon: AnalysisIcon },
    { id: "post-agent", label: "Post Agent", Icon: PostAgentIcon },
    { id: "engage",     label: "Engage",     Icon: EngageIcon },
  ];
  return (
    <div className="w-full rounded-lg bg-primary/[0.02] h-[34px] p-[3px] flex items-center gap-[1px]">
      {tabs.map((t) => {
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "h-[28px] rounded-lg font-karla transition-all duration-150 cursor-pointer inline-flex items-center justify-center gap-1.5",
              active
                ? "flex-[2] bg-white text-primary text-[14px] font-medium px-2"
                : "flex-1 text-primary/50 hover:text-primary text-[12px] px-1"
            )}
            style={active ? {
              boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.05), 0 1px 2px 0 rgba(0,0,0,0.12)",
            } : undefined}
          >
            <t.Icon className="shrink-0" />
            {active && <span className="leading-none">{t.label}</span>}
          </button>
        );
      })}
    </div>
  );
}

// ── Sidebar sub-item icons (Engage zone only) ──────────────────────────────
const DashIcon = (props) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <rect x="3" y="3" width="7" height="9" rx="1.5"/>
    <rect x="14" y="3" width="7" height="5" rx="1.5"/>
    <rect x="14" y="12" width="7" height="9" rx="1.5"/>
    <rect x="3" y="16" width="7" height="5" rx="1.5"/>
  </svg>
);
const SignalIcon = (props) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...props}>
    <path d="M4 12h2M9 8v8M14 5v14M19 9v6"/>
  </svg>
);
const KeywordsIcon = (props) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="6" width="20" height="12" rx="2"/>
    <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h12"/>
  </svg>
);
const RepliesIcon = (props) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m3 11 19-9-9 19-2-8-8-2z"/>
  </svg>
);

// ── Plugin sidebar card (Option 1) ────────────────────────────────────────
function PluginSidebarCard() {
  const [dismissed, setDismissed] = useStateL(false);
  if (dismissed) return null;
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className="group relative block mb-2 rounded-lg bg-yellow-fffadd hover:bg-yellow-fff2b3 transition-colors p-2.5 border border-primary/[0.05] cursor-pointer overflow-hidden"
    >
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDismissed(true); }}
        aria-label="Dismiss"
        className="absolute top-1.5 right-1.5 w-4 h-4 inline-flex items-center justify-center rounded text-primary/40 hover:text-primary hover:bg-primary/[0.06] opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
      </button>
      <div className="flex items-start gap-2.5">
        <span className="shrink-0 w-7 h-7 rounded-md bg-green-cfff29 inline-flex items-center justify-center">
          <PuzzleIcon className="w-[14px] h-[14px] text-primary" />
        </span>
        <div className="flex-1 min-w-0 pr-4">
          <div className="text-[12.5px] font-semibold leading-[1.15] text-primary">Browser extension</div>
          <div className="text-[11px] text-primary/65 leading-snug mt-0.5">Reply directly on X &amp; Reddit</div>
          <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
            Install
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </div>
        </div>
      </div>
    </a>
  );
}

// ── Sidebar (Engage sub-items shown when Engage tab is selected) ──────────
window.Slidebar = function Slidebar({ active = "dashboard", onNavigate }) {
  const [tab, setTab] = useStateL("engage");

  // Items shown under each top tab
  const ITEMS_BY_TAB = {
    analysis: [
      { id: "overview", label: "Overview" },
      { id: "score",    label: "Score" },
      { id: "report",   label: "Full Report" },
    ],
    "post-agent": [
      { id: "calendar", label: "Calendar" },
      { id: "channels", label: "Channels" },
      { id: "models",   label: "Models" },
      { id: "media",    label: "Media" },
    ],
    engage: [
      { id: "dashboard",         label: "Dashboard",          Icon: DashIcon },
      { id: "signal",            label: "Signal Feed",        Icon: SignalIcon },
      { id: "keywords",          label: "Keywords & Accounts", Icon: KeywordsIcon },
      { id: "replies",           label: "Replies",            Icon: RepliesIcon, hasIndicator: true },
    ],
  };

  const items = ITEMS_BY_TAB[tab] || [];

  return (
    <aside className="sticky top-[70px] z-auto w-[224px] h-[calc(100vh-70px)] bg-white py-4 px-2 border-r border-primary/[0.04] flex flex-col">
      {/* 3-tab top toggle */}
      <TopTabToggle tab={tab} setTab={setTab} />

      <nav className="flex-1 mt-4 flex flex-col gap-2">
        {items.map((item) => {
          const isActive = tab === "engage" && item.id === active;
          const ItemIcon = item.Icon;
          return (
            <button
              key={item.id}
              onClick={() => tab === "engage" && onNavigate?.(item.id)}
              className={cn(
                "flex items-center gap-2 h-[30px] px-2 text-primary text-[14px] font-karla rounded-lg transition-colors duration-150 cursor-pointer",
                isActive ? "bg-yellow-ffe253" : "hover:bg-primary/[0.04]"
              )}
            >
              {ItemIcon ? (
                <span className="w-[18px] h-[18px] flex items-center justify-center">
                  <ItemIcon />
                </span>
              ) : (
                <span className="w-[18px]" />
              )}
              <span className="flex-1 text-left">{item.label}</span>
              {/* Replies indicator: small mustard-tint dot (text-less, per v5) */}
              {item.hasIndicator && (
                <span
                  className="w-[6px] h-[6px] rounded-full shrink-0"
                  style={{ backgroundColor: "rgb(140,116,0)" }}
                  title="New replies"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Option 1 — Sidebar plugin card (above the account card) */}
      {PLUGIN_OPT_L === "sidebar" && <PluginSidebarCard />}

      {/* Account card */}
      <div className="rounded-lg border border-primary/[0.05] bg-gray-fafafa p-2.5 flex flex-col gap-2 text-[12px]">
        <div className="flex items-center gap-2">
          <div className="w-[26px] h-[26px] rounded-full bg-[#E1E1E1] inline-flex items-center justify-center text-[11px] font-semibold">G</div>
          <span className="font-medium">ccbakala36@gmai.co…</span>
        </div>
        <hr className="border-t border-dashed border-primary/[0.08]" />
        <div className="flex items-center justify-between">
          <span className="bg-yellow-ffe253 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full">Starter plan</span>
          <span className="text-[11px] text-primary/60">◆ 1,825 credits</span>
        </div>
        <div className="h-1.5 rounded bg-primary/[0.05] overflow-hidden">
          <span className="block h-full rounded bg-green-cfff29" style={{ width: "62%" }} />
        </div>
      </div>
    </aside>
  );
};
