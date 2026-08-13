/* global React, icons, PlatformX, PlatformR */
const { useState, useEffect, useRef } = React;

// Status assignment for demo posts (signal feed entries):
//   "unread" = needs reply | "sent" = already replied | "expired" = window passed
const STATUS_BY_ID = {
  p1: "unread",
  p2: "expired",
  p3: "unread",
  p4: "sent",
  p5: "unread"
};
function getStatus(p) { return STATUS_BY_ID[p.id] || "unread"; }

// ── Sample feed data ───────────────────────────────────────────
const FEED_DATA = [
{
  id: "p1",
  platform: "x",
  intent: "Help-seeking",
  intentVariant: "intent",
  time: "1h",
  ageH: 1,
  score: 94,
  user: { handle: "@seo_practitioner", followers: "12.4K followers", followersN: 12400, avatar: "M" },
  body: "Our brand is completely invisible on ChatGPT and Perplexity. We publish great content but AI never mentions us. How do you actually optimize for generative AI search? Anyone seen real results? #GEO",
  tags: ["GEO", "Pain-point hit"],
  stats: { likes: 234, replies: 45 },
  extraTagClass: "painpoint",
  // Filter dimensions
  keywordQuality: "high", // high | medium | low
  platformHeat: "high", // high | medium | low
  accountInfluence: "medium", // high | medium | low
  recency: "d1", // d1 (≤24h) | d3 (1–3d) | d7 (3–7d) | d7plus (≥7d)
  isPriority: false,
  keywordHit: "GEO"
},
{
  id: "p2",
  platform: "reddit",
  intent: "Discussion",
  intentVariant: "discuss",
  subreddit: "r/SEO",
  time: "3h",
  ageH: 3,
  score: 87,
  actionTag: "Manual reply",
  user: { handle: "u/digital_mktg_pro", followersN: 0, avatar: "d" },
  body: "Does GEO (Generative Engine Optimization) actually work? Been trying to get our SaaS mentioned by ChatGPT for months. Tried FAQ schema, structured data… nothing moves the needle. Anyone cracked this?",
  tags: ["GEO", "Hot 847↑"],
  stats: { upvotes: 847, comments: 156 },
  keywordQuality: "high",
  platformHeat: "high",
  accountInfluence: "low",
  recency: "d1",
  isPriority: false,
  keywordHit: "GEO"
},
{
  id: "p3",
  platform: "x",
  intent: "Hot take",
  intentVariant: "opinion",
  time: "2d",
  ageH: 50,
  score: 82,
  user: { handle: "@ai_marketing_hub", followers: "45.2K followers", followersN: 45200, avatar: "A" },
  body: "Hot take: Traditional SEO is dead. AI search visibility will be the #1 marketing priority for B2B SaaS in 2025. Most companies have zero idea how AI perceives their brand right now.",
  tags: ["GEO", "Big account"],
  stats: { likes: 1200, replies: 89 },
  keywordQuality: "medium",
  platformHeat: "medium",
  accountInfluence: "high",
  recency: "d3",
  isPriority: true,
  keywordHit: "AI search visibility"
},
{
  id: "p4",
  platform: "reddit",
  intent: "Comparison",
  intentVariant: "compare",
  subreddit: "r/marketing",
  time: "5d",
  ageH: 120,
  score: 76,
  actionTag: "Manual reply",
  user: { handle: "u/saas_founder_2024", followersN: 0, avatar: "S" },
  body: "Has anyone compared tools for tracking AI search visibility? Looking for something that monitors how ChatGPT and Perplexity describe my brand. Semrush doesn't seem to cover this well.",
  tags: ["Competitor mention", "Decision stage"],
  extraTagClass: "competitor",
  stats: { upvotes: 156, comments: 43 },
  keywordQuality: "high",
  platformHeat: "medium",
  accountInfluence: "low",
  recency: "d7",
  isPriority: false,
  keywordHit: "Semrush AI"
},
{
  id: "p5",
  platform: "x",
  intent: "Data share",
  intentVariant: "data",
  time: "9d",
  ageH: 216,
  score: 71,
  user: { handle: "@growth_metrics", followers: "8.9K followers", followersN: 8900, avatar: "g" },
  body: "Just analyzed 200 B2B brands across ChatGPT, Perplexity & Claude. Only 18% had consistent brand mentions across all 3. The gap between SEO presence and AI presence is wider than most realize.",
  tags: ["Data point"],
  stats: { likes: 412, replies: 28 },
  keywordQuality: "medium",
  platformHeat: "low",
  accountInfluence: "medium",
  recency: "d7plus",
  isPriority: false,
  keywordHit: "AI search visibility"
}];


function intentClass(v) {
  return { intent: "intent", opinion: "opinion", discuss: "discuss", compare: "compare", data: "data" }[v] || "";
}

// ── Feed Card ──────────────────────────────────────────────────
function FeedCard({ post, selected, onSelect, onGenerate, fav, onFav }) {
  return (
    <article
      className={`feed-card ${selected ? "selected" : ""}`}
      onClick={() => onSelect(post.id)}>
      
      <div className="fc-top">
        <span className={`platform-pill ${post.platform === "reddit" ? "r" : ""}`}>
          {post.platform === "x" ? <PlatformX size={11} /> : <PlatformR />}
        </span>
        <span className={`tag ${intentClass(post.intentVariant)}`}>{post.intent}</span>
        {post.subreddit && <span className="tag subreddit">{post.subreddit}</span>}
        {post.actionTag && <span className="tag action">{post.actionTag}</span>}
        <span className="right">
          <span>{post.time} ago</span>
          <a href="#" onClick={(e) => {e.preventDefault();e.stopPropagation();}}>
            {icons.ext(13)} Source
          </a>
          <span className="score">{post.score}</span>
          <button
            className="fav-btn"
            style={{ display: "none" }}
            onClick={(e) => {e.stopPropagation();onFav(post.id);}}
            aria-label="Save">
            {fav ? icons.starFav(16) : icons.star(16, false)}
          </button>
        </span>
      </div>

      <div className="fc-user">
        <span className="av">{post.user.avatar}</span>
        <span className="handle">{post.user.handle}</span>
        {post.user.followers && <><span className="meta">·</span><span className="meta">{post.user.followers}</span></>}
      </div>

      <div className="fc-body">{post.body}</div>

      <div className="fc-bot">
        {post.tags.map((t, i) => {
          const cls = i === 1 && post.extraTagClass ? post.extraTagClass : "";
          return <span key={i} className={`tag ${cls}`}>{t}</span>;
        })}
        <div className="spacer"></div>
        <div className="stats">
          {post.platform === "x" ?
          <>
              <span>{icons.heart(13)} {post.stats.likes}</span>
              <span>{icons.msgCount(13)} {post.stats.replies}</span>
            </> :

          <>
              <span>{icons.arrowUp(13)} {post.stats.upvotes}</span>
              <span>{icons.msgCount(13)} {post.stats.comments}</span>
            </>
          }
        </div>
        <button
          className="gen-btn"
          onClick={(e) => {e.stopPropagation();onGenerate(post.id);}}>
          
          Generate Reply {icons.arrowR(13)}
        </button>
      </div>
    </article>);

}

// ── Filter Dropdown ────────────────────────────────────────────
function FilterDropdown({ label, value, options, onChange, inline, unsetValue = "all" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {if (ref.current && !ref.current.contains(e.target)) setOpen(false);};
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const current = options.find((o) => o.id === value);
  const isSet = value && value !== unsetValue;

  if (inline) {
    return (
      <div className="fdd inline">
        <button
          className={`pill-trigger ${isSet ? "set" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            // Cycle through options on click (no dropdown menu per Figma)
            const idx = options.findIndex((o) => o.id === value);
            const next = options[(idx + 1) % options.length];
            onChange(next.id);
          }}>
          <span className="pill-label">{label}</span>
          {isSet &&
            <>
              <span className="pill-divider">·</span>
              <span className="pill-val">{current?.label}</span>
              <span className="pill-clear" onClick={(e) => {e.stopPropagation();onChange(unsetValue);}} aria-label="Clear">
                {icons.x(9)}
              </span>
            </>
          }
        </button>
      </div>);
  }

  return (
    <div className="fdd" ref={ref}>
      <button
        className={`fdd-trigger ${isSet ? "set" : ""} ${open ? "open" : ""}`}
        onClick={(e) => {e.stopPropagation();setOpen((o) => !o);}}>
        
        {label ? <span className="lbl-text">{label}</span> : null}
        <span className="val">{current?.label || "All"}</span>
        {isSet &&
        <span className="fdd-clear" onClick={(e) => {e.stopPropagation();onChange(unsetValue);}} aria-label="Clear">
            {icons.x(10)}
          </span>
        }
        <span className="caret">{icons.chevronDown(11)}</span>
      </button>
      {open &&
      <div className="fdd-menu">
          {options.map((o) =>
        <button
          key={o.id}
          className={`fdd-item ${value === o.id ? "on" : ""}`}
          onClick={() => {onChange(o.id);setOpen(false);}}>
          
              <span>{o.label}</span>
              {o.desc && <span className="desc">{o.desc}</span>}
            </button>
        )}
        </div>
      }
    </div>);

}

// ── Multi-select dropdown (checkboxes) — keywords / accounts / subreddits ──
function MultiSelect({ values, options, onChange, placeholder = "Any" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onDoc = (e) => {if (ref.current && !ref.current.contains(e.target)) setOpen(false);};
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const vals = values || [];
  const isSet = vals.length > 0;
  const summary = vals.length === 0 ? placeholder :
    vals.length === 1 ? (options.find((o) => o.id === vals[0])?.label || vals[0]) :
    `${vals.length} selected`;

  const toggle = (id) => {
    onChange(vals.includes(id) ? vals.filter((v) => v !== id) : [...vals, id]);
  };

  return (
    <div className="fdd" ref={ref}>
      <button
        className={`fdd-trigger ${isSet ? "set" : ""} ${open ? "open" : ""}`}
        onClick={(e) => {e.stopPropagation();setOpen((o) => !o);}}>
        <span className="val">{summary}</span>
        {isSet &&
          <span className="fdd-clear" onClick={(e) => {e.stopPropagation();onChange([]);}} aria-label="Clear">
            {icons.x(10)}
          </span>
        }
        <span className="caret">{icons.chevronDown(11)}</span>
      </button>
      {open &&
        <div className="fdd-menu">
          {options.map((o) => {
            const on = vals.includes(o.id);
            return (
              <button key={o.id} className={`fdd-item ${on ? "on" : ""}`} onClick={() => toggle(o.id)}>
                <span className={`ms-check ${on ? "on" : ""}`}>{on && icons.check(10)}</span>
                <span>{o.label}</span>
              </button>);
          })}
        </div>
      }
    </div>);
}

const FILTER_OPTS = {
  keywordQuality: [
  { id: "all", label: "Any" },
  { id: "high", label: "High", desc: "exact / brand" },
  { id: "medium", label: "Medium", desc: "topical match" },
  { id: "low", label: "Low", desc: "broad" }],

  platformHeat: [
  { id: "all", label: "Any" },
  { id: "high", label: "Hot", desc: "500+ engagement" },
  { id: "medium", label: "Warm", desc: "100+ engagement" },
  { id: "low", label: "Cool", desc: "low engagement" }],

  accountInfluence: [
  { id: "all", label: "Any" },
  { id: "high", label: "Big", desc: "10K+ followers" },
  { id: "medium", label: "Mid", desc: "1K–10K" },
  { id: "low", label: "Small", desc: "<1K" }],

  recency: [
  { id: "all", label: "Any time" },
  { id: "d1", label: "Last 24h" },
  { id: "d3", label: "1–3 days" },
  { id: "d7", label: "3–7 days" },
  { id: "d7plus", label: "7+ days" }],

  intent: [
  { id: "all", label: "Any type" },
  { id: "Help-seeking", label: "Help-seeking" },
  { id: "Discussion", label: "Discussion" },
  { id: "Hot take", label: "Hot take" },
  { id: "Comparison", label: "Comparison" },
  { id: "Data share", label: "Data share" }]

};

// ── Platform Picker (segmented — keeps All/X/Reddit distribution visible) ──
function PlatformPicker({ source, setSource, totals }) {
  const OPTS = [
    { id: "all", label: "All", glyph: null, count: totals.all },
    { id: "x", label: "X", glyph: <PlatformX size={11} />, count: totals.x },
    { id: "reddit", label: "Reddit", glyph: <PlatformR />, count: totals.reddit }
  ];
  return (
    <div className="platform-seg" role="tablist" aria-label="Platform">
      {OPTS.map((o) =>
        <button
          key={o.id}
          role="tab"
          aria-selected={source === o.id}
          title={o.id === "all" ? "All platforms" : o.label}
          className={`platform-seg-tab ${source === o.id ? "on" : ""}`}
          onClick={() => setSource(o.id)}>
          {o.glyph ? <span className="ps-glyph">{o.glyph}</span> : <span>All</span>}
          <span className="platform-seg-ct">{o.count}</span>
        </button>
      )}
    </div>
  );
}

// ── More Filters Popover ───────────────────────────────────────
function MoreFilters({ refine, setRefine, onReset, activeCount, facets }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {if (ref.current && !ref.current.contains(e.target)) setOpen(false);};
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="more-filters" ref={ref}>
      <button
        className={`mf-trigger ${open ? "open" : ""} ${activeCount > 0 ? "has-active" : ""}`}
        onClick={() => setOpen((o) => !o)}>
        {icons.filter(13)}
        <span>Filters</span>
        {activeCount > 0 && <span className="mf-badge">{activeCount}</span>}
      </button>
      {open &&
        <div className="mf-panel">
          <div className="mf-panel-head">
            <span>More filters</span>
            {activeCount > 0 &&
              <button className="mf-clear" onClick={onReset}>
                {icons.reset(11)} Clear all
              </button>
            }
          </div>
          <div className="mf-fields">
            <div className="mf-field">
              <span className="mf-field-label">Post type</span>
              <FilterDropdown
                value={refine.intent}
                options={FILTER_OPTS.intent}
                onChange={(v) => setRefine({ ...refine, intent: v })} />
            </div>
            <div className="mf-field">
              <span className="mf-field-label">Keywords</span>
              <MultiSelect
                values={refine.keywords}
                options={facets.keywords}
                placeholder="Any keyword"
                onChange={(v) => setRefine({ ...refine, keywords: v })} />
            </div>
            <div className="mf-field">
              <span className="mf-field-label">Accounts</span>
              <MultiSelect
                values={refine.accounts}
                options={facets.accounts}
                placeholder="Any account"
                onChange={(v) => setRefine({ ...refine, accounts: v })} />
            </div>
            <div className="mf-field">
              <span className="mf-field-label">Subreddits</span>
              <MultiSelect
                values={refine.subreddits}
                options={facets.subreddits}
                placeholder="Any subreddit"
                onChange={(v) => setRefine({ ...refine, subreddits: v })} />
            </div>
            <div className="mf-field">
              <span className="mf-field-label">Follower size</span>
              <FilterDropdown
                value={refine.accountInfluence}
                options={FILTER_OPTS.accountInfluence}
                onChange={(v) => setRefine({ ...refine, accountInfluence: v })} />
            </div>
            <div className="mf-field">
              <span className="mf-field-label">Posted within</span>
              <FilterDropdown
                value={refine.recency}
                options={FILTER_OPTS.recency}
                onChange={(v) => setRefine({ ...refine, recency: v })} />
            </div>
          </div>
        </div>
      }
    </div>
  );
}

// ── Filter Bar — Figma SecondaryTab pattern, single row ────────
window.FilterBar = function FilterBar({
  source, setSource,
  saved, setSaved,
  savedCount,
  refine, setRefine,
  onReset,
  totals,
  sort, setSort,
  status, setStatus,
  statusCounts,
  quickCounts,
  facets
}) {
  // Build removable tokens from both single-value dims and multi-select facets
  const SINGLE_DIMS = [
    ["intent", "Post type", FILTER_OPTS.intent],
    ["accountInfluence", "Follower size", FILTER_OPTS.accountInfluence],
    ["recency", "Posted within", FILTER_OPTS.recency]
  ];
  const MULTI_DIMS = [
    ["keywords", "Keyword", facets.keywords],
    ["accounts", "Account", facets.accounts],
    ["subreddits", "Subreddit", facets.subreddits]
  ];
  const activeTokens = [];
  SINGLE_DIMS.forEach(([k, dim, opts]) => {
    if (refine[k] && refine[k] !== "all") {
      const o = opts.find((x) => x.id === refine[k]);
      activeTokens.push({ id: k + ":" + refine[k], dim, val: o ? o.label : refine[k],
        clear: () => setRefine({ ...refine, [k]: "all" }) });
    }
  });
  MULTI_DIMS.forEach(([k, dim, opts]) => {
    (refine[k] || []).forEach((v) => {
      const o = opts.find((x) => x.id === v);
      activeTokens.push({ id: k + ":" + v, dim, val: o ? o.label : v,
        clear: () => setRefine({ ...refine, [k]: refine[k].filter((x) => x !== v) }) });
    });
  });
  const refineActive = activeTokens.length;
  const anyActive = refineActive > 0 || refine.scoreHigh === "on" || refine.platformHeat === "high";

  const QUICK_CHIPS = [
    { id: "scoreHigh", key: "scoreHigh", on: refine.scoreHigh === "on",
      icon: icons.star(12), label: "High score", count: quickCounts.highScore,
      toggle: () => setRefine({ ...refine, scoreHigh: refine.scoreHigh === "on" ? "all" : "on" }) },
    { id: "hot", key: "platformHeat", on: refine.platformHeat === "high",
      icon: icons.flame(12), label: "High heat", count: quickCounts.hot,
      toggle: () => setRefine({ ...refine, platformHeat: refine.platformHeat === "high" ? "all" : "high" }) }
  ];

  const STATUS_OPTS = [
    { id: "all",     label: "All",         count: statusCounts.all },
    { id: "unread",  label: "Not replied", count: statusCounts.unread },
    { id: "sent",    label: "Replied",     count: statusCounts.sent },
    { id: "expired", label: "Expired",     count: statusCounts.expired }
  ];

  return (
    <div className="filter-bar">
      <div className="filter-row">
        {/* LEFT — platform picker */}
        <PlatformPicker source={source} setSource={setSource} totals={totals} />

        <span className="fb-divider" aria-hidden="true"></span>

        {/* Status segmented control */}
        <div className="status-seg" role="tablist" aria-label="Reply status">
          {STATUS_OPTS.map((s) =>
            <button
              key={s.id}
              role="tab"
              aria-selected={status === s.id}
              className={`status-seg-tab ${status === s.id ? "on" : ""}`}
              onClick={() => setStatus(s.id)}>
              <span>{s.label}</span>
              <span className="status-seg-ct">{s.count}</span>
            </button>
          )}
        </div>

        <span className="fb-divider" aria-hidden="true"></span>

        {/* Quick priority chips — multi-select toggles (OR). The leading check
            + separated pill shape distinguishes them from the single-select segments above. */}
        <div className="quick-chips" role="group" aria-label="Quick priorities (any)">
          <span className="qc-group-lbl">Show</span>
          {QUICK_CHIPS.map((c) =>
            <button
              key={c.id}
              className={`quick-chip ${c.on ? "on" : ""}`}
              aria-pressed={c.on}
              disabled={!c.on && c.count === 0}
              onClick={c.toggle}>
              <span className="qc-check">{c.on ? icons.check(11) : c.icon}</span>
              <span>{c.label}</span>
              <span className="qc-ct">{c.count}</span>
            </button>
          )}
        </div>

        <div className="filter-spacer"></div>

        {/* Sort */}
        <FilterDropdown
          label="Sort"
          value={sort}
          unsetValue="score"
          options={[
            { id: "score", label: "Score" },
            { id: "newest", label: "Newest" },
            { id: "heat", label: "Heat" }
          ]}
          onChange={setSort} />

        {/* More filters (collapsed) */}
        <MoreFilters
          refine={refine}
          setRefine={setRefine}
          onReset={onReset}
          activeCount={refineActive}
          facets={facets} />
      </div>

      {/* Applied-filter tokens — makes second-level selections visible + one-tap removable */}
      {(activeTokens.length > 0 || anyActive) &&
        <div className="active-filters">
          {activeTokens.length > 0 && <span className="af-lbl">Applied</span>}
          {activeTokens.map((t) =>
            <span key={t.id} className="af-token">
              <span className="af-dim">{t.dim}</span>
              <span className="af-val">{t.val}</span>
              <button
                className="af-x"
                aria-label={`Remove ${t.dim} filter`}
                onClick={t.clear}>
                {icons.x(10)}
              </button>
            </span>
          )}
          {anyActive &&
            <button className="af-clear" onClick={onReset}>
              {icons.reset(11)} Clear all
            </button>
          }
        </div>
      }
    </div>);

};

// ── Reply Panel — stepped flow ─────────────────────────────────
const STRATEGIES = [
{ id: "expert", ttl: "Expert answer", sub: "Structured steps" },
{ id: "data", ttl: "Data-backed", sub: "Cite numbers" },
{ id: "empathy", ttl: "Empathetic", sub: "Acknowledge pain first" }];


const TOPIC_SUGGESTIONS = {
  expert: ["FAQ schema", "Topical clusters", "Authority signals"],
  data: ["18% benchmark", "Schema impact", "Citation rate"],
  empathy: ["Common pain", "Audit framework", "Quick diagnostic"]
};

const DRAFTS_BY_STRATEGY = {
  expert: `This is one of the most common gaps we see — most brands score under 30 on AI Presence even with solid content.

Three things that consistently move the needle:
① FAQ schema — Q&A format that AI loves to cite directly
② Topical depth — clusters of 5+ pages on one narrow concept
③ External validation — getting cited on high-authority sources AI actually reads (not just Google's top results)

Happy to share the audit framework we use — it's surfaced these patterns across 500+ B2B brands.`,
  data: `We analyzed 500+ B2B brands across ChatGPT, Perplexity and Claude — only 18% had consistent mentions across all three.

The single biggest predictor of AI visibility (r=0.71): structured FAQ markup. Brands with 20+ FAQ entries showed a 3.2× higher citation rate vs. those relying on traditional SEO content alone.

Schema alone won't fix invisibility, but it's the cheapest lever we've measured.`,
  empathy: `Totally feel this — we hear it from almost every brand we onboard. Months of content, zero AI surface area, and no clear feedback loop on what's actually wrong.

The honest answer: AI engines read your content very differently from Google. Most "SEO-optimized" pages are still invisible to them because the structure doesn't match how LLMs retrieve facts.

If it helps, we put together a short diagnostic — happy to share what we usually look at first.`
};

window.ReplyPanel = function ReplyPanel({ post, onClose }) {
  const [outerStep, setOuterStep] = useState(1); // 1 = Generate Draft, 2 = Select Account
  const [strategy, setStrategy] = useState("expert");
  const [mention, setMention] = useState("aisee — AI visibility tracker");
  const [intensity, setIntensity] = useState(2);
  const [draft, setDraft] = useState("");
  const [generating, setGenerating] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("a1");
  const [scheduling, setScheduling] = useState(false);
  const [sent, setSent] = useState(false);

  // Reset state when post changes
  useEffect(() => {
    setOuterStep(1);
    setStrategy("expert");
    setMention("aisee — AI visibility tracker");
    setIntensity(2);
    setDraft("");
    setGenerating(false);
    setSent(false);
  }, [post?.id]);

  const generate = () => {
    setGenerating(true);
    setDraft("");
    const target = DRAFTS_BY_STRATEGY[strategy];
    let i = 0;
    const tick = () => {
      i += Math.max(3, Math.floor(target.length / 30));
      setDraft(target.slice(0, i));
      if (i < target.length) {
        setTimeout(tick, 28);
      } else {
        setGenerating(false);
      }
    };
    setTimeout(tick, 350);
  };

  const send = () => {
    setSent(true);
    setTimeout(() => {onClose();setSent(false);}, 1100);
  };

  const intensityLabels = ["Don't mention", "Subtle", "Natural", "Direct"];
  const intensityLabel = intensityLabels[intensity];

  if (!post) return null;

  const hasDraft = draft.length > 0;
  const canContinue = outerStep === 1 ? hasDraft : true;

  const ACCOUNTS = [
    { id: "a1", handle: "@aisee_official", role: "Brand account", followers: "8.2K" },
    { id: "a2", handle: "@geo_insights", role: "Content account", followers: "3.1K" }
  ];

  return (
    <div className="reply-panel slide-in" key={post.id}>
      <div className="rp-head">
        <div className="ttl">Generate reply</div>
        <div className="rp-post-meta">
          <span style={{ display: "inline-flex" }}>
            {post.platform === "x" ?
              <span className="platform-pill" style={{ width: 18, height: 18 }}><PlatformX size={9} /></span> :
              <span className="platform-pill r" style={{ width: 18, height: 18 }}><PlatformR /></span>}
          </span>
          <span>{post.user.handle}</span>
          <span className="dot">·</span>
          <span>{post.time} ago</span>
        </div>
        <button className="rp-close" onClick={onClose} aria-label="Close">{icons.x(16)}</button>
      </div>

      {/* OUTER step indicator — 2 macro steps side by side */}
      <div className="rp-outer-steps">
        <div className={`rp-outer-step ${outerStep === 1 ? "current" : (outerStep > 1 ? "done" : "")}`}>
          <span className="rp-outer-num">{outerStep > 1 ? icons.check(11) : "1"}</span>
          <div className="rp-outer-text">
            <div className="rp-outer-ttl">Generate Draft</div>
            <div className="rp-outer-sub">Strategy &amp; content</div>
          </div>
        </div>
        <div className="rp-outer-connector"></div>
        <div className={`rp-outer-step ${outerStep === 2 ? "current" : "pending"}`}>
          <span className="rp-outer-num">2</span>
          <div className="rp-outer-text">
            <div className="rp-outer-ttl">Select account</div>
            <div className="rp-outer-sub">Select where to publish</div>
          </div>
        </div>
      </div>

      <div className="rp-preview">
        <div className="who">
          <span className="av">{post.user.avatar}</span>
          <b>{post.user.handle}</b>
          {post.user.followers && <span className="meta">{post.user.followers}</span>}
        </div>
        <div className="body">{post.body}</div>
      </div>

      {outerStep === 1 && <>
        {/* Step 1 — Reply Strategy */}
        <div className="rp-step">
          <div className="rp-step-header">
            <span className="rp-step-num">1</span>
            <span className="rp-step-title">Reply Strategy</span>
            <span className="rp-step-hint">How the reply is structured</span>
          </div>
          <div className="strategy-grid">
            {STRATEGIES.map((s) =>
              <button
                key={s.id}
                className={`strategy-card ${strategy === s.id ? "on" : ""}`}
                onClick={() => setStrategy(s.id)}>
                <div className="ttl">{s.ttl}</div>
                <div className="sub">{s.sub}</div>
              </button>
            )}
          </div>
        </div>

        {/* Step 2 — Mention Intensity (now contains "What to mention" + slider) */}
        <div className="rp-step">
          <div className="rp-step-header">
            <span className="rp-step-num">2</span>
            <span className="rp-step-title">Mention Intensity</span>
            <span className="rp-step-hint">What to bring up &amp; how hard</span>
          </div>

          <div className="rp-field-card">
            <label className="rp-field-label">What to mention</label>
            <div className="rp-text-input">
              <input
                placeholder="Your product, brand, or angle"
                value={mention}
                onChange={(e) => setMention(e.target.value)} />
            </div>

            <div className="rp-slider-row">
              <span className="rp-slider-lbl">How Strongly</span>
              <span className="rp-slider-val">{intensityLabel}</span>
            </div>
            <div className="intensity-track" onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - r.left) / r.width;
              setIntensity(Math.max(0, Math.min(3, Math.round(pct * 3))));
            }}>
              <div className="bar"></div>
              <div className="fill" style={{ width: `${intensity / 3 * 100}%` }}></div>
              <div className="knob" style={{ left: `${intensity / 3 * 100}%` }}></div>
            </div>
            <div className="intensity-ticks">
              {intensityLabels.map((l, i) =>
                <span key={i} className={i === intensity ? "active" : ""}>{l}</span>
              )}
            </div>
            <div className="rp-field-hint">
              {icons.info(11)} Woven into the reply where it genuinely fits the answer.
            </div>
          </div>
        </div>

        {/* Draft / placeholder */}
        {hasDraft ?
          <div className="rp-step">
            <div className="rp-step-header">
              <span className="rp-step-num" style={{ background: "var(--primary)", color: "var(--black)" }}>
                {icons.check(11)}
              </span>
              <span className="rp-step-title">AI Draft</span>
              <span className="rp-step-hint">{draft.length} chars</span>
            </div>
            <div className="rp-draft">
              <textarea value={draft} onChange={(e) => setDraft(e.target.value)} />
            </div>
            <button className="gen-cta regen" onClick={generate}>
              {icons.refresh(12)} Regenerate with current settings
            </button>
          </div> :
          generating ?
          <div className="draft-placeholder generating">
            <span className="gen-dot"></span>
            <span className="gen-dot"></span>
            <span className="gen-dot"></span>
            <span style={{ marginLeft: 6 }}>Generating draft…</span>
          </div> :
          <div className="draft-placeholder">
            <div className="ico">{icons.edit(16)}</div>
            <div>Pick a strategy, optionally guide the angle, set intensity — then generate.</div>
          </div>
        }
      </>}

      {outerStep === 2 && <>
        <div className="rp-step">
          <div className="rp-step-header">
            <span className="rp-step-num">·</span>
            <span className="rp-step-title">Choose account</span>
            <span className="rp-step-hint">Where to publish this reply</span>
          </div>
          <div className="rp-account-list">
            {ACCOUNTS.map((a) =>
              <button
                key={a.id}
                className={`rp-account-row ${selectedAccount === a.id ? "on" : ""}`}
                onClick={() => setSelectedAccount(a.id)}>
                <span className={`rp-radio ${selectedAccount === a.id ? "on" : ""}`}>
                  {selectedAccount === a.id && <span className="dot"></span>}
                </span>
                <span className="av">{a.handle[1].toUpperCase()}</span>
                <div className="info">
                  <div className="handle">{a.handle}</div>
                  <div className="role">{a.role} · {a.followers} followers</div>
                </div>
                <span className="plat">
                  {post.platform === "x" ? <PlatformX size={11} /> : <PlatformR />}
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="rp-final-preview">
          <div className="rp-final-label">Final reply</div>
          <div className="rp-final-body">{draft}</div>
        </div>
      </>}

      {/* Bottom actions */}
      <div className="rp-actions">
        {outerStep === 1 ?
          <>
            <button className="btn-ghost" onClick={onClose}>Skip</button>
            <div style={{ flex: 1 }}></div>
            {!hasDraft ?
              <button className="btn-primary" onClick={generate} disabled={generating}>
                {generating ? <>Generating…</> : <>{icons.bolt(13)} Generate Draft</>}
              </button> :
              <button className="btn-primary" onClick={() => setOuterStep(2)}>
                Continue {icons.arrowR(13)}
              </button>
            }
          </> :
          <>
            <button className="btn-ghost" onClick={() => setOuterStep(1)}>← Back</button>
            <div style={{ flex: 1 }}></div>
            <button className="btn-secondary" onClick={() => setScheduling(true)}>
              {icons.schedule(13)} Schedule
            </button>
            <button className="btn-primary" onClick={send}>
              {sent ? "Sent ✓" : <>Send reply {icons.send(13)}</>}
            </button>
          </>
        }
      </div>

      {scheduling &&
      <div
        onClick={() => setScheduling(false)}
        style={{
          position: "absolute", inset: 0,
          background: "rgba(17,17,17,0.4)",
          backdropFilter: "blur(2px)",
          borderRadius: 12,
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          padding: 16, zIndex: 10
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
          width: "100%", background: "var(--white)",
          border: "1px solid var(--border-modal)",
          borderRadius: 12, padding: "16px",
          boxShadow: "var(--shadow-modal)"
        }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Schedule reply</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {["In 30 min", "In 2 hours", "Tomorrow 9am", "Custom…"].map((s, i) =>
            <button key={i} className="btn-secondary" style={{ justifyContent: "center" }}>{s}</button>
            )}
            </div>
          </div>
        </div>
      }
    </div>);

};

// ── Main Page 02 export ────────────────────────────────────────
window.SignalFeed = function SignalFeed({ onResetConfig }) {
  const [activeTab, setActiveTab] = useState("signal");
  const [source, setSource] = useState("all");
  const [saved, setSaved] = useState(false);
  const [status, setStatus] = useState("all"); // all | unread | sent | expired
  const [refine, setRefine] = useState({
    scoreHigh: "all",   // quick chip: score >= 85
    platformHeat: "all", // quick chip: high heat
    intent: "all",      // post type (single)
    accountInfluence: "all", // follower size (single)
    recency: "all",     // posted within (single)
    accounts: [],       // multi
    keywords: [],       // multi
    subreddits: []      // multi
  });
  const [sort, setSort] = useState("score");
  const [selectedId, setSelectedId] = useState("p1");
  const [favs, setFavs] = useState(new Set());

  const toggleFav = (id) => setFavs((s) => {
    const n = new Set(s);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const filtered = FEED_DATA.filter((p) => {
    if (source === "x" && p.platform !== "x") return false;
    if (source === "reddit" && p.platform !== "reddit") return false;
    if (saved && !favs.has(p.id)) return false;
    if (status !== "all" && getStatus(p) !== status) return false;
    // Priority chips (High score / High heat) are OR-combined with each other:
    // if any chip is on, the post only needs to match ONE of them ("show me what's worth looking at").
    const scoreOn = refine.scoreHigh === "on";
    const heatOn = refine.platformHeat === "high";
    if (scoreOn || heatOn) {
      const passScore = scoreOn && p.score >= 85;
      const passHeat = heatOn && p.platformHeat === "high";
      if (!(passScore || passHeat)) return false;
    }
    if (refine.intent !== "all" && p.intent !== refine.intent) return false;
    if (refine.accountInfluence !== "all" && p.accountInfluence !== refine.accountInfluence) return false;
    if (refine.recency !== "all" && p.recency !== refine.recency) return false;
    if (refine.accounts.length && !refine.accounts.includes(p.user.handle)) return false;
    if (refine.keywords.length && !refine.keywords.includes(p.keywordHit)) return false;
    if (refine.subreddits.length && (!p.subreddit || !refine.subreddits.includes(p.subreddit))) return false;
    return true;
  });

  // sort
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "newest") {
      return (a.ageH ?? parseInt(a.time)) - (b.ageH ?? parseInt(b.time));
    }
    if (sort === "heat") {
      const aE = (a.stats.likes || a.stats.upvotes) + (a.stats.replies || a.stats.comments);
      const bE = (b.stats.likes || b.stats.upvotes) + (b.stats.replies || b.stats.comments);
      return bE - aE;
    }
    return b.score - a.score;
  });

  const totals = {
    all: FEED_DATA.length,
    x: FEED_DATA.filter((p) => p.platform === "x").length,
    reddit: FEED_DATA.filter((p) => p.platform === "reddit").length
  };

  // Status counts respect platform + saved scope (not status itself)
  const statusScope = FEED_DATA.filter((p) => {
    if (source === "x" && p.platform !== "x") return false;
    if (source === "reddit" && p.platform !== "reddit") return false;
    if (saved && !favs.has(p.id)) return false;
    return true;
  });
  const statusCounts = {
    all: statusScope.length,
    unread: statusScope.filter((p) => getStatus(p) === "unread").length,
    sent: statusScope.filter((p) => getStatus(p) === "sent").length,
    expired: statusScope.filter((p) => getStatus(p) === "expired").length
  };

  const selectedPost = sorted.find((p) => p.id === selectedId) || FEED_DATA.find((p) => p.id === selectedId);
  const showPanel = !!selectedPost && activeTab === "signal";

  const resetRefine = () => setRefine({
    scoreHigh: "all", platformHeat: "all", intent: "all",
    accountInfluence: "all", recency: "all",
    accounts: [], keywords: [], subreddits: []
  });

  // Facets available for multi-select filtering, derived from the feed
  const facets = {
    accounts: Array.from(new Map(FEED_DATA.map((p) => [p.user.handle, p])).values())
      .map((p) => ({ id: p.user.handle, label: p.user.handle })),
    keywords: Array.from(new Set(FEED_DATA.map((p) => p.keywordHit)))
      .map((k) => ({ id: k, label: k })),
    subreddits: Array.from(new Set(FEED_DATA.filter((p) => p.subreddit).map((p) => p.subreddit)))
      .map((s) => ({ id: s, label: s }))
  };

  // Live counts for the quick priority chips, within the current platform+saved+status scope
  const quickCounts = {
    highScore: statusScope.filter((p) => (status === "all" || getStatus(p) === status) && p.score >= 85).length,
    hot: statusScope.filter((p) => (status === "all" || getStatus(p) === status) && p.platformHeat === "high").length
  };

  return (
    <div className="fade-in">
      {/* Engage banner — compact 76px lavender bar (no tabs inside) */}
      <div className="engage-banner" style={{ borderRadius: "16px", borderWidth: "4px", borderStyle: "solid", color: "rgb(255, 255, 255)", padding: "12px 16px" }}>
        <div className="engage-banner-top">
          <div className="icon-bubble">
            <img src={window.__resources && window.__resources.engageIcon || "engage/engage-icon.svg"} alt="" />
          </div>
          <div className="titles">
            <h1>Engage</h1>
            <div className="sub">Monitor and reply to relevant conversations across X and Reddit.</div>
          </div>
          <div className="banner-stats">
            <div className="banner-stat">
              <span className="lbl">New</span>
              <span className="num">{totals.all}</span>
            </div>
            <div className="banner-stat">
              <span className="lbl">Keywords</span>
              <span className="num">6</span>
            </div>
            <div className="banner-stat">
              <span className="lbl">Accounts</span>
              <span className="num">3</span>
            </div>
            <div className="banner-stat">
              <span className="lbl">Sent</span>
              <span className="num">3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs row — sits BETWEEN banner and content, not inside */}
      <div className="page-tabs">
        <button
          className={`page-tab ${activeTab === "signal" ? "on" : ""}`}
          onClick={() => setActiveTab("signal")}>
          Signal Feed <span className="count">{totals.all}</span>
        </button>
        <button
          className={`page-tab ${activeTab === "keywords" ? "on" : ""}`}
          onClick={() => setActiveTab("keywords")}>
          Keywords &amp; Accounts
        </button>
        <button
          className={`page-tab ${activeTab === "sent" ? "on" : ""}`}
          onClick={() => setActiveTab("sent")}>
          Sent <span className="count">3</span>
        </button>
      </div>

      {activeTab === "signal" &&
      <>
          <FilterBar
          source={source} setSource={setSource}
          saved={saved} setSaved={setSaved}
          savedCount={favs.size}
          refine={refine} setRefine={setRefine}
          onReset={resetRefine}
          totals={totals}
          sort={sort} setSort={setSort}
          status={status} setStatus={setStatus}
          statusCounts={statusCounts}
          quickCounts={quickCounts}
          facets={facets} />
        
          <div className="feed-meta-row">
            <span>
              Showing <b>{sorted.length}</b> of {totals.all} opportunities
              {sort !== "score" && <> · sorted by <b>{sort}</b></>}
            </span>
            <span className="feed-meta-spacer"></span>
            <span className="feed-sync-meta">
              <span className="sync-dot"></span>
              Last sync <b>2m ago</b> <span className="sep">·</span> Next in <b>23h 58m</b>
            </span>
          </div>
          <div className={`feed-shell ${showPanel ? "" : "no-panel"}`}>
            <div className="feed-list">
              {sorted.length === 0 ?
            <div style={{
              padding: "56px 24px", textAlign: "center",
              background: "var(--white)", borderRadius: 12, border: "1px solid var(--border)"
            }}>
                  <div style={{ fontSize: 14, color: "var(--muted)" }}>No matches for these filters.</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                    Try clearing a refine option or switching source.
                  </div>
                  <button className="btn-secondary" style={{ marginTop: 16 }} onClick={resetRefine}>
                    {icons.reset(12)} Clear refine filters
                  </button>
                </div> :
            sorted.map((post) =>
            <FeedCard
              key={post.id}
              post={post}
              selected={selectedId === post.id}
              onSelect={setSelectedId}
              onGenerate={setSelectedId}
              fav={favs.has(post.id)}
              onFav={toggleFav} />

            )}
            </div>

            {showPanel &&
          <ReplyPanel
            post={selectedPost}
            onClose={() => setSelectedId(null)} />

          }
          </div>
        </>
      }

      {activeTab === "keywords" && <KeywordsAccounts />}

      {activeTab === "sent" && <SentPage />}

      <button className="reset-link" onClick={onResetConfig}>
        ↺ Reset to initial setup (demo)
      </button>
    </div>);

};