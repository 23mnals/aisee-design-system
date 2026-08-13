/* global React, ReactDOM, window */
/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// page.jsx (v5 — top-level Engage routing across 4 sub-pages)
//
// Sidebar drives which Engage sub-page is shown:
//   dashboard / signal / keywords / replies
//
// All four share the EngageBanner at the top. If not yet configured, the
// InitialConfig flow takes over the whole content area.
// ─────────────────────────────────────────────────────────────────────────────

const { useState: useStateApp, useEffect: useEffectApp } = React;
const {
  Header, Slidebar, EngageBanner,
  InitialConfig, EngageDashboard, SignalFeed, KeywordsAccounts, EngageReplies,
} = window;

const LS_TAB    = "engage-aisee-v2:tab";
const LS_CONFIG = "engage-aisee-v2:configured";

// URL-param overrides — used by the Plugin Entry Options comparison canvas
// so each iframe can land on a specific view + show a specific plugin entry
// without polluting localStorage or showing the demo Reset button.
const _qp = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
const PLUGIN_OPT = _qp.get("plugin") || "none";          // sidebar | header | banner | none
const VIEW_OVERRIDE = _qp.get("view") || null;            // dashboard | signal | keywords | replies
const IFRAME_MODE = PLUGIN_OPT !== "none" || !!VIEW_OVERRIDE;
window.PLUGIN_OPT = PLUGIN_OPT;

window.EngagePage = function EngagePage() {
  const [viewMode, setViewMode] = useStateApp(() => {
    if (IFRAME_MODE) return "main"; // skip the InitialConfig flow when previewed in the comparison canvas
    return typeof localStorage !== "undefined" && localStorage.getItem(LS_CONFIG) ? "main" : "config";
  });
  const [tab, setTab] = useStateApp(() => {
    if (VIEW_OVERRIDE) return VIEW_OVERRIDE;
    return typeof localStorage !== "undefined" && localStorage.getItem(LS_TAB) || "dashboard";
  });

  useEffectApp(() => {
    if (IFRAME_MODE) return; // don't persist iframe-scoped state
    if (typeof localStorage !== "undefined") localStorage.setItem(LS_TAB, tab);
  }, [tab]);

  const startTracking = () => {
    localStorage.setItem(LS_CONFIG, "1");
    setViewMode("main");
    setTab("dashboard");
  };
  const resetConfig = () => {
    localStorage.removeItem(LS_CONFIG);
    setViewMode("config");
  };

  // Banner stats shared across the 4 sub-pages
  const sharedStats = [
    { label: "New",      value: "2" },
    { label: "Keywords", value: 5   },
    { label: "X accounts", value: 3 },
    { label: "subreddit", value: 2  },
    { label: "Sent",     value: 5   },
  ];

  let content;
  if (viewMode === "config") {
    content = <InitialConfig onStart={startTracking} />;
  } else {
    content = (
      <>
        {/* Engage Banner — lavender #F3E7F4 (v5) shared across all 4 sub-pages */}
        <EngageBanner
          title="Engage"
          subtitle="Monitor and reply to relevant conversations across X and Reddit."
          stats={sharedStats}
        />
        {tab === "dashboard" && <EngageDashboard />}
        {tab === "signal"    && <SignalFeed onResetConfig={resetConfig} />}
        {tab === "keywords"  && <KeywordsAccounts />}
        {tab === "replies"   && <EngageReplies />}
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="w-full min-h-screen flex flex-row bg-gray-fafafa pt-[70px]">
        <Slidebar active={tab} onNavigate={setTab} />
        <div className="flex-1 min-w-0 overflow-y-auto h-[calc(100vh-70px)] relative">
          {content}
          {/* Demo reset shown bottom-right */}
          {viewMode === "main" && !IFRAME_MODE && (
            <button
              onClick={resetConfig}
              className="fixed right-4 bottom-4 z-[100] text-[11px] bg-primary text-white px-2.5 py-1.5 rounded-full opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            >
              ↺ Reset to initial setup (demo)
            </button>
          )}
        </div>
      </main>
    </>
  );
};

const rootEl = document.getElementById("root");
if (rootEl) ReactDOM.createRoot(rootEl).render(<window.EngagePage />);
