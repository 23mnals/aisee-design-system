/* global React, ReactDOM, AppHeader, Sidebar, icons, PlatformX, PlatformR */
const { useState, useEffect, useRef, useCallback } = React;

// ─── Mock data ─────────────────────────────────────────────
const REPLIES_DAILY = [
  { d: "3/12", x:  3, r: 0 },
  { d: "3/13", x:  2, r: 1 },
  { d: "3/14", x:  4, r: 1 },
  { d: "3/15", x:  6, r: 2 },
  { d: "3/16", x:  5, r: 2 },
  { d: "3/17", x: 10, r: 3 }, // peak
  { d: "3/18", x:  4, r: 1 },
  { d: "3/19", x:  5, r: 2 },
  { d: "3/20", x:  6, r: 2 },
  { d: "3/21", x:  7, r: 3 },
  { d: "3/22", x:  6, r: 2 },
  { d: "3/23", x:  4, r: 1 },
];

// Daily impressions in thousands
const IMPRESSIONS_DAILY = [
  { d: "3/1",   v: 4.2 },
  { d: "3/3",   v: 5.8 },
  { d: "3/5",   v: 8.4 },
  { d: "3/7",   v: 12.1 },
  { d: "3/9",   v: 18.6 },
  { d: "3/11",  v: 22.4 },
  { d: "3/13",  v: 19.8 },
  { d: "3/15",  v: 16.2 },
  { d: "3/17",  v: 14.0 },
  { d: "3/19",  v: 20.7 },
  { d: "3/21",  v: 24.5 },
  { d: "3/23",  v: 22.0 },
  { d: "3/25",  v: 18.1 },
  { d: "3/27",  v: 19.4 },
  { d: "3/29",  v: 21.7 },
];

const QUEUE = [
  {
    id: "q1",
    platform: "x",
    user: { name: "Korayguebur", handle: "@koraygubur", avatar: "K" },
    source: "Anyone else seeing AI Overviews completely tank organic traffic for top-of-funnel queries? Our blog views are down 40% YoY…",
    draft: "We saw the same drop. What worked for us: shipping comparison pages that LLMs cite verbatim — happy to share the framework if useful.",
    time: "12m ago",
    trafficIdx: 712,
  },
  {
    id: "q2",
    platform: "reddit",
    user: { name: "u/Viktor_Oddy", handle: "r/SaaS", avatar: "V" },
    source: "How are you measuring ROI on AI visibility work? Feels like vibes-based marketing right now.",
    draft: "Track citation count per model (ChatGPT / Perplexity / Gemini) and tie each citation to a tracked keyword. Most teams skip the keyword tagging step…",
    time: "1h ago",
    trafficIdx: 540,
  },
  {
    id: "q3",
    platform: "x",
    user: { name: "Francesca Illing", handle: "@viaOxgina", avatar: "F" },
    source: "Hot take: GEO is just SEO with extra steps. Change my mind.",
    draft: "Half-agree — the on-page work overlaps. But the ranking signal is completely different: LLMs reward semantic depth + freshness, not backlinks.",
    time: "3h ago",
    trafficIdx: 425,
  },
];

const TOP_REPLIES = [
  { id:"t1", platform:"x",      who:"@viaOxgina",   snip:"This is one of the most common gaps we see — most brands score under 30…", impressions:"18.0K", likes:229 },
  { id:"t2", platform:"x",      who:"@HILY",         snip:"Three things that consistently move the needle on AI Presence: schema, comparison content…", impressions:"12.3K", likes:184 },
  { id:"t3", platform:"reddit", who:"u/Viktor_Oddy", snip:"Track citation count per model. Most teams skip the keyword tagging step.", impressions:"6.8K",  likes:142 },
];

// ─── Small building blocks ─────────────────────────────────
function Delta({ pct, dir = "up", vs = "vs prev 7d" }) {
  const isDown = dir === "down";
  return (
    <span className={`delta ${isDown ? "down" : ""}`}>
      <span className="arrow">
        {isDown ? icons.arrowUp(11) : icons.arrowUp(11)}
        {/* Flip arrow when down via CSS transform */}
        <style>{`.delta.down .arrow svg { transform: rotate(180deg); }`}</style>
      </span>
      {pct}%
      <span className="vs">{vs}</span>
    </span>
  );
}

function Kpi({ label, value, unit, delta, dir, accent, tip }) {
  return (
    <div className={`kpi ${accent ? "accent" : ""}`}>
      <div className="lbl">
        {label}
        {tip && <span title={tip} style={{color:"rgba(17,17,17,0.35)", display:"inline-flex"}}>{icons.info(12)}</span>}
      </div>
      <div className="num">
        {value}
        {unit && <span className="unit">{unit}</span>}
      </div>
      {delta != null && <Delta pct={delta} dir={dir} />}
    </div>
  );
}

// ─── Bar chart (Replies sent) ─────────────────────────────
function RepliesBarChart() {
  const [hoverIdx, setHoverIdx] = useState(5); // peak
  const max = 14;
  const data = REPLIES_DAILY;
  return (
    <div className="bars">
      {data.map((row, i) => {
        const total = row.x + row.r;
        const xH = (row.x / max) * 100;
        const rH = (row.r / max) * 100;
        const isPeak = i === hoverIdx;
        return (
          <div
            key={row.d}
            className={`bar-col ${total > 0 && row.r > 0 ? "has-both" : ""} ${isPeak ? "peak" : ""}`}
            onMouseEnter={() => setHoverIdx(i)}
          >
            <div className="bar">
              {row.r > 0 && <span className="bar-seg r" style={{ height: `${rH}%` }}></span>}
              {row.x > 0 && <span className="bar-seg x" style={{ height: `${xH}%` }}></span>}
            </div>
            {isPeak && (
              <div className="bar-tooltip">
                <div className="tt-day">{row.d.replace("3/", "Mar ")}</div>
                <div className="tt-row">
                  <span className="lbl"><span className="leg-dot x"><PlatformX size={6} /></span> X</span>
                  <span style={{fontWeight:600}}>{row.x}</span>
                </div>
                <div className="tt-row">
                  <span className="lbl"><span className="leg-dot r"><PlatformR size={6} /></span> Reddit</span>
                  <span style={{fontWeight:600}}>{row.r}</span>
                </div>
              </div>
            )}
            <span className="lbl">{row.d}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Area chart (Impressions) ─────────────────────────────
function ImpressionsAreaChart() {
  const W = 600, H = 180;
  const data = IMPRESSIONS_DAILY;
  const max = 28;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - (d.v / max) * H;
    return [x, y];
  });
  // Smooth via simple cardinal-ish path
  const pathD = pts.reduce((acc, [x, y], i) => {
    if (i === 0) return `M ${x} ${y}`;
    const [px, py] = pts[i - 1];
    const cx1 = px + (x - px) / 2;
    const cx2 = x - (x - px) / 2;
    return `${acc} C ${cx1} ${py} ${cx2} ${y} ${x} ${y}`;
  }, "");
  const areaD = `${pathD} L ${W} ${H} L 0 ${H} Z`;

  return (
    <div className="area-wrap">
      <div className="area-y">
        <span>28K</span>
        <span>21K</span>
        <span>14K</span>
        <span>7K</span>
        <span>0</span>
      </div>
      <div className="area-plot">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="impGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#FFE253" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#FFE253" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* gridlines */}
          {[0.25, 0.5, 0.75].map((p) => (
            <line key={p} x1="0" x2={W} y1={H * p} y2={H * p}
                  stroke="rgba(17,17,17,0.05)" strokeWidth="1" />
          ))}
          <path d={areaD} fill="url(#impGrad)" />
          <path d={pathD} fill="none" stroke="#111" strokeWidth="1.5" />
          {/* peak marker */}
          {(() => {
            const peakI = data.reduce((mx, d, i, arr) => d.v > arr[mx].v ? i : mx, 0);
            const [px, py] = pts[peakI];
            return (
              <g>
                <circle cx={px} cy={py} r="4" fill="#FFE253" stroke="#111" strokeWidth="1.5" />
                <line x1={px} x2={px} y1={py + 6} y2={H} stroke="rgba(17,17,17,0.3)" strokeDasharray="2 3" strokeWidth="1" />
              </g>
            );
          })()}
        </svg>
      </div>
      <div className="area-x">
        {data.filter((_, i) => i % 2 === 0).map((d) => <span key={d.d}>{d.d}</span>)}
      </div>
    </div>
  );
}

// ─── Queue (awaiting review) ──────────────────────────────
function QueueItem({ q, onSend, onSaveDraft, onDismiss }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(q.draft);
  const ref = useRef(null);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      const len = ref.current.value.length;
      ref.current.setSelectionRange(len, len);
    }
  }, [editing]);

  const startEdit = () => setEditing(true);
  const cancelEdit = () => { setDraft(q.draft); setEditing(false); };
  const saveEdit = () => { onSaveDraft(q.id, draft); setEditing(false); };

  return (
    <div className={`queue-item ${editing ? "editing" : ""}`}>
      <div className={`queue-av ${q.platform === "reddit" ? "r" : ""}`}>
        {q.user.avatar}
        <span className={`plat-mini ${q.platform === "reddit" ? "r" : ""}`}>
          {q.platform === "x" ? <PlatformX size={7} /> : <PlatformR size={7} />}
        </span>
      </div>
      <div className="queue-body">
        <div className="queue-head">
          <span className="who">{q.user.name}</span>
          <span className="handle">{q.user.handle}</span>
          <span className="dot"></span>
          <span className="time">{q.time}</span>
          <span className="dot"></span>
          <span className="handle">Traffic idx <strong style={{color:"#111", fontWeight:600}}>{q.trafficIdx}</strong></span>
        </div>
        <div className="queue-source">{q.source}</div>
        {!editing && (
          <div className="queue-draft" onClick={startEdit} title="Click to edit" style={{cursor:"text"}}>
            <strong style={{color:"#111", fontWeight:600}}>Your draft · </strong>
            {q.draft}
          </div>
        )}
        {editing && (
          <div className="queue-edit">
            <textarea
              ref={ref}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={280}
              onKeyDown={(e) => {
                if (e.key === "Escape") cancelEdit();
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) saveEdit();
              }}
            />
            <div className="queue-edit-foot">
              <span className="char">{draft.length} / 280</span>
              <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); onDismiss(q.id, "opened-in-feed"); }}>
                Open in Signal Feed {icons.ext(11)}
              </a>
              <span className="spacer"></span>
              <button className="queue-btn edit" onClick={cancelEdit}>Cancel</button>
              <button className="queue-btn send" onClick={saveEdit}>{icons.check(11)} Save draft</button>
            </div>
          </div>
        )}
      </div>
      {!editing && (
        <div className="queue-actions">
          <button className="queue-btn send" onClick={() => onSend(q)}>{icons.send(11)} Send</button>
          <button className="queue-btn edit" onClick={startEdit}>{icons.edit(11)} Edit</button>
        </div>
      )}
    </div>
  );
}

function QueueCard({ queue, onSend, onSaveDraft, onDismiss }) {
  return (
    <div className="card" style={{display:"flex", flexDirection:"column", minHeight: 0}}>
      <div className="card-h">
        <span className="ttl">Awaiting your review</span>
        <span style={{
          marginLeft: 6,
          fontSize: 11, fontWeight: 700,
          background: queue.length ? "#FFE253" : "rgba(17,17,17,0.06)",
          color: "#111",
          padding: "2px 8px", borderRadius: 999,
        }}>{queue.length}</span>
        <div className="right">
          <button style={{
            height: 26, padding: "0 10px", borderRadius: 6,
            fontSize: 11, fontWeight: 600, color: "var(--muted)",
            border: "1px solid var(--border)",
          }}>View all{" "}{icons.arrowR(11)}</button>
        </div>
      </div>
      <p style={{ fontSize: 12, color: "var(--muted)", margin: "2px 0 6px" }}>
        AI-drafted replies waiting for your approval before sending.
      </p>

      {queue.length === 0 ? (
        <div className="queue-empty">
          <div className="icon">{icons.check(18)}</div>
          <div className="ttl">You're all caught up</div>
          <div>New signals will appear here for review.</div>
        </div>
      ) : (
        <div className="queue-list">
          {queue.map((q) => (
            <QueueItem
              key={q.id}
              q={q}
              onSend={onSend}
              onSaveDraft={onSaveDraft}
              onDismiss={onDismiss}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Top performing replies ───────────────────────────────
function TopRepliesCard() {
  return (
    <div className="card">
      <div className="card-h">
        <span className="ttl">Top performing replies</span>
        <div className="right">
          <span style={{fontSize: 11, color: "var(--muted)"}}>By impressions · 30d</span>
        </div>
      </div>
      <div className="top-replies">
        {TOP_REPLIES.map((r, i) => (
          <div key={r.id} className="top-rep">
            <span className="rank">{i + 1}</span>
            <div className="body">
              <span className="who">
                <span className={`pi ${r.platform === "reddit" ? "r" : ""}`}>
                  {r.platform === "x" ? <PlatformX size={7} /> : <PlatformR size={7} />}
                </span>
                {r.who}
              </span>
              <span className="snip">"{r.snip}"</span>
            </div>
            <div className="stat">
              <span className="v">{r.impressions}</span>
              <span className="l">Impressions</span>
            </div>
          </div>
        ))}
      </div>
      <div className="hint">
        <strong>Pattern:</strong> Expert-answer replies on X out-perform meta-commentary by 3.2×. Lean into specifics — schema examples, score numbers, before/after.
      </div>
    </div>
  );
}

// ─── Platform mix (donut) ─────────────────────────────────
function PlatformMix() {
  const xPct = 84, rPct = 16; // out of 51 engagements
  const R = 56, C = 2 * Math.PI * R;
  return (
    <div className="card">
      <div className="card-h">
        <span className="ttl">Engagement by platform</span>
        <div className="right">
          <span style={{fontSize: 11, color: "var(--muted)"}}>Last 30d</span>
        </div>
      </div>
      <div className="mix-wrap">
        <div className="mix-donut">
          <svg viewBox="0 0 140 140">
            <circle cx="70" cy="70" r={R} fill="none" stroke="#F5F5F5" strokeWidth="18" />
            <circle cx="70" cy="70" r={R} fill="none" stroke="#FFE253" strokeWidth="18"
                    strokeDasharray={`${(C * xPct) / 100} ${C}`} strokeDashoffset="0" />
            <circle cx="70" cy="70" r={R} fill="none" stroke="#EC5212" strokeWidth="18"
                    strokeDasharray={`${(C * rPct) / 100} ${C}`}
                    strokeDashoffset={`-${(C * xPct) / 100}`} />
          </svg>
          <div className="center">
            <span className="v">51</span>
            <span className="l">Engagements</span>
          </div>
        </div>
        <div className="mix-legend">
          <div className="row">
            <span className="sw x"><PlatformX size={7} /></span>
            <span className="nm">X</span>
            <span className="pc">84%</span>
            <span className="ct">43</span>
          </div>
          <div className="row">
            <span className="sw r">r/</span>
            <span className="nm">Reddit</span>
            <span className="pc">16%</span>
            <span className="ct">8</span>
          </div>
        </div>
      </div>
      <div className="hint">
        <strong>Reddit is under-indexed.</strong> 2 subreddits tracked vs 3 X accounts — consider adding r/SaaS, r/marketing.
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────
function Toast({ t, onUndo, onClose }) {
  useEffect(() => {
    const id = setTimeout(onClose, 5000);
    return () => clearTimeout(id);
  }, [onClose]);
  return (
    <div className="toast success">
      <span className="icon">{icons.check(12)}</span>
      <div className="body">
        <div>{t.title}</div>
        {t.sub && <div className="sub">{t.sub}</div>}
      </div>
      {t.undo && <button className="undo" onClick={onUndo}>Undo</button>}
    </div>
  );
}

function DashboardPage() {
  const [range, setRange] = useState("week");
  const [plat, setPlat] = useState("all");
  const [queue, setQueue] = useState(QUEUE);
  const [toasts, setToasts] = useState([]);

  const pushToast = useCallback((t) => {
    const id = Date.now() + Math.random();
    setToasts((ts) => [...ts, { ...t, id }]);
    return id;
  }, []);
  const removeToast = useCallback((id) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
  }, []);

  const handleSend = (q) => {
    setQueue((arr) => arr.filter((x) => x.id !== q.id));
    const tid = pushToast({
      title: `Reply sent to ${q.user.handle}`,
      sub: q.platform === "x" ? "Posted on X" : "Posted on Reddit",
      undo: () => {
        setQueue((arr) => arr.some((x) => x.id === q.id) ? arr : [q, ...arr]);
        removeToast(tid);
      },
    });
  };

  const handleSaveDraft = (id, newDraft) => {
    setQueue((arr) => arr.map((x) => x.id === id ? { ...x, draft: newDraft } : x));
    pushToast({ title: "Draft saved", sub: "Will not auto-send until you click Send." });
  };

  const handleDismiss = (id, reason) => {
    setQueue((arr) => arr.filter((x) => x.id !== id));
    pushToast({
      title: reason === "opened-in-feed" ? "Opened in Signal Feed →" : "Reply dismissed",
      sub: reason === "opened-in-feed" ? "Continue editing there with full thread context." : null,
    });
  };

  return (
    <div className="dash-page">
      {/* Banner — collapse settings into a count and promote actionable */}
      <div className="dash-banner">
        <div className="ic">
          {/* Engage icon (msg bubble with dots) */}
          <svg width="26" height="26" viewBox="0 0 16 16" fill="none" stroke="#111" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3.65517C2 2.74105 2.74105 2 3.65517 2H12.3448C13.259 2 14 2.74105 14 3.65517V9.86207C14 10.7762 13.259 11.5172 12.3448 11.5172H10.1724L8 14L5.82759 11.5172H3.65517C2.74105 11.5172 2 10.7762 2 9.86207V3.65517Z" />
            <circle cx="5.5" cy="7.17" r="0.45" fill="#111" />
            <circle cx="8" cy="7.17" r="0.45" fill="#111" />
            <circle cx="10.5" cy="7.17" r="0.45" fill="#111" />
          </svg>
        </div>
        <div className="titles">
          <h1>Engage</h1>
          <div className="sub">Monitor and reply to relevant conversations across X and Reddit.</div>
        </div>
        <div className="b-stats">
          <div className="b-stat">
            <span className="lbl">New signals</span>
            <span className="num">12 <span className="pill-act">View feed</span></span>
          </div>
          <div className="b-stat">
            <span className="lbl">Awaiting review</span>
            <span className="num">{queue.length} {queue.length > 0 && <span className="pill-act">Review</span>}</span>
          </div>
          <div className="b-stat">
            <span className="lbl">Tracking</span>
            <span className="num" style={{fontSize:16, fontWeight:500, color:"var(--muted)"}}>
              5 keywords · 3 X · 2 r/
            </span>
          </div>
        </div>
      </div>

      {/* Engagement Performance header */}
      <div className="dash-h">
        <h2>Engagement Performance</h2>
        <span className="meta">Last 7 days</span>
        <div className="right">
          <div className="plat-toggle">
            <button className={plat === "all" ? "on" : ""} onClick={() => setPlat("all")}>All</button>
            <button className={plat === "x" ? "on" : ""} onClick={() => setPlat("x")}>
              <span className="dot"><PlatformX size={6} /></span> X
            </button>
            <button className={plat === "reddit" ? "on" : ""} onClick={() => setPlat("reddit")}>
              <span className="dot r"><PlatformR size={6} /></span> Reddit
            </button>
          </div>
          <div className="range-tabs">
            <button className={range === "today" ? "on" : ""} onClick={() => setRange("today")}>Today</button>
            <button className={range === "week" ? "on" : ""} onClick={() => setRange("week")}>7d</button>
            <button className={range === "month" ? "on" : ""} onClick={() => setRange("month")}>30d</button>
          </div>
        </div>
      </div>

      {/* KPI row — 4 cards (removed redundant Traffic index, removed misleading Response rate) */}
      <div className="kpi-row">
        <Kpi label="Replies sent" value="32" delta="22" dir="up" />
        <Kpi label="Impressions earned" value="42.7" unit="K" delta="18" dir="up" />
        <Kpi label="Likes earned" value="1,650" delta="34" dir="up" />
        <Kpi label="Avg engagement / reply" value="58.6" delta="9" dir="up" accent
             tip="Likes + retweets + comments, divided by replies sent. The single quality metric." />
      </div>

      {/* Trends row */}
      <div className="dash-h" style={{ marginTop: 20 }}>
        <h2>Trends</h2>
        <span className="meta">Volume and reach over time</span>
      </div>
      <div className="chart-row">
        <div className="card">
          <div className="card-h">
            <span className="ttl">Replies sent · daily</span>
            <div className="right">
              <span className="leg-dot x"><PlatformX size={7} /></span>
              <span style={{fontSize: 11, color: "var(--muted)"}}>X</span>
              <span className="leg-dot r" style={{marginLeft:6}}><PlatformR size={7} /></span>
              <span style={{fontSize: 11, color: "var(--muted)"}}>Reddit</span>
            </div>
          </div>
          <div className="big-num">62 <span className="delta">↑ 22% vs prev 7d</span></div>
          <RepliesBarChart />
        </div>

        <div className="card">
          <div className="card-h">
            <span className="ttl">Impressions earned · daily</span>
            <div className="right">
              <span style={{fontSize: 11, color: "var(--muted)"}}>Total reach across both platforms</span>
            </div>
          </div>
          <div className="big-num">218<span style={{fontWeight:500, fontSize:18, color:"var(--muted)"}}>K</span> <span className="delta">↑ 18% vs prev 30d</span></div>
          <ImpressionsAreaChart />
        </div>
      </div>

      {/* Bottom row — Queue (action), Top replies (insight), Platform mix */}
      <div className="dash-h" style={{ marginTop: 20 }}>
        <h2>Up next</h2>
        <span className="meta">Where to focus your attention</span>
      </div>
      <div className="bottom-row">
        <QueueCard
          queue={queue}
          onSend={handleSend}
          onSaveDraft={handleSaveDraft}
          onDismiss={handleDismiss}
        />
        <TopRepliesCard />
        <PlatformMix />
      </div>

      {/* Toast stack */}
      <div className="toast-stack">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            t={t}
            onUndo={() => { t.undo && t.undo(); }}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <div className="header"><AppHeader /></div>
      <div className="sidebar"><Sidebar active="dashboard" /></div>
      <main className="main">
        <DashboardPage />
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
