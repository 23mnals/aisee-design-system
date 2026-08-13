/* global React, ReactDOM, window */
/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// page.jsx → app/(pages)/engage/page.tsx
//
// Entry: switches between InitialConfig (first run) and SignalFeed (returning).
// Persists the "configured" flag in localStorage. In the real Next.js app this
// would also be a server-side check against the user's actual Engage config.
// ─────────────────────────────────────────────────────────────────────────────

const { useState: useStateApp } = React;
const { Header, Slidebar, InitialConfig, SignalFeed } = window;

window.EngagePage = function EngagePage() {
  const [viewMode, setViewMode] = useStateApp(() =>
    typeof localStorage !== "undefined" && localStorage.getItem("engage-aisee:configured") ? "main" : "config"
  );

  const startTracking = () => {
    localStorage.setItem("engage-aisee:configured", "1");
    setViewMode("main");
  };
  const resetConfig = () => {
    localStorage.removeItem("engage-aisee:configured");
    setViewMode("config");
  };

  return (
    <>
      <Header />
      <main className="w-full min-h-screen flex flex-row bg-gray-fafafa pt-[70px]">
        <Slidebar active="engage" />
        <div className="flex-1 min-w-0 overflow-y-auto h-[calc(100vh-70px)]">
          {viewMode === "config"
            ? <InitialConfig onStart={startTracking} />
            : <SignalFeed onResetConfig={resetConfig} />}
        </div>
      </main>
    </>
  );
};

// Mount
const rootEl = document.getElementById("root");
if (rootEl) ReactDOM.createRoot(rootEl).render(<window.EngagePage />);
