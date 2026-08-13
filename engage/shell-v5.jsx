/* global React, icons */
// shell-v5.jsx — current aisee Engage shell (function-based sidebar).
// Mirrors engage-aisee-v2/layout-shell.jsx (window.Slidebar) using the
// engage/styles.css class system + the v5-* classes defined on the page.

const AppHeader = () => (
  <header className="app-header">
    <div className="brand">
      <div className="brand-mark"></div>
      <span className="brand-wordmark">aisee</span>
    </div>
    <div className="header-right">
      <button className="icon-btn" aria-label="Install browser extension">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19.4 7.85c-.05.32.06.65.29.88l1.57 1.57c.47.47.7 1.09.7 1.7s-.23 1.23-.7 1.7l-1.61 1.61a.98.98 0 0 1-.84.28c-.47-.07-.8-.48-.97-.93a2.5 2.5 0 1 0-3.21 3.22c.45.16.85.5.92.97a.98.98 0 0 1-.27.84l-1.61 1.61c-.47.47-1.09.7-1.7.7s-1.24-.23-1.71-.7l-1.57-1.57a1.03 1.03 0 0 0-.88-.29c-.49.07-.84.5-1.02.97a2.5 2.5 0 1 1-3.24-3.24c.46-.18.9-.53.97-1.02a1.03 1.03 0 0 0-.29-.88l-1.57-1.57A2.4 2.4 0 0 1 2 12c0-.62.24-1.23.7-1.7l1.53-1.53c.24-.24.58-.35.92-.3.51.08.87.53 1.07 1.01a2.5 2.5 0 1 0 3.26-3.26c-.48-.2-.93-.56-1.01-1.07-.05-.34.06-.68.3-.92l1.53-1.53c.47-.47 1.08-.7 1.7-.7s1.23.24 1.7.7l1.57 1.57c.23.23.56.34.88.29.49-.07.84-.5 1.02-.97a2.5 2.5 0 1 1 3.24 3.24c-.46.18-.9.53-.97 1.02Z"/>
        </svg>
        <span className="dot" style={{background:"var(--green)"}}></span>
      </button>
      <button className="icon-btn" aria-label="Notifications">
        {icons.bell(16)}
        <span className="dot"></span>
      </button>
      <button className="cta-pill">
        {icons.plus(14)}
        <span>New</span>
      </button>
      <div className="avatar">G</div>
    </div>
  </header>
);

// ── Top-tab glyphs ──────────────────────────────────────────────
const ic = {
  analysis: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5 14 14"/>
    </svg>
  ),
  postagent: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="2.5" width="11" height="11" rx="1.6"/><path d="M5.5 6.5h5M5.5 9h3"/>
    </svg>
  ),
  engage: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3.66C2 2.74 2.74 2 3.66 2H12.34C13.26 2 14 2.74 14 3.66V9.86C14 10.78 13.26 11.52 12.34 11.52H10.17L8 14L5.83 11.52H3.66C2.74 11.52 2 10.78 2 9.86V3.66Z"/>
      <circle cx="5.5" cy="7.17" r="0.45" fill="currentColor"/><circle cx="8" cy="7.17" r="0.45" fill="currentColor"/><circle cx="10.5" cy="7.17" r="0.45" fill="currentColor"/>
    </svg>
  ),
};

// ── Sub-item icons ──────────────────────────────────────────────
const subIc = {
  dashboard: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/>
      <rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>
    </svg>
  ),
  signal: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M4 12h2M9 8v8M14 5v14M19 9v6"/>
    </svg>
  ),
  keywords: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h12"/>
    </svg>
  ),
  replies: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 19-9-9 19-2-8-8-2z"/>
    </svg>
  ),
};

const ITEMS_BY_TAB = {
  analysis:  [{ id: "overview", label: "Overview" }, { id: "score", label: "Score" }, { id: "report", label: "Full Report" }],
  postagent: [{ id: "calendar", label: "Calendar" }, { id: "channels", label: "Channels" }, { id: "models", label: "Models" }, { id: "media", label: "Media" }],
  engage:    [
    { id: "dashboard", label: "Dashboard", icon: subIc.dashboard },
    { id: "signal",    label: "Signal Feed", icon: subIc.signal },
    { id: "keywords",  label: "Keywords & Accounts", icon: subIc.keywords },
    { id: "replies",   label: "Replies", icon: subIc.replies, dot: true },
  ],
};

const Sidebar = ({ active = "replies" }) => {
  const [tab, setTab] = React.useState("engage");
  const tabs = [
    { id: "analysis", label: "Analysis", icon: ic.analysis },
    { id: "postagent", label: "Post Agent", icon: ic.postagent },
    { id: "engage", label: "Engage", icon: ic.engage },
  ];
  const items = ITEMS_BY_TAB[tab] || [];
  return (
    <aside className="app-sidebar">
      <div className="v5-toggle">
        {tabs.map((t) => (
          <button key={t.id} className={`v5-tab ${tab === t.id ? "on" : ""}`} onClick={() => setTab(t.id)}>
            <span className="v5-tab-ic">{t.icon}</span>
            {tab === t.id && <span className="v5-tab-lbl">{t.label}</span>}
          </button>
        ))}
      </div>

      <nav className="nav-list" style={{marginTop: 16, gap: 4}}>
        {items.map((it) => {
          const isActive = tab === "engage" && it.id === active;
          return (
            <button key={it.id} className={`nav-item ${isActive ? "active" : ""}`} style={{height: 32}}>
              {it.icon
                ? <span style={{display:"inline-flex", width:18, justifyContent:"center"}}>{it.icon}</span>
                : <span style={{width:18}}></span>}
              <span style={{flex:1, textAlign:"left"}}>{it.label}</span>
              {it.dot && <span className="v5-dot" title="New replies"></span>}
            </button>
          );
        })}
      </nav>

      <div className="profile-card">
        <div className="profile-row">
          <div className="avatar" style={{width:26, height:26, background:"#E1E1E1", fontSize:11}}>G</div>
          <span className="who" style={{fontSize:12}}>gina@aisee.ai</span>
        </div>
        <hr className="profile-divider" />
        <div className="profile-row" style={{justifyContent:"space-between"}}>
          <span className="plan-pill">Pro Plan</span>
          <span style={{fontSize:11, color:"var(--muted)"}}>◆ 8,773 credits</span>
        </div>
        <div className="credits-bar"><span style={{width: "62%"}}></span></div>
      </div>
    </aside>
  );
};

window.AppHeader = AppHeader;
window.Sidebar = Sidebar;
