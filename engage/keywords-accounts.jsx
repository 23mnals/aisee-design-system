/* global React, icons, PlatformX, PlatformR */
const { useState: useStateKA, useEffect: useEffectKA, useRef: useRefKA } = React;

// ─── Modal: Add tracked account ───────────────────────────────
function AddAccountModal({ open, onClose, onAdd }) {
  const [handle, setHandle] = useStateKA("");
  const [phase, setPhase] = useStateKA("idle"); // idle | verifying | verified | error
  const [verified, setVerified] = useStateKA(null);
  const [keywords, setKeywords] = useStateKA(new Set(["GEO"]));
  const [tracking, setTracking] = useStateKA(true);
  const inputRef = useRefKA(null);

  const KEYWORD_OPTIONS = ["GEO", "SEO media", "Technical SEO", "Growth", "AI search"];

  useEffectKA(() => {
    if (open) {
      setHandle("");
      setPhase("idle");
      setVerified(null);
      setKeywords(new Set(["GEO"]));
      setTracking(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffectKA(() => {
    const esc = (e) => {if (e.key === "Escape" && open) onClose();};
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [open, onClose]);

  if (!open) return null;

  const trimmed = handle.trim().replace(/^@/, "");
  const canVerify = trimmed.length >= 2 && phase !== "verifying";

  const runVerify = () => {
    if (!canVerify) return;
    setPhase("verifying");
    setVerified(null);
    setTimeout(() => {
      // Success simulation
      const display = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).replace(/_/g, " ");
      setVerified({
        handle: "@" + trimmed,
        name: display,
        initial: trimmed.charAt(0).toUpperCase(),
        followers: "39K",
        postsPerWeek: 16,
      });
      setPhase("verified");
    }, 1100);
  };

  const toggleKw = (k) => {
    const next = new Set(keywords);
    next.has(k) ? next.delete(k) : next.add(k);
    setKeywords(next);
  };

  const submit = () => {
    if (phase !== "verified") return;
    onAdd({
      id: "a" + Date.now(),
      handle: verified.handle,
      role: [...keywords].join(", ") || "Tracked",
      on: tracking,
      initial: verified.initial,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => {if (e.target === e.currentTarget) onClose();}}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-head">
          <h2>Add a tracked account</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">{icons.x(16)}</button>
        </div>

        <div className="modal-body">
          <div className="modal-field">
            <label className="modal-field-label">X handle</label>
            <div className="modal-handle-row">
              <div className="modal-handle-input">
                <span className="pfx">@</span>
                <input
                  ref={inputRef}
                  placeholder="seo-practitioner"
                  value={handle}
                  onChange={(e) => {setHandle(e.target.value); setPhase("idle"); setVerified(null);}}
                  onKeyDown={(e) => {if (e.key === "Enter") runVerify();}}
                />
              </div>
              <button className="modal-verify" onClick={runVerify} disabled={!canVerify}>
                Verify
              </button>
            </div>
          </div>

          {phase === "verifying" &&
            <div className="vr-loading">
              <span className="vr-spinner"></span>
              Verifying @{trimmed} on X…
            </div>
          }

          {phase === "verified" && verified &&
            <>
              <div className="vr-success">
                <div className="vr-row">
                  <div className="vr-avatar">{verified.initial}</div>
                  <div className="vr-body">
                    <div className="vr-name">
                      {verified.name} <span className="vr-verified-ico">{icons.check(11)}</span>
                    </div>
                    <div className="vr-handle">{verified.handle} · X</div>
                  </div>
                  <span className="vr-ok">{icons.check(13)}</span>
                </div>
                <div className="vr-stats">
                  <span><b>{verified.followers}</b> followers</span>
                  <span className="dot">·</span>
                  <span>~<b>{verified.postsPerWeek}</b> posts / week</span>
                  <span className="dot">·</span>
                  <span>Public account</span>
                </div>
              </div>

              <div className="modal-field">
                <label className="modal-field-label">Keyword</label>
                <div className="modal-chips">
                  {KEYWORD_OPTIONS.map((k) =>
                    <button
                      key={k}
                      className={`modal-chip ${keywords.has(k) ? "on" : ""}`}
                      onClick={() => toggleKw(k)}>
                      {k}
                    </button>
                  )}
                  <button className="modal-chip custom">+ Custom</button>
                </div>
              </div>

              <div className="modal-toggle-row">
                <span className="mtr-icon">{icons.bolt(16)}</span>
                <div className="mtr-body">
                  <div className="mtr-ttl">Start tracking on add</div>
                  <div className="mtr-desc">New posts push to Signal Feed, checked every 3 hours.</div>
                </div>
                <span
                  className={`switch-lg ${tracking ? "on" : ""}`}
                  onClick={() => setTracking(!tracking)}
                  role="switch"
                  aria-checked={tracking}>
                </span>
              </div>
            </>
          }
        </div>

        <div className="modal-foot">
          <button className="modal-cancel" onClick={onClose}>Cancel</button>
          <button
            className="modal-submit"
            onClick={submit}
            disabled={phase !== "verified"}>
            {icons.plus(13)} Add account
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal: Add subreddit ─────────────────────────────────────
function AddSubredditModal({ open, onClose, onAdd }) {
  const [name, setName] = useStateKA("");
  const [phase, setPhase] = useStateKA("idle");
  const [found, setFound] = useStateKA(null);
  const [monitoring, setMonitoring] = useStateKA(true);
  const inputRef = useRefKA(null);

  useEffectKA(() => {
    if (open) {
      setName("");
      setPhase("idle");
      setFound(null);
      setMonitoring(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffectKA(() => {
    const esc = (e) => {if (e.key === "Escape" && open) onClose();};
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [open, onClose]);

  if (!open) return null;

  const trimmed = name.trim().replace(/^@/, "").replace(/^r\//, "");
  const canFind = trimmed.length >= 2 && phase !== "verifying";

  const runFind = () => {
    if (!canFind) return;
    setPhase("verifying");
    setFound(null);
    setTimeout(() => {
      setFound({
        name: "r/" + trimmed + "geo",
        members: "1.1M",
        postsPerDay: 28,
        type: "Reddit community",
      });
      setPhase("verified");
    }, 1100);
  };

  const submit = () => {
    if (phase !== "verified") return;
    onAdd({
      id: "s" + Date.now(),
      name: found.name.replace(/^r\//, ""),
      members: found.members,
      on: monitoring,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => {if (e.target === e.currentTarget) onClose();}}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-head">
          <h2>Add a subreddit</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">{icons.x(16)}</button>
        </div>

        <div className="modal-body">
          <div className="modal-field">
            <label className="modal-field-label">Subreddit</label>
            <div className="modal-handle-row">
              <div className="modal-handle-input">
                <span className="pfx">@</span>
                <input
                  ref={inputRef}
                  placeholder="growthhacking"
                  value={name}
                  onChange={(e) => {setName(e.target.value); setPhase("idle"); setFound(null);}}
                  onKeyDown={(e) => {if (e.key === "Enter") runFind();}}
                />
              </div>
              <button className="modal-verify" onClick={runFind} disabled={!canFind}>
                Find
              </button>
            </div>
          </div>

          {phase === "verifying" &&
            <div className="vr-loading">
              <span className="vr-spinner"></span>
              Looking up r/{trimmed} on Reddit…
            </div>
          }

          {phase === "verified" && found &&
            <>
              <div className="vr-success">
                <div className="vr-row">
                  <div className="vr-avatar reddit"><PlatformR /></div>
                  <div className="vr-body">
                    <div className="vr-name">
                      {found.name} <span className="vr-verified-ico">{icons.check(11)}</span>
                    </div>
                    <div className="vr-handle">{found.members} members · {found.type}</div>
                  </div>
                  <span className="vr-ok">{icons.check(13)}</span>
                </div>
                <div className="vr-stats">
                  <span><b>{found.postsPerDay}</b> posts / day</span>
                  <span className="dot">·</span>
                  <span style={{ color: "#5BA300", fontWeight: 600 }}>Active community</span>
                  <span className="dot">·</span>
                  <span>Public</span>
                </div>
              </div>

              <div className="modal-toggle-row">
                <span className="mtr-icon">{icons.bolt(16)}</span>
                <div className="mtr-body">
                  <div className="mtr-ttl">Start monitoring on add</div>
                  <div className="mtr-desc">New matching threads push to Signal Feed.</div>
                </div>
                <span
                  className={`switch-lg ${monitoring ? "on" : ""}`}
                  onClick={() => setMonitoring(!monitoring)}
                  role="switch"
                  aria-checked={monitoring}>
                </span>
              </div>
            </>
          }
        </div>

        <div className="modal-foot">
          <button className="modal-cancel" onClick={onClose}>Cancel</button>
          <button
            className="modal-submit"
            onClick={submit}
            disabled={phase !== "verified"}>
            {icons.plus(13)} Add subreddit
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Seed data ────────────────────────────────────────────────
const SEED_KEYWORDS = [
  { id: "k1", text: "GEO optimization",     type: "core",       on: true,  weekN: 234, posts: 2 },
  { id: "k2", text: "AI search visibility", type: "core",       on: true,  weekN: 189, posts: 2 },
  { id: "k3", text: "ChatGPT SEO",          type: "core",       on: true,  weekN: 445, posts: 1 },
  { id: "k4", text: "Perplexity marketing", type: "core",       on: true,  weekN: 123, posts: 0 },
  { id: "k5", text: "generative search",    type: "core",       on: true,  weekN: 567, posts: 0 },
  { id: "k6", text: "AISEE",                type: "brand",      on: true,  weekN: 12,  posts: 0 },
  { id: "k7", text: "Semrush AI",           type: "competitor", on: false, weekN: 89,  posts: 0 },
];

const SEED_X_ACCOUNTS = [
  { id: "a1", handle: "@KorayGubur",     role: "GEO expert",        on: true,  initial: "K" },
  { id: "a2", handle: "@searchengineland", role: "SEO publication", on: true,  initial: "S" },
  { id: "a3", handle: "@aleyda",          role: "International SEO", on: true,  initial: "A" },
];

const SEED_SUBREDDITS = [
  { id: "s1", name: "SEO",            members: "1.2M",  on: true  },
  { id: "s2", name: "marketing",      members: "890K",  on: true  },
  { id: "s3", name: "ChatGPT",        members: "4.1M",  on: true  },
  { id: "s4", name: "SaaS",           members: "320K",  on: true  },
  { id: "s5", name: "artificial",     members: "960K",  on: false },
  { id: "s6", name: "GrowthHacking",  members: "270K",  on: false },
];

// Max weekly count, for sizing progress bars
const MAX_WEEK = 600;

function typeLabel(t) {
  return { core: "Core", brand: "Brand", competitor: "Competitor" }[t] || "Core";
}
function progressClass(t) {
  return { brand: "brand", competitor: "competitor" }[t] || "";
}

// ─── Workflow stepper ─────────────────────────────────────────
function Stepper({ active }) {
  const steps = [
    { n: 1, label: "Keywords" },
    { n: 2, label: "X accounts" },
    { n: 3, label: "Reddit subs" },
  ];
  return (
    <div className="kwa-flow">
      {steps.map((s, i) => (
        <React.Fragment key={s.n}>
          <span className={`step ${active === s.n ? "" : "muted"}`}>
            <span className="n">{s.n}</span>
            {s.label}
          </span>
          {i < steps.length - 1 && <span className="arrow">→</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Keyword Row ──────────────────────────────────────────────
function KeywordRow({ kw, onToggle, onView }) {
  const pct = Math.min(100, Math.round((kw.weekN / MAX_WEEK) * 100));
  return (
    <div className="kw-row-2">
      <div className="kw-info">
        <div className="kw-title-row">
          <span className="kw-name">{kw.text}</span>
          <span className={`tag type-${kw.type}`}>{typeLabel(kw.type)}</span>
        </div>
        <div className="kw-meta-row">
          <div className={`kw-progress-2 ${progressClass(kw.type)}`}>
            <span style={{ width: `${pct}%` }}></span>
          </div>
          <span className="kw-count-2"><b>{kw.weekN}</b> this week</span>
          {kw.posts > 0 && (
            <button className="kw-posts-link" onClick={onView}>
              {kw.posts} {kw.posts === 1 ? "post" : "posts"} {icons.chevronDown(10)}
            </button>
          )}
        </div>
      </div>
      <div></div>
      <span
        className={`switch-lg ${kw.on ? "on" : ""}`}
        onClick={() => onToggle(kw.id)}
        role="switch"
        aria-checked={kw.on}
      ></span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────
window.KeywordsAccounts = function KeywordsAccounts() {
  const [keywords, setKeywords] = useStateKA(SEED_KEYWORDS);
  const [accounts, setAccounts] = useStateKA(SEED_X_ACCOUNTS);
  const [subs, setSubs]         = useStateKA(SEED_SUBREDDITS);
  const [newKw, setNewKw]       = useStateKA("");
  const [autoReply, setAutoReply] = useStateKA(false);
  const [addAccountOpen, setAddAccountOpen] = useStateKA(false);
  const [addSubOpen, setAddSubOpen] = useStateKA(false);
  const [freshId, setFreshId] = useStateKA(null);

  const kwActive  = keywords.filter(k => k.on).length;
  const accActive = accounts.filter(a => a.on).length;
  const subActive = subs.filter(s => s.on).length;

  const toggleKw  = id => setKeywords(arr => arr.map(k => k.id === id ? { ...k, on: !k.on } : k));
  const toggleAcc = id => setAccounts(arr => arr.map(a => a.id === id ? { ...a, on: !a.on } : a));
  const toggleSub = id => setSubs(arr => arr.map(s => s.id === id ? { ...s, on: !s.on } : s));
  const removeAcc = id => setAccounts(arr => arr.filter(a => a.id !== id));

  const addKw = e => {
    if (e.key === "Enter" && newKw.trim()) {
      setKeywords([
        ...keywords,
        { id: "k" + Date.now(), text: newKw.trim(), type: "core", on: true, weekN: 0, posts: 0 },
      ]);
      setNewKw("");
    }
  };

  return (
    <div className="kwa-wrap fade-in">

      {/* Top-level: X auto-reply */}
      <div className="kwa-toplevel">
        <div className="body">
          <div className="ttl">
            <span style={{ display: "inline-flex" }}><PlatformX size={13} /></span>
            X Auto-reply
            <span className={`status-pill ${autoReply ? "on" : ""}`}>{autoReply ? "On" : "Off"}</span>
          </div>
          <div className="desc">
            {autoReply
              ? "Auto-reply is active. Configure accounts and quiet hours below."
              : "Turn on to let Engage reply automatically using your selected accounts."}
          </div>
        </div>
        <span
          className={`switch-lg ${autoReply ? "on" : ""}`}
          onClick={() => setAutoReply(!autoReply)}
          role="switch"
          aria-checked={autoReply}
        ></span>
      </div>

      {/* Workflow hint */}
      <Stepper active={1} />

      {/* ── 1. Keywords ─────────────────────────────────────── */}
      <div className="kwa-card">
        <div className="kwa-head">
          <div className="ttl-block">
            <h3>
              <span className="kwa-step-pill"><span className="num">1</span>Pick first</span>
              Keywords
            </h3>
            <div className="sub">
              Scans <b>X</b> + <b>Reddit</b> every 24 hours · <b>{kwActive}</b> active · matches feed into Signal Feed
            </div>
          </div>
          <button className="kwa-add-btn">{icons.plus(13)} Add</button>
        </div>

        <div className="kw-list-2">
          {keywords.map(kw => (
            <KeywordRow
              key={kw.id}
              kw={kw}
              onToggle={toggleKw}
              onView={() => {}}
            />
          ))}
        </div>

        <div className="kw-add-row">
          <span className="ico">{icons.plus(14)}</span>
          <input
            placeholder="Add a keyword, press Enter to confirm"
            value={newKw}
            onChange={e => setNewKw(e.target.value)}
            onKeyDown={addKw}
          />
          <span className="hint">Enter ⏎</span>
        </div>
      </div>

      {/* ── 2. X Priority Accounts ──────────────────────────── */}
      <div className="kwa-card">
        <div className="kwa-head">
          <div className="ttl-block">
            <h3>
              <span className="kwa-step-pill"><span className="num">2</span>X config</span>
              Priority Accounts
            </h3>
            <div className="sub">
              When these accounts post, push to Signal Feed regardless of keyword match · <b>{accActive}</b> tracked
            </div>
          </div>
          <button className="kwa-add-btn" onClick={() => setAddAccountOpen(true)}>{icons.plus(13)} Add account</button>
        </div>

        <div className="acc-list-2">
          {accounts.map(a => (
            <div key={a.id} className={`acc-row-2 ${freshId === a.id ? "fresh-flash" : ""}`}>
              <div className="av-2">{a.initial}</div>
              <div className="body">
                <div className="who">
                  {a.handle}
                  <span className="platform-chip"><PlatformX size={9} /></span>
                </div>
                <div className="role">{a.role}</div>
              </div>
              <div className="controls">
                <span
                  className={`switch-lg ${a.on ? "on" : ""}`}
                  onClick={() => toggleAcc(a.id)}
                  role="switch"
                  aria-checked={a.on}
                ></span>
                <button className="x-remove" onClick={() => removeAcc(a.id)} aria-label="Remove">
                  {icons.x(14)}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. Reddit Subreddits ────────────────────────────── */}
      <div className="kwa-card">
        <div className="kwa-head">
          <div className="ttl-block">
            <h3>
              <span className="kwa-step-pill"><span className="num">3</span>Reddit config</span>
              Subreddits
            </h3>
            <div className="sub">
              Monitor keyword-matching posts in these communities · <b>{subActive}</b> active
            </div>
          </div>
          <button className="kwa-add-btn ghost" onClick={() => setAddSubOpen(true)}>{icons.plus(13)} Add subreddit</button>
        </div>

        <div className="sub-grid-2">
          {subs.map(s => (
            <div
              key={s.id}
              className={`sub-card-2 ${s.on ? "on" : ""} ${freshId === s.id ? "fresh-flash" : ""}`}
              onClick={() => toggleSub(s.id)}>
              <span className="r-ico-2"><PlatformR /></span>
              <div className="info-2">
                <div className="nm-2">{s.name}</div>
                <div className="mem-2">{s.members} members</div>
              </div>
              <span
                className={`switch-lg ${s.on ? "on" : ""}`}
                onClick={e => { e.stopPropagation(); toggleSub(s.id); }}
                role="switch"
                aria-checked={s.on}
              ></span>
            </div>
          ))}
        </div>
      </div>

      <AddAccountModal
        open={addAccountOpen}
        onClose={() => setAddAccountOpen(false)}
        onAdd={(acc) => {
          setAccounts([acc, ...accounts]);
          setFreshId(acc.id);
          setTimeout(() => setFreshId(null), 2000);
        }}
      />
      <AddSubredditModal
        open={addSubOpen}
        onClose={() => setAddSubOpen(false)}
        onAdd={(sub) => {
          setSubs([sub, ...subs]);
          setFreshId(sub.id);
          setTimeout(() => setFreshId(null), 2000);
        }}
      />

    </div>
  );
};
