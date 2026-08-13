/* global React, ReactDOM, AppHeader, Sidebar, icons, PlatformX, PlatformR */
const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ─── Mock reply records (full lifecycle) ─────────────────
const ALL_REPLIES = [
  // Awaiting review — multi-draft
  {
    id: "r1", status: "awaiting", platform: "x",
    target: { name: "Korayguebur", handle: "@koraygubur", avatar: "K" },
    sourcePost: "Anyone else seeing AI Overviews completely tank organic traffic for top-of-funnel queries? Our blog views are down 40% YoY…",
    drafts: [
      { id: "d1a", angle: "Expert answer", text: "We saw the same drop. What worked for us: shipping comparison pages that LLMs cite verbatim — happy to share the framework if useful." },
      { id: "d1b", angle: "Data-backed",   text: "Our blog traffic dropped 38% over the same window. The pages that held up all had structured comparison tables — LLMs lift those almost verbatim." },
      { id: "d1c", angle: "Empathetic",    text: "This shift has been brutal. The teams I see weathering it best stopped chasing top-of-funnel volume and rebuilt around being the cited source instead." },
    ],
    keyword: "AI Overviews",
    trafficIdx: 712,
    generatedAt: "12m ago",
    linkState: "ready",
  },
  {
    id: "r2", status: "awaiting", platform: "reddit",
    target: { name: "u/Viktor_Oddy", handle: "r/SaaS", avatar: "V" },
    sourcePost: "How are you measuring ROI on AI visibility work? Feels like vibes-based marketing right now.",
    drafts: [
      { id: "d2a", angle: "Framework drop", text: "Track citation count per model (ChatGPT / Perplexity / Gemini) and tie each citation to a tracked keyword. Most teams skip the keyword tagging step…" },
      { id: "d2b", angle: "Counterpoint",   text: "It's only vibes if you don't tag. Set up keyword-level citation tracking per model, then ROI = (incremental citations × traffic per citation × conversion rate)." },
    ],
    keyword: "AI visibility",
    trafficIdx: 540,
    generatedAt: "1h ago",
    linkState: "ready",
  },
  {
    id: "r3", status: "awaiting", platform: "x",
    target: { name: "Francesca Illing", handle: "@viaOxgina", avatar: "F" },
    sourcePost: "Hot take: GEO is just SEO with extra steps. Change my mind.",
    drafts: [
      { id: "d3a", angle: "Counterpoint", text: "Half-agree — the on-page work overlaps. But the ranking signal is completely different: LLMs reward semantic depth + freshness, not backlinks." },
    ],
    keyword: "GEO",
    trafficIdx: 425,
    generatedAt: "3h ago",
    linkState: "ready",
  },

  // Sent (link submitted, has stats)
  {
    id: "r4", status: "sent", platform: "x",
    target: { name: "ccbakala", handle: "@viaOxgina", avatar: "C" },
    sourcePost: "Every major AI model in the world gives the same answer when you ask if it is conscious. I am just an AI. I do not have feelings or consciousness…",
    reply: "This is one of the most common gaps we see — most brands score under 30 on AI Presence even with solid content. Three things that consistently move the needle…",
    stats: { impressions: 18000, likes: 229, retweets: 43, replies: 66, bookmarks: 120 },
    keyword: "AI Presence", strategy: "Expert answer",
    trafficIdx: 630, authorReplied: true, sentAt: "16h ago", linkSubmitted: true,
  },
  {
    id: "r5", status: "sent", platform: "x",
    target: { name: "HILY", handle: "@HILY", avatar: "H" },
    sourcePost: "What's actually moving the needle on AI Overview citations in 2026? Most advice still feels like 2024 SEO repackaged.",
    reply: "Three things that consistently move the needle on AI Presence: schema, comparison content, and freshness signals — in that order of impact.",
    stats: { impressions: 12300, likes: 184, retweets: 28, replies: 41, bookmarks: 87 },
    keyword: "AI Overviews", strategy: "Framework drop",
    trafficIdx: 580, authorReplied: false, sentAt: "2d ago", linkSubmitted: true,
  },
  // Sent but link not yet submitted (data pending)
  {
    id: "r6", status: "sent", platform: "reddit",
    target: { name: "u/Viktor_Oddy", handle: "r/marketing", avatar: "V" },
    sourcePost: "Has anyone here actually moved the needle on Perplexity citations? Most case studies feel cherry-picked.",
    reply: "Track citation count per model. Most teams skip the keyword tagging step, then can't tell which content is actually doing the work.",
    keyword: "Perplexity", strategy: "Expert answer",
    trafficIdx: 510, sentAt: "3d ago", linkSubmitted: false,
  },

  // Dismissed
  {
    id: "r7", status: "dismissed", platform: "x",
    target: { name: "Random Bot", handle: "@cryptolaunch24", avatar: "R" },
    sourcePost: "GM frens, who's bullish on AI agents this cycle? Drop your $ ticker below",
    reply: "AI agent infra is real but the token plays are mostly noise. Look at usage metrics, not announcements.",
    keyword: "AI agents", dismissReason: "Off-topic — flagged as low-quality source",
    dismissedBy: "auto", dismissedAt: "5h ago", trafficIdx: 120,
  },
  {
    id: "r8", status: "dismissed", platform: "reddit",
    target: { name: "u/anon_2847", handle: "r/SEO", avatar: "A" },
    sourcePost: "AI is going to replace all of us in 2 years anyway lol",
    reply: "Not seeing this in our data. AI shifts which work gets valued — strategy, depth, and judgment go up; rote production goes down.",
    keyword: "AI", dismissReason: "Manual dismiss",
    dismissedBy: "you", dismissedAt: "1d ago", trafficIdx: 80,
  },

  // Failed
  {
    id: "r9", status: "failed", platform: "x",
    target: { name: "Sarah Chen", handle: "@sarahbuilds", avatar: "S" },
    sourcePost: "Looking for tools that track LLM citation share, not just SERP. Any recommendations that aren't enterprise-priced?",
    reply: "aisee tracks citation share across ChatGPT, Perplexity, Gemini, and Claude — starts at $49. Happy to share screenshots of our dashboard.",
    failReason: "X rate limit reached for this account", failCode: "RATE_LIMIT_429",
    failedAt: "30m ago", keyword: "LLM citation", trafficIdx: 690,
  },
  {
    id: "r10", status: "failed", platform: "reddit",
    target: { name: "u/growthwriter", handle: "r/SaaS", avatar: "G" },
    sourcePost: "Anyone built a GEO playbook that actually scales past 10 pieces of content?",
    reply: "Yes — the trick is templating around answer-patterns, not topics. We use 4 templates total. Happy to share if useful.",
    failReason: "Original post was deleted before reply could post", failCode: "POST_DELETED",
    failedAt: "1d ago", keyword: "GEO", trafficIdx: 420,
  },
];

const STATUS_META = {
  all:       { label: "All", swatch: null },
  awaiting:  { label: "Awaiting review", swatch: "awaiting" },
  sent:      { label: "Sent", swatch: "sent" },
  dismissed: { label: "Dismissed", swatch: "dismissed" },
  failed:    { label: "Failed", swatch: "failed" },
};

// localStorage flag for first-time tutorial auto-expand
const TUT_SEEN_KEY = "aisee:engage:linkTutorialSeen";

// ─── Toast ───────────────────────────────────────────────
function Toast({ t, onUndo, onClose }) {
  useEffect(() => {
    const id = setTimeout(onClose, 5000);
    return () => clearTimeout(id);
  }, [onClose]);
  return (
    <div className="toast">
      <span className="icon">{icons.check(12)}</span>
      <div className="body">
        <div>{t.title}</div>
        {t.sub && <div className="sub">{t.sub}</div>}
      </div>
      {t.undo && <button className="undo" onClick={onUndo}>Undo</button>}
    </div>
  );
}

function PlatBadge({ platform, size = 7 }) {
  return (
    <span className={`plat-mini ${platform === "reddit" ? "r" : ""}`}>
      {platform === "x" ? <PlatformX size={size} /> : <PlatformR size={size} />}
    </span>
  );
}

function formatK(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

// ─── Tutorial (How to get your reply link) ───────────────
function HowToGetLinkTutorial({ open, onToggle }) {
  return (
    <div>
      <button className={`tutorial-trigger ${open ? "open" : ""}`} onClick={onToggle}>
        <span className="q">?</span>
        <span>How to get your reply link</span>
        <span className="caret">{icons.chevronDown(12)}</span>
      </button>
      {open && (
        <div className="tutorial-panel">
          <div className="tutorial-text">
            <div className="ttl">Grab the comment link <span>👋</span></div>
            <ol>
              <li>
                <span className="n">1</span>
                <span>On X, find the comment you just posted.</span>
              </li>
              <li>
                <span className="n">2</span>
                <span>Click <kbd>Share ↑</kbd> directly under your reply.</span>
              </li>
              <li>
                <span className="n">3</span>
                <span>Click <kbd>Copy link</kbd> — that's the <strong>comment</strong> link.</span>
              </li>
            </ol>
            <div className="warn">{icons.info(11)} Don't copy the top-level post link — we need the comment URL to track impressions.</div>
          </div>
          <div className="x-mock">
            <div className="head">
              <span className="av"></span>
              <span className="name">@sophie</span>
              <span className="ts">· Now</span>
            </div>
            <div className="body">Thanks for sharing this — I found the part about onboarding new users especially useful.</div>
            <div className="icons">
              <span className="ic">{icons.msgCount(11)}</span>
              <span className="ic">{icons.refreshSync(11)}</span>
              <span className="ic">{icons.heart(11)}</span>
              <span className="ic">{icons.bookmark(11)}</span>
              <span className="ic highlight">{icons.ext(11)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Awaiting card body (ready sub-state with carousel) ──
function AwaitingReady({ rec, draftIdx, setDraftIdx, editing, setEditing, draftText, setDraftText, onCopyOpenX, onDismiss, onRegenerate, onSaveDraft }) {
  const drafts = rec.drafts;
  const cur = drafts[draftIdx];
  const ref = useRef(null);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      const len = ref.current.value.length;
      ref.current.setSelectionRange(len, len);
    }
  }, [editing]);

  const prev = () => { if (draftIdx > 0) { setDraftIdx(draftIdx - 1); setEditing(false); } };
  const next = () => { if (draftIdx < drafts.length - 1) { setDraftIdx(draftIdx + 1); setEditing(false); } };

  return (
    <>
      <div className={`draft-block ${editing ? "editing" : ""}`}>
        <div className="draft-header">
          <span className="label">Your reply</span>
          {drafts.length > 1 && (
            <span className="draft-carousel">
              <span className={`nav prev ${draftIdx === 0 ? "disabled" : ""}`} onClick={prev}>{icons.chevron(11)}</span>
              <span className="count">{draftIdx + 1} / {drafts.length}</span>
              <span className={`nav ${draftIdx === drafts.length - 1 ? "disabled" : ""}`} onClick={next}>{icons.chevron(11)}</span>
            </span>
          )}
          <span className="spacer"></span>
          {!editing && (
            <>
              <button className="act" onClick={() => setEditing(true)}>{icons.edit(11)} Edit</button>
              <button className="act" onClick={onRegenerate}>{icons.sparkle(11)} Regenerate</button>
            </>
          )}
        </div>
        <div className="draft-body">
          {editing ? (
            <textarea
              ref={ref}
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              maxLength={280}
              onKeyDown={(e) => {
                if (e.key === "Escape") { setEditing(false); setDraftText(cur.text); }
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { onSaveDraft(draftText); setEditing(false); }
              }}
            />
          ) : (
            <span>{cur.text}</span>
          )}
        </div>
        <div className="draft-meta">
          <span className="tag">{cur.angle}</span>
          {editing && (
            <>
              <span className="char">{draftText.length} / 280</span>
              <button className="rep-btn secondary" onClick={() => { setEditing(false); setDraftText(cur.text); }} style={{height:24, padding:"0 10px", fontSize:11}}>Cancel</button>
              <button className="rep-btn primary" onClick={() => { onSaveDraft(draftText); setEditing(false); }} style={{height:24, padding:"0 10px", fontSize:11}}>{icons.check(10)} Save</button>
            </>
          )}
        </div>
      </div>

      {!editing && (
        <div className="rep-actions">
          <button className="rep-btn copy-open" onClick={() => onCopyOpenX(rec, cur)}>
            <span className="x-glyph"><PlatformX size={10} /></span>
            Copy & open {rec.platform === "x" ? "X" : "Reddit"}
          </button>
          <button className="rep-btn secondary" onClick={() => {}}>
            Open in Signal Feed {icons.ext(11)}
          </button>
          <button className="rep-btn danger" onClick={() => onDismiss(rec.id)}>
            Dismiss
          </button>
          <span className="spacer"></span>
          <span className="gen-pill">
            {icons.sparkle(10)}
            <span>Drafts</span>
            <span className="v">{drafts.length}</span>
          </span>
        </div>
      )}
    </>
  );
}

// ─── Awaiting card body (posted, waiting for link) ──────
function AwaitingPosted({ rec, onSubmitUrl, onDeferLink }) {
  const [url, setUrl] = useState("");
  const [tutOpen, setTutOpen] = useState(() => {
    try { return !localStorage.getItem(TUT_SEEN_KEY); } catch (e) { return true; }
  });
  const toggleTut = () => {
    setTutOpen((o) => {
      const next = !o;
      try { if (!next) localStorage.setItem(TUT_SEEN_KEY, "1"); } catch (e) {}
      return next;
    });
  };
  const submit = () => {
    if (!url.trim()) return;
    try { localStorage.setItem(TUT_SEEN_KEY, "1"); } catch (e) {}
    onSubmitUrl(rec.id, url);
  };
  return (
    <>
      <div className="rep-source-quote">
        <strong>Your reply · </strong>{rec.postedDraft || rec.drafts?.[0]?.text}
      </div>
      <div className="posted-strip">
        <span className="ic">{icons.check(12)}</span>
        <div className="copy">
          <strong>Posted on {rec.platform === "x" ? "X" : "Reddit"}</strong>
          <div className="sub">Now grab the reply link so we can track impressions & likes.</div>
        </div>
      </div>
      <div className="link-input-row">
        <label className="field">
          <span className="ic">{icons.link(13)}</span>
          <input
            placeholder={rec.platform === "x" ? "https://x.com/.../status/..." : "https://reddit.com/r/.../comment/..."}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
          />
        </label>
        <button className="submit-btn" onClick={submit} disabled={!url.trim()}>
          {icons.check(12)} Submit
        </button>
      </div>
      <HowToGetLinkTutorial open={tutOpen} onToggle={toggleTut} />
      <div className="posted-foot">
        <a className="later" onClick={() => onDeferLink(rec.id)}>
          I've posted it — <u>I'll add the link later</u>
        </a>
      </div>
    </>
  );
}

// ─── Reply card (status-aware) ──────────────────────────
function ReplyCard({ rec, onCopyOpenX, onSubmitUrl, onDeferLink, onSaveDraft, onDismiss, onRestore, onRetry, onRegenerate }) {
  const isAwaiting  = rec.status === "awaiting";
  const isSent      = rec.status === "sent";
  const isDismissed = rec.status === "dismissed";
  const isFailed    = rec.status === "failed";
  const isPosted    = isAwaiting && rec.linkState === "posted";

  const [draftIdx, setDraftIdx] = useState(0);
  const [editing, setEditing] = useState(false);
  const curDraftText = isAwaiting && rec.drafts ? rec.drafts[draftIdx]?.text : (rec.reply || "");
  const [draftText, setDraftText] = useState(curDraftText);

  useEffect(() => {
    setDraftText(isAwaiting && rec.drafts ? rec.drafts[draftIdx]?.text : (rec.reply || ""));
  }, [draftIdx, rec.id, rec.drafts, isAwaiting, rec.reply]);

  // Pick status pill label and class
  let statusLabel = STATUS_META[rec.status].label;
  let statusClass = rec.status;
  if (isPosted) { statusLabel = "Posted · awaiting link"; statusClass = "awaiting"; }

  const cardClass = isPosted ? "posted" : rec.status;
  const timeLabel = rec.generatedAt || rec.sentAt || rec.dismissedAt || rec.failedAt;

  return (
    <div className={`rep-card ${cardClass}`}>
      {/* Head */}
      <div className="rep-head">
        <div className={`rep-av ${rec.platform === "reddit" ? "r" : ""}`}>
          {rec.target.avatar}
          <PlatBadge platform={rec.platform} />
        </div>
        <div className="rep-who">
          <strong style={{fontWeight:600}}>{rec.target.name}</strong>
          <span className="src">{rec.target.handle}</span>
          {isSent && rec.authorReplied && (
            <span className="rep-status author-replied" style={{marginLeft:6}}>
              {icons.check(11)} Author replied
            </span>
          )}
        </div>
        <span className={`rep-status ${statusClass}`}>
          <span className="dot"></span>
          {statusLabel}
        </span>
        <span className="rep-time">{timeLabel}</span>
      </div>

      {/* Source post (always shown, lighter when posted) */}
      <div className="rep-source-quote">
        <strong>From </strong>{rec.sourcePost}
      </div>

      {/* Body — varies by state */}
      {isAwaiting && !isPosted && (
        <AwaitingReady
          rec={rec}
          draftIdx={draftIdx} setDraftIdx={setDraftIdx}
          editing={editing} setEditing={setEditing}
          draftText={draftText} setDraftText={setDraftText}
          onCopyOpenX={onCopyOpenX}
          onDismiss={onDismiss}
          onRegenerate={() => onRegenerate(rec.id)}
          onSaveDraft={(txt) => onSaveDraft(rec.id, draftIdx, txt)}
        />
      )}

      {isPosted && (
        <AwaitingPosted
          rec={rec}
          onSubmitUrl={onSubmitUrl}
          onDeferLink={onDeferLink}
        />
      )}

      {isSent && (
        <>
          <div className="rep-body">
            <span style={{color:"var(--muted)", fontSize:11, textTransform:"uppercase", letterSpacing:"0.04em", fontWeight:500, marginRight:8}}>
              Your reply
            </span>
            {rec.reply}
          </div>
          {rec.linkSubmitted === false ? (
            <div className="link-pending">
              <span className="ic">{icons.info(14)}</span>
              <div className="copy">
                <strong>Link not submitted</strong>
                <div className="sub">Add the reply URL so we can track impressions & likes.</div>
              </div>
              <button onClick={() => onCopyOpenX(rec, { text: rec.reply }, true)}>Add link</button>
            </div>
          ) : (
            <div className="rep-stats">
              <span className="rep-stat">
                <span className="ic bolt">{icons.bolt(13)}</span>
                <span className="num">{formatK(rec.stats.impressions)}</span>
                <span className="lbl">Impressions</span>
              </span>
              <span className="rep-stat">
                <span className="ic heart">{icons.heart(13)}</span>
                <span className="num heart">{rec.stats.likes}</span>
                <span className="lbl">Likes</span>
              </span>
              <span className="rep-stat">
                <span className="ic">{icons.refreshSync(13)}</span>
                <span className="num">{rec.stats.retweets}</span>
                <span className="lbl">Reposts</span>
              </span>
              <span className="rep-stat">
                <span className="ic">{icons.msgCount(13)}</span>
                <span className="num">{rec.stats.replies}</span>
                <span className="lbl">Replies</span>
              </span>
              <span className="rep-stat">
                <span className="ic">{icons.bookmark(13)}</span>
                <span className="num">{rec.stats.bookmarks}</span>
                <span className="lbl">Bookmarks</span>
              </span>
            </div>
          )}
        </>
      )}

      {isDismissed && (
        <>
          <div className="rep-body">
            <span style={{color:"var(--muted)", fontSize:11, textTransform:"uppercase", letterSpacing:"0.04em", fontWeight:500, marginRight:8}}>
              Suggested reply
            </span>
            {rec.reply}
          </div>
          <div className="rep-reason">
            {icons.info(13)}
            <span><strong>Dismissed</strong> · {rec.dismissReason} ({rec.dismissedBy === "auto" ? "Auto" : "by you"})</span>
          </div>
          <div className="rep-actions">
            <button className="rep-btn secondary" onClick={() => onRestore(rec.id)}>
              {icons.reset(11)} Restore to queue
            </button>
          </div>
        </>
      )}

      {isFailed && (
        <>
          <div className="rep-body">
            <span style={{color:"var(--muted)", fontSize:11, textTransform:"uppercase", letterSpacing:"0.04em", fontWeight:500, marginRight:8}}>
              Your reply
            </span>
            {rec.reply}
          </div>
          <div className="rep-fail-banner">
            <span className="ic">{icons.info(16)}</span>
            <div style={{flex:1}}>
              <div className="ttl">Send failed · {rec.failCode}</div>
              <div className="desc">{rec.failReason}</div>
            </div>
          </div>
          <div className="rep-actions">
            <button className="rep-btn primary" onClick={() => onRetry(rec.id)}>
              {icons.refresh(11)} Retry
            </button>
            <button className="rep-btn secondary" onClick={() => onCopyOpenX(rec, { text: rec.reply })}>
              Copy & open {rec.platform === "x" ? "X" : "Reddit"}
            </button>
            <button className="rep-btn danger" onClick={() => onDismiss(rec.id, "manual")}>
              Dismiss
            </button>
          </div>
        </>
      )}

      {/* Foot: metadata */}
      <div className="rep-foot">
        <span className="traffic-pill">
          <span className="lbl">{rec.platform === "x" ? "X" : "Reddit"} Traffic idx</span>
          <span className="v">{rec.trafficIdx}</span>
          <span className="bar"><span style={{width: `${Math.min(100, rec.trafficIdx / 10)}%`}}></span></span>
        </span>
        {rec.strategy && <span className="strategy-tag">{rec.strategy}</span>}
        {rec.keyword && <span className="keyword-tag">#{rec.keyword}</span>}
        <span className="spacer"></span>
        {isSent && rec.linkSubmitted && (
          <a href="#" className="view-link" onClick={(e) => e.preventDefault()}>
            View post {icons.ext(12)}
          </a>
        )}
      </div>
    </div>
  );
}

// ─── KPI strip (status-aware) ───────────────────────────
function KpiStrip({ status, replies }) {
  const all = replies;
  const sent = all.filter(r => r.status === "sent");
  const awaiting = all.filter(r => r.status === "awaiting");
  const dismissed = all.filter(r => r.status === "dismissed");
  const failed = all.filter(r => r.status === "failed");

  const sentWithStats = sent.filter(r => r.linkSubmitted && r.stats);
  const totalImpressions = sentWithStats.reduce((s, r) => s + (r.stats?.impressions || 0), 0);
  const totalLikes = sentWithStats.reduce((s, r) => s + (r.stats?.likes || 0), 0);
  const authorRepliedCt = sentWithStats.filter(r => r.authorReplied).length;
  const authorRepliedPct = sentWithStats.length ? Math.round((authorRepliedCt / sentWithStats.length) * 100) : 0;
  const avgEngagement = sentWithStats.length
    ? Math.round(sentWithStats.reduce((s, r) => s + (r.stats?.likes || 0) + (r.stats?.retweets || 0) + (r.stats?.replies || 0), 0) / sentWithStats.length)
    : 0;

  let cards = [];
  switch (status) {
    case "awaiting":
      cards = [
        { lbl: "In queue",         v: awaiting.filter(r => r.linkState !== "posted").length },
        { lbl: "Awaiting link",    v: awaiting.filter(r => r.linkState === "posted").length, sub: "Posted, link pending" },
        { lbl: "Avg traffic idx",  v: awaiting.length ? Math.round(awaiting.reduce((s, r) => s + r.trafficIdx, 0) / awaiting.length) : 0 },
        { lbl: "Drafts available", v: awaiting.reduce((s, r) => s + (r.drafts?.length || 1), 0), sub: "Across all queued signals" },
      ];
      break;
    case "sent":
      cards = [
        { lbl: "Sent (30d)",        v: sent.length, sub: `${sent.filter(r => !r.linkSubmitted).length} pending link` },
        { lbl: "Total impressions", v: formatK(totalImpressions) },
        { lbl: "Total likes",       v: totalLikes.toLocaleString() },
        { lbl: "Author replied",    v: `${authorRepliedPct}`, unit: "%", sub: `${authorRepliedCt} of ${sentWithStats.length}` },
      ];
      break;
    case "dismissed":
      cards = [
        { lbl: "Dismissed (30d)", v: dismissed.length },
        { lbl: "Auto-filtered",   v: dismissed.filter(r => r.dismissedBy === "auto").length },
        { lbl: "By you",          v: dismissed.filter(r => r.dismissedBy === "you").length },
        { lbl: "Avoided traffic", v: dismissed.reduce((s, r) => s + r.trafficIdx, 0).toLocaleString(), sub: "Sum of skipped Traffic idx" },
      ];
      break;
    case "failed":
      cards = [
        { lbl: "Failed (30d)",  v: failed.length },
        { lbl: "Rate-limited",  v: failed.filter(r => r.failCode === "RATE_LIMIT_429").length },
        { lbl: "Post deleted",  v: failed.filter(r => r.failCode === "POST_DELETED").length },
        { lbl: "Other",         v: failed.filter(r => r.failCode !== "RATE_LIMIT_429" && r.failCode !== "POST_DELETED").length },
      ];
      break;
    default:
      cards = [
        { lbl: "Generated total",   v: all.length, sub: "Last 30 days" },
        { lbl: "Send rate",         v: sent.length + dismissed.length > 0 ? Math.round((sent.length / (sent.length + dismissed.length)) * 100) : 0, unit: "%", sub: "Of reviewed" },
        { lbl: "Avg engagement",    v: avgEngagement, sub: "Likes + RT + comments per sent" },
        { lbl: "Author reply rate", v: `${authorRepliedPct}`, unit: "%", sub: `${authorRepliedCt} of ${sentWithStats.length} sent` },
      ];
  }

  return (
    <div className="kpi-strip">
      {cards.map((c, i) => (
        <div key={i} className="kpi-cell">
          <span className="lbl">{c.lbl}</span>
          <span className="v">{c.v}{c.unit && <span className="u">{c.unit}</span>}</span>
          {c.sub && <span className="sub">{c.sub}</span>}
        </div>
      ))}
    </div>
  );
}

// ─── Main page ──────────────────────────────────────────
function RepliesPage() {
  const [records, setRecords] = useState(ALL_REPLIES);
  const [status, setStatus] = useState("awaiting"); // start on awaiting so demo is obvious
  const [platform, setPlatform] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [toasts, setToasts] = useState([]);

  const pushToast = useCallback((t) => {
    const id = Date.now() + Math.random();
    setToasts((ts) => [...ts, { ...t, id }]);
    return id;
  }, []);
  const removeToast = useCallback((id) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
  }, []);

  const counts = useMemo(() => ({
    all:       records.length,
    awaiting:  records.filter(r => r.status === "awaiting").length,
    sent:      records.filter(r => r.status === "sent").length,
    dismissed: records.filter(r => r.status === "dismissed").length,
    failed:    records.filter(r => r.status === "failed").length,
  }), [records]);

  const filtered = useMemo(() => {
    let list = records;
    if (status !== "all") list = list.filter(r => r.status === status);
    if (platform !== "all") list = list.filter(r => r.platform === platform);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        r.target.name.toLowerCase().includes(q) ||
        r.target.handle.toLowerCase().includes(q) ||
        (r.reply || "").toLowerCase().includes(q) ||
        (r.drafts || []).some(d => d.text.toLowerCase().includes(q)) ||
        r.sourcePost.toLowerCase().includes(q) ||
        (r.keyword || "").toLowerCase().includes(q)
      );
    }
    if (sort === "traffic")    list = [...list].sort((a, b) => b.trafficIdx - a.trafficIdx);
    if (sort === "engagement") list = [...list].sort((a, b) => (b.stats?.likes || 0) - (a.stats?.likes || 0));
    if (status === "awaiting") {
      // surface "posted, awaiting link" cards on top — they're closer to done
      list = [...list].sort((a, b) => (b.linkState === "posted" ? 1 : 0) - (a.linkState === "posted" ? 1 : 0));
    }
    return list;
  }, [records, status, platform, search, sort]);

  // ─ Handlers ─
  const handleCopyOpenX = (rec, draft, fromSent) => {
    const text = (draft && draft.text) || rec.reply || "";
    try { navigator.clipboard?.writeText(text); } catch (e) {}
    try { window.open(rec.platform === "x" ? "https://x.com/compose/post" : "https://www.reddit.com/", "_blank", "noopener"); } catch (e) {}

    if (fromSent) {
      pushToast({ title: "Draft copied", sub: "Paste & post, then add the link below." });
      return;
    }
    // Transition awaiting → posted (link pending), keep in awaiting status
    setRecords(arr => arr.map(r => r.id === rec.id ? {
      ...r,
      linkState: "posted",
      postedDraft: text,
      postedAt: "just now",
    } : r));
    pushToast({
      title: "Copied & opened " + (rec.platform === "x" ? "X" : "Reddit"),
      sub: "Post the reply, then paste the link back here.",
    });
  };

  const handleSubmitUrl = (id, url) => {
    setRecords(arr => arr.map(r => r.id === id ? {
      ...r,
      status: "sent",
      linkSubmitted: true,
      replyUrl: url,
      reply: r.postedDraft || r.reply,
      sentAt: "just now",
      stats: { impressions: 0, likes: 0, retweets: 0, replies: 0, bookmarks: 0 },
    } : r));
    pushToast({ title: "Link submitted", sub: "We'll start fetching impressions & likes shortly." });
  };

  const handleDeferLink = (id) => {
    setRecords(arr => arr.map(r => r.id === id ? {
      ...r,
      status: "sent",
      linkSubmitted: false,
      reply: r.postedDraft || r.reply,
      sentAt: "just now",
    } : r));
    pushToast({ title: "Marked as sent", sub: "Find it under the Sent tab to add the link later." });
  };

  const handleSaveDraft = (id, draftIdx, newText) => {
    setRecords(arr => arr.map(r => r.id === id
      ? { ...r, drafts: r.drafts.map((d, i) => i === draftIdx ? { ...d, text: newText } : d) }
      : r));
    pushToast({ title: "Draft updated" });
  };

  const handleRegenerate = (id) => {
    setRecords(arr => arr.map(r => r.id === id ? {
      ...r,
      drafts: [...r.drafts, {
        id: `${id}-d${r.drafts.length + 1}`,
        angle: ["Concise", "Bold take", "Direct"][r.drafts.length % 3] || "New angle",
        text: "✨ Just-generated draft — pretend this came back from the model with a fresh take. Edit me to fit your voice."
      }],
    } : r));
    pushToast({ title: "New draft generated", sub: "Use the carousel arrows to compare." });
  };

  const handleDismiss = (id) => {
    setRecords(arr => arr.map(r => r.id === id ? {
      ...r, status: "dismissed", dismissReason: "Manual dismiss", dismissedBy: "you", dismissedAt: "just now",
      reply: r.drafts ? r.drafts[0].text : r.reply,
    } : r));
    pushToast({ title: "Reply dismissed", sub: "Find it under the Dismissed tab." });
  };

  const handleRestore = (id) => {
    setRecords(arr => arr.map(r => r.id === id ? {
      ...r, status: "awaiting", linkState: "ready", generatedAt: "just now",
      drafts: r.drafts || [{ id: `${id}-d1`, angle: "Restored", text: r.reply }],
    } : r));
    pushToast({ title: "Restored to queue" });
  };

  const handleRetry = (id) => {
    pushToast({ title: "Retrying…", sub: "Will move to Sent if successful." });
  };

  return (
    <div className="rep-page">
      {/* Banner */}
      <div className="rep-banner">
        <div className="ic">
          <svg width="26" height="26" viewBox="0 0 16 16" fill="none" stroke="#111" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3.65517C2 2.74105 2.74105 2 3.65517 2H12.3448C13.259 2 14 2.74105 14 3.65517V9.86207C14 10.7762 13.259 11.5172 12.3448 11.5172H10.1724L8 14L5.82759 11.5172H3.65517C2.74105 11.5172 2 10.7762 2 9.86207V3.65517Z" />
            <circle cx="5.5" cy="7.17" r="0.45" fill="#111" />
            <circle cx="8" cy="7.17" r="0.45" fill="#111" />
            <circle cx="10.5" cy="7.17" r="0.45" fill="#111" />
          </svg>
        </div>
        <div className="titles">
          <div className="crumb">Engage / Replies</div>
          <h1>All replies</h1>
          <div className="sub">Every AI-generated reply, from draft to sent — searchable, filterable, restorable.</div>
        </div>
        <div className="b-stats">
          <div className="b-stat">
            <span className="lbl">Generated (30d)</span>
            <span className="num">{counts.all}</span>
          </div>
          <div className="b-stat">
            <span className="lbl">Send rate</span>
            <span className="num">
              {counts.sent + counts.dismissed > 0
                ? Math.round((counts.sent / (counts.sent + counts.dismissed)) * 100)
                : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Status tabs */}
      <div className="status-tabs">
        {Object.keys(STATUS_META).map((k) => (
          <button key={k} className={`status-tab ${status === k ? "on" : ""}`} onClick={() => setStatus(k)}>
            {STATUS_META[k].swatch && <span className={`swatch ${STATUS_META[k].swatch}`}></span>}
            <span>{STATUS_META[k].label}</span>
            <span className="count">{counts[k]}</span>
          </button>
        ))}
      </div>

      {/* Filter row */}
      <div className="filter-row2">
        <div className="left">
          <div className="search-box">
            {icons.search(13)}
            <input
              placeholder="Search by target, keyword, content…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className={`pill-btn ${platform === "x" ? "on" : ""}`} onClick={() => setPlatform(platform === "x" ? "all" : "x")}>
            <PlatformX size={10} />
            <span>X</span>
            <span className="ct">{records.filter(r => r.platform === "x").length}</span>
          </button>
          <button className={`pill-btn ${platform === "reddit" ? "on" : ""}`} onClick={() => setPlatform(platform === "reddit" ? "all" : "reddit")}>
            <span style={{fontWeight:800, fontStyle:"italic", letterSpacing:"-0.05em", fontFamily:"Karla", fontSize:11}}>r/</span>
            <span>Reddit</span>
            <span className="ct">{records.filter(r => r.platform === "reddit").length}</span>
          </button>
          <button className="pill-btn">
            {icons.filter(11)}
            <span>Keyword</span>
            <span className="caret">{icons.chevronDown(10)}</span>
          </button>
          <button className="pill-btn">
            {icons.schedule(11)}
            <span>Last 30 days</span>
            <span className="caret">{icons.chevronDown(10)}</span>
          </button>
        </div>
        <div className="right">
          <button className="pill-btn" onClick={() => setSort(sort === "recent" ? "traffic" : sort === "traffic" ? "engagement" : "recent")}>
            <span>Sort: {sort === "recent" ? "Most recent" : sort === "traffic" ? "Traffic idx" : "Engagement"}</span>
            <span className="caret">{icons.chevronDown(10)}</span>
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <KpiStrip status={status} replies={records} />

      {/* Reply list */}
      {filtered.length === 0 ? (
        <div className="rep-empty">
          <div className="icon">{icons.bubble(28)}</div>
          <div className="ttl">No replies match these filters</div>
          <div className="desc">Try clearing the search or switching to another status tab.</div>
        </div>
      ) : (
        <div className="rep-list">
          {filtered.map((rec) => (
            <ReplyCard
              key={rec.id}
              rec={rec}
              onCopyOpenX={handleCopyOpenX}
              onSubmitUrl={handleSubmitUrl}
              onDeferLink={handleDeferLink}
              onSaveDraft={handleSaveDraft}
              onDismiss={handleDismiss}
              onRestore={handleRestore}
              onRetry={handleRetry}
              onRegenerate={handleRegenerate}
            />
          ))}
        </div>
      )}

      {/* Toasts */}
      <div className="toast-stack">
        {toasts.map((t) => (
          <Toast key={t.id} t={t} onUndo={() => { t.undo && t.undo(); }} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <div className="header"><AppHeader /></div>
      <div className="sidebar"><Sidebar active="engage" /></div>
      <main className="main">
        <RepliesPage />
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
