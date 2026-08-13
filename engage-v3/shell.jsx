/* global React, icons */

const AppHeader = () => (
  <header className="app-header">
    <div className="brand">
      <div className="brand-mark"></div>
      <span className="brand-wordmark">aisee</span>
    </div>
    <nav className="header-nav">
      <button>Dashboard</button>
      <button>Models</button>
      <button>Reports</button>
      <button className="active">Post Agent</button>
      <button>Media</button>
    </nav>
    <div className="header-right">
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

const Sidebar = ({ active = "engage" }) => {
  const items = [
    { id: "dashboard", label: "Dashboard", icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/>
        <rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>
      </svg>
    ) },
    { id: "calendar", label: "Calendar", icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>
      </svg>
    ) },
    { id: "channels", label: "Channels", icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4" fill="currentColor"/>
      </svg>
    ) },
    { id: "postagent", label: "Post Agent", icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 3l2.5 6 6 .5-4.5 4 1.5 6.5L12 17l-5.5 3 1.5-6.5L3.5 9.5l6-.5z"/>
      </svg>
    ) },
    { id: "engage", label: "Engage", icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3.65517C2 2.74105 2.74105 2 3.65517 2H12.3448C13.259 2 14 2.74105 14 3.65517V9.86207C14 10.7762 13.259 11.5172 12.3448 11.5172H10.1724L8 14L5.82759 11.5172H3.65517C2.74105 11.5172 2 10.7762 2 9.86207V3.65517Z"/>
        <circle cx="5.5" cy="7.17" r="0.45" fill="currentColor"/>
        <circle cx="8"   cy="7.17" r="0.45" fill="currentColor"/>
        <circle cx="10.5" cy="7.17" r="0.45" fill="currentColor"/>
      </svg>
    ), badge: 5 },
    { id: "media", label: "Media", icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5-9 9"/>
      </svg>
    ) },
  ];

  return (
    <aside className="app-sidebar">
      <div className="tab-toggle">
        <button>Analysis</button>
        <button className="on">Post Agent</button>
      </div>

      <div style={{height: 4}}></div>

      <nav className="nav-list">
        {items.map(it => (
          <button key={it.id} className={`nav-item ${it.id === active ? "active" : ""}`}>
            <span style={{display:"inline-flex"}}>{it.icon}</span>
            <span>{it.label}</span>
            {it.badge && <span className="new-dot">{it.badge}</span>}
          </button>
        ))}
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
