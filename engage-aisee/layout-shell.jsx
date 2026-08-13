/* global React, window */
/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// layout-shell.jsx
//
// Stand-in for the real repo's layout (`app/layout.tsx` + `Header` + `Slidebar`).
// In the actual Next.js app, the page component just exports the page body —
// the chrome is provided by the layout. This file recreates that chrome so the
// standalone preview shows the same context.
//
// Class strings mirror the repo's actual Header/Slidebar markup.
// ─────────────────────────────────────────────────────────────────────────────

const { useState: useStateL } = React;
const { Button, cn } = window;
const I = window.Icons;

// ── Logo (matches `app/_components/logo.tsx` visually) ──────────────────────
const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="w-[26px] h-[26px] bg-green-cfff29 rounded-t-full" />
    <span className="text-[22px] font-bold tracking-[-0.02em] font-karla">aisee</span>
  </div>
);

// ── Header (matches `app/_components/header.tsx`) ───────────────────────────
window.Header = function Header() {
  return (
    <header className="w-full h-[70px] fixed top-0 z-20 bg-white backdrop-blur-[2px] flex items-center justify-between transition-all duration-300 px-4 md:px-6 border-b border-primary/[0.05]">
      <Logo />
      <div className="flex items-center gap-4">
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

// ── Slidebar (matches `app/_components/slidebar.tsx`) ──────────────────────
// Uses the same active-state styling (`bg-yellow-ffe253`) the repo uses for
// the current route in the post-agent sidebar.
window.Slidebar = function Slidebar({ active = "engage", onNavigate }) {
  const [tab, setTab] = useStateL("post-agent");

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/>
        <rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>
      </svg>
    ) },
    { id: "calendar",  label: "Calendar",   icon: <I.Calendar className="w-[15px] h-[15px]" /> },
    { id: "channels",  label: "Channels",   icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4" fill="currentColor"/>
      </svg>
    ) },
    { id: "post-agent", label: "Post Agent", icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 3l2.5 6 6 .5-4.5 4 1.5 6.5L12 17l-5.5 3 1.5-6.5L3.5 9.5l6-.5z"/>
      </svg>
    ) },
    { id: "engage",    label: "Engage",     icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3.65517C2 2.74105 2.74105 2 3.65517 2H12.3448C13.259 2 14 2.74105 14 3.65517V9.86207C14 10.7762 13.259 11.5172 12.3448 11.5172H10.1724L8 14L5.82759 11.5172H3.65517C2.74105 11.5172 2 10.7762 2 9.86207V3.65517Z"/>
        <circle cx="5.5" cy="7.17" r="0.45" fill="currentColor"/>
        <circle cx="8"   cy="7.17" r="0.45" fill="currentColor"/>
        <circle cx="10.5" cy="7.17" r="0.45" fill="currentColor"/>
      </svg>
    ), badge: 5 },
    { id: "media",     label: "Media",      icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5-9 9"/>
      </svg>
    ) },
  ];

  return (
    <aside className="sticky top-[70px] z-auto w-[211px] h-[calc(100vh-70px)] bg-white py-4 px-2 border-r border-primary/[0.04] flex flex-col">
      {/* Tab switcher (Analysis / Post Agent) — matches repo's SlidingToggle */}
      <div className="w-full rounded-lg bg-primary/[0.02] h-[40px] p-1 flex">
        {["analysis", "post-agent"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 h-full text-sm font-medium font-karla transition-colors duration-300 rounded-lg cursor-pointer",
              tab === t ? "border border-primary/[0.04] bg-yellow-fff2b3 text-primary" : "text-primary/70 hover:text-primary"
            )}
          >
            {t === "analysis" ? "Analysis" : "Post Agent"}
          </button>
        ))}
      </div>

      <nav className="flex-1 mt-4 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className={cn(
                "flex items-center gap-1 h-10 px-2 text-primary text-base font-karla rounded-lg transition-colors duration-200 cursor-pointer",
                isActive ? "bg-yellow-ffe253 hover:bg-yellow-ffe253" : "hover:bg-yellow-fff2b3"
              )}
            >
              <span className="w-5 h-5 flex items-center justify-center">{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className={cn(
                  "ml-auto text-[10px] font-semibold h-4 min-w-4 px-1.5 rounded-full inline-flex items-center justify-center",
                  isActive ? "bg-primary text-yellow-ffe253" : "bg-red-ec5212 text-white"
                )}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Account card (matches `app/_components/account.tsx` compact state) */}
      <div className="rounded-lg border border-primary/[0.05] bg-gray-fafafa p-2.5 flex flex-col gap-2 text-[12px]">
        <div className="flex items-center gap-2">
          <div className="w-[26px] h-[26px] rounded-full bg-[#E1E1E1] inline-flex items-center justify-center text-[11px] font-semibold">G</div>
          <span className="font-medium">gina@aisee.ai</span>
        </div>
        <hr className="border-t border-dashed border-primary/[0.08]" />
        <div className="flex items-center justify-between">
          <span className="bg-yellow-ffe253 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full">Pro Plan</span>
          <span className="text-[11px] text-primary/60">◆ 8,773 credits</span>
        </div>
        <div className="h-1.5 rounded bg-primary/[0.05] overflow-hidden">
          <span className="block h-full rounded bg-green-cfff29" style={{ width: "62%" }} />
        </div>
      </div>
    </aside>
  );
};
