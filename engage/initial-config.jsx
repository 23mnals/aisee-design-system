/* global React, icons */
const { useState } = React;

// Page 01 — Initial Configuration
window.InitialConfig = function InitialConfig({ onStart }) {
  const [keywords, setKeywords] = useState([
  { id: "k1", text: "GEO optimization", checked: true, tag: null },
  { id: "k2", text: "AI search visibility", checked: true, tag: null },
  { id: "k3", text: "ChatGPT SEO", checked: false, tag: null },
  { id: "k4", text: "Perplexity marketing", checked: true, tag: null },
  { id: "k5", text: "generative search", checked: true, tag: null },
  { id: "k6", text: "AISEE", checked: true, tag: "brand" },
  { id: "k7", text: "Semrush AIa", checked: false, tag: "competitor" }]
  );
  const [newKw, setNewKw] = useState("");
  const [accounts, setAccounts] = useState([
  { id: "a1", handle: "@KorayGubur", role: "GEO expert", on: true },
  { id: "a2", handle: "@searchengineland", role: "SEO publication", on: true },
  { id: "a3", handle: "@aleyda", role: "International SEO", on: true }]
  );
  const [subs, setSubs] = useState([
  { id: "s1", name: "SEO", members: "1.2M", on: true },
  { id: "s2", name: "marketing", members: "890K", on: true },
  { id: "s3", name: "ChatGPT", members: "4.1M", on: true },
  { id: "s4", name: "SaaS", members: "320K", on: true },
  { id: "s5", name: "artificial", members: "960K", on: false },
  { id: "s6", name: "GrowthHacking", members: "270K", on: false }]
  );

  const kwActive = keywords.filter((k) => k.checked).length;
  const subActive = subs.filter((s) => s.on).length;
  const accActive = accounts.filter((a) => a.on).length;

  const toggleKw = (id) => setKeywords((arr) => arr.map((k) => k.id === id ? { ...k, checked: !k.checked } : k));
  const toggleSub = (id) => setSubs((arr) => arr.map((s) => s.id === id ? { ...s, on: !s.on } : s));
  const toggleAcc = (id) => setAccounts((arr) => arr.map((a) => a.id === id ? { ...a, on: !a.on } : a));
  const removeAcc = (id) => setAccounts((arr) => arr.filter((a) => a.id !== id));
  const addKw = (e) => {
    if (e.key === "Enter" && newKw.trim()) {
      setKeywords([...keywords, { id: "k" + Date.now(), text: newKw.trim(), checked: true, tag: null }]);
      setNewKw("");
    }
  };

  return (
    <div className="fade-in">
      {/* Lime banner for first-run config */}
      <div className="engage-banner config-banner" style={{ backgroundColor: "rgb(243, 231, 244)", borderWidth: "4px", borderStyle: "solid", color: "rgb(255, 255, 255)", borderRadius: "16px" }}>
        <div className="engage-banner-top">
          <div className="icon-bubble"><img src={window.__resources && window.__resources.engageIcon || "engage/engage-icon.svg"} alt="" /></div>
          <div className="titles">
            <h1>Engage — Initial Setup</h1>
            <div className="sub">Configure keywords and accounts. We'll scan X &amp; Reddit every 24 hours for relevant conversations.</div>
          </div>
          <div className="banner-stats">
            <div className="banner-stat">
              <span className="lbl">Keywords</span>
              <span className="num">{kwActive}</span>
            </div>
            <div className="banner-stat">
              <span className="lbl">Subreddits</span>
              <span className="num">{subActive}</span>
            </div>
            <div className="banner-stat">
              <span className="lbl">Accounts</span>
              <span className="num">{accActive}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="config-wrap" style={{ padding: "16px 24px 32px" }}>
        {/* Keywords */}
        <div className="cfg-card" style={{ padding: "16px" }}>
          <div className="cfg-head">
            <div className="ttl-block">
              <h3>Keywords</h3>
              <div className="sub">We'll continuously track these terms on X and Reddit.</div>
            </div>
            <span className="count-pill" style={{ backgroundColor: "rgb(230, 240, 205)", color: "rgb(89, 115, 0)" }}>{kwActive} active</span>
          </div>

          <div className="kw-list">
            {keywords.map((k) =>
            <div key={k.id} className="kw-row" onClick={() => toggleKw(k.id)}>
                <span className={`cb ${k.checked ? "checked" : ""}`} style={{ borderRadius: "6px", borderWidth: "1px" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m20 6-11 11-5-5" style={{ strokeWidth: "2px" }} /></svg>
                </span>
                <span className="name">{k.text}</span>
                {k.tag === "brand" && <span className="tag" style={{ background: "var(--primary-bg)" }}>Brand</span>}
                {k.tag === "competitor" && <span className="tag competitor">Competitor</span>}
              </div>
            )}
          </div>

          <div className="kw-input">
            <span style={{ color: "var(--faint)" }}>{icons.plus(14)}</span>
            <input
              placeholder="Add custom keyword, press Enter"
              value={newKw}
              onChange={(e) => setNewKw(e.target.value)}
              onKeyDown={addKw} />
            
            <span className="hint">Enter ⏎</span>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Tracked accounts */}
          <div className="cfg-card" style={{ padding: "16px" }}>
            <div className="cfg-head">
              <div className="ttl-block">
                <h3>Tracked Accounts</h3>
                <div className="sub">When these accounts post relevant content, push to feed.</div>
              </div>
              <button className="add-btn">{icons.plus(12)} Add</button>
            </div>
            <div>
              {accounts.map((a) =>
              <div key={a.id} className="acc-row">
                  <div className="av">{a.handle[1].toUpperCase()}</div>
                  <div className="body">
                    <div className="who">{a.handle}</div>
                    <div className="role">{a.role}</div>
                  </div>
                  <button className="x-btn" onClick={() => removeAcc(a.id)} aria-label="Remove">{icons.x(12)}</button>
                  <span className={`switch ${a.on ? "on" : ""}`} onClick={() => toggleAcc(a.id)}></span>
                </div>
              )}
            </div>
          </div>

          {/* Subreddits */}
          <div className="cfg-card" style={{ padding: "16px" }}>
            <div className="cfg-head">
              <div className="ttl-block">
                <h3>Reddit Subreddits</h3>
                <div className="sub">Monitor keyword-matching posts in these communities.</div>
              </div>
              <span className="count-pill alert" style={{ color: "rgb(89, 115, 0)", backgroundColor: "rgb(230, 240, 205)" }}>{subActive} active</span>
            </div>
            <div className="sub-grid">
              {subs.map((s) =>
              <div key={s.id} className={`sub-card ${s.on ? "on" : ""}`} onClick={() => toggleSub(s.id)}>
                  <span className={`cb ${s.on ? "checked" : ""}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m20 6-11 11-5-5" /></svg>
                  </span>
                  <span className="r-ico">r/</span>
                  <div className="info">
                    <div className="nm">{s.name}</div>
                    <div className="mem">{s.members} members</div>
                  </div>
                </div>
              )}
            </div>
            <button className="add-sub">{icons.plus(12)} Add subreddit</button>
          </div>
        </div>
      </div>

      <div className="config-foot">
        <div className="summary">
          <span className="ok">{icons.check(14)} Setup complete</span>
          <span>·</span>
          <span><b>{kwActive}</b> keywords</span>
          <span>·</span>
          <span><b>{subActive}</b> subreddits</span>
          <span>·</span>
          <span><b>{accActive}</b> accounts</span>
          <span>·</span>
          <span>scans every <b>24 hours</b></span>
        </div>
        <button className="start-btn" onClick={onStart}>
          {icons.rocket(16)} Start tracking posts
        </button>
      </div>
    </div>);

};