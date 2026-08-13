/* global React, ReactDOM, AppHeader, Sidebar, InitialConfig, SignalFeed */
const { useState, useEffect } = React;

function App() {
  // viewMode: 'config' on first run, 'main' after Start
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("engage:configured") ? "main" : "config";
  });

  const startTracking = () => {
    localStorage.setItem("engage:configured", "1");
    setViewMode("main");
  };

  const resetConfig = () => {
    localStorage.removeItem("engage:configured");
    setViewMode("config");
  };

  return (
    <div className="app">
      <div className="header"><AppHeader /></div>
      <div className="sidebar"><Sidebar active="engage" /></div>
      <main className="main">
        {viewMode === "config"
          ? <InitialConfig onStart={startTracking} />
          : <SignalFeed onResetConfig={resetConfig} />}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
