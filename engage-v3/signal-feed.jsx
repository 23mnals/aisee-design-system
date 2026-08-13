/* global React, icons, PlatformX, PlatformR */
const { useState, useEffect, useRef } = React;

// ── Sample feed data ───────────────────────────────────────────
const FEED_DATA = [
{
  id: "p1",
  platform: "x",
  intent: "Help-seeking",
  intentVariant: "intent",
  time: "1h",
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
  recency: "fresh", // fresh (<3h) | recent (<12h) | older
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
  score: 87,
  actionTag: "Manual reply",
  user: { handle: "u/digital_mktg_pro", followersN: 0, avatar: "d" },
  body: "Does GEO (Generative Engine Optimization) actually work? Been trying to get our SaaS mentioned by ChatGPT for months. Tried FAQ schema, structured data… nothing moves the needle. Anyone cracked this?",
  tags: ["GEO", "Hot 847↑"],
  stats: { upvotes: 847, comments: 156 },
  keywordQuality: "high",
  platformHeat: "high",
  accountInfluence: "low",
  recency: "fresh",
  isPriority: false,
  keywordHit: "GEO"
},
{
  id: "p3",
  platform: "x",
  intent: "Hot take",
  intentVariant: "opinion",
  time: "5h",
  score: 82,
  user: { handle: "@ai_marketing_hub", followers: "45.2K followers", followersN: 45200, avatar: "A" },
  body: "Hot take: Traditional SEO is dead. AI search visibility will be the #1 marketing priority for B2B SaaS in 2025. Most companies have zero idea how AI perceives their brand right now.",
  tags: ["GEO", "Big account"],
  stats: { likes: 1200, replies: 89 },
  keywordQuality: "medium",
  platformHeat: "medium",
  accountInfluence: "high",
  recency: "recent",
  isPriority: true,
  keywordHit: "AI search visibility"
},
{
  id: "p4",
  platform: "reddit",
  intent: "Comparison",
  intentVariant: "compare",
  subreddit: "r/marketing",
  time: "6h",
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
  recency: "recent",
  isPriority: false,
  keywordHit: "Semrush AI"
},
{
  id: "p5",
  platform: "x",
  intent: "Data share",
  intentVariant: "data",
  time: "8h",
  score: 71,
  user: { handle: "@growth_metrics", followers: "8.9K followers", followersN: 8900, avatar: "g" },
  body: "Just analyzed 200 B2B brands across ChatGPT, Perplexity & Claude. Only 18% had consistent brand mentions across all 3. The gap between SEO presence and AI presence is wider than most realize.",
  tags: ["Data point"],
  stats: { likes: 412, replies: 28 },
  keywordQuality: "medium",
  platformHeat: "low",
  accountInfluence: "medium",
  recency: "older",
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
function FilterDropdown({ label, value, options, onChange, inline }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {if (ref.current && !ref.current.contains(e.target)) setOpen(false);};
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const current = options.find((o) => o.id === value);
  const isSet = value && value !== "all";

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
              <span className="pill-clear" onClick={(e) => {e.stopPropagation();onChange("all");}} aria-label="Clear">
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
        
        <span className="lbl-text">{label}</span>
        <span className="val">{current?.label || "All"}</span>
        {isSet &&
        <span className="fdd-clear" onClick={(e) => {e.stopPropagation();onChange("all");}} aria-label="Clear">
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
  { id: "fresh", label: "< 3h" },
  { id: "recent", label: "< 12h" },
  { id: "older", label: "12h+" }],

  priority: [
  { id: "all", label: "All accounts" },
  { id: "on", label: "Priority only" }]

};

// ── Platform Picker (combined dropdown) ────────────────────────
function PlatformPicker({ source, setSource, totals }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onDoc = (e) => {if (ref.current && !ref.current.contains(e.target)) setOpen(false);};
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const labelMap = { all: "All Platform", x: "X", reddit: "Reddit" };
  const count = source === "x" ? totals.x : source === "reddit" ? totals.reddit : totals.all;

  return (
    <div className="platform-picker" ref={ref}>
      <button
        className={`pp-trigger ${open ? "open" : ""}`}
        onClick={() => setOpen((o) => !o)}>
        <span className="pp-label">{labelMap[source]}</span>
        <span className="pp-badge">{count}</span>
        <span className="pp-caret">{icons.chevronDown(12)}</span>
      </button>
      {open &&
        <div className="fdd-menu" style={{ minWidth: 180 }}>
          <button className={`fdd-item ${source === "all" ? "on" : ""}`}
            onClick={() => {setSource("all");setOpen(false);}}>
            <span>All Platform</span>
            <span className="desc">{totals.all}</span>
          </button>
          <button className={`fdd-item ${source === "x" ? "on" : ""}`}
            onClick={() => {setSource("x");setOpen(false);}}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <PlatformX size={11} /> X
            </span>
            <span className="desc">{totals.x}</span>
          </button>
          <button className={`fdd-item ${source === "reddit" ? "on" : ""}`}
            onClick={() => {setSource("reddit");setOpen(false);}}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <PlatformR /> Reddit
            </span>
            <span className="desc">{totals.reddit}</span>
          </button>
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
  sort, setSort
}) {
  const refineActive = Object.values(refine).filter((v) => v && v !== "all").length;

  return (
    <div className="filter-bar">
      <div className="filter-row">
        {/* LEFT — platform picker + sync */}
        <PlatformPicker source={source} setSource={setSource} totals={totals} />

        <span className="sync-pulse" aria-hidden="true">
          <span className="sync-dot"></span>
        </span>
        <span className="sync-text">
          Last sync <b>2m ago</b> <span className="sep">·</span> Next in <b>23h 58m</b>
        </span>

        <div className="filter-spacer"></div>

        <span className="filters-label">Filters:</span>

        <FilterDropdown
          label="Keywords"
          inline
          value={refine.keywordQuality}
          options={FILTER_OPTS.keywordQuality}
          onChange={(v) => setRefine({ ...refine, keywordQuality: v })} />

        <FilterDropdown
          label="Account reach"
          inline
          value={refine.accountInfluence}
          options={FILTER_OPTS.accountInfluence}
          onChange={(v) => setRefine({ ...refine, accountInfluence: v })} />

        <FilterDropdown
          label="Platform heat"
          inline
          value={refine.platformHeat}
          options={FILTER_OPTS.platformHeat}
          onChange={(v) => setRefine({ ...refine, platformHeat: v })} />

        <FilterDropdown
          label="Recency"
          inline
          value={refine.recency}
          options={FILTER_OPTS.recency}
          onChange={(v) => setRefine({ ...refine, recency: v })} />

        <FilterDropdown
          label="Tracked accounts"
          inline
          value={refine.priority}
          options={FILTER_OPTS.priority}
          onChange={(v) => setRefine({ ...refine, priority: v })} />

        {refineActive > 0 &&
          <button className="fdd-reset" onClick={onReset}>
            {icons.reset(11)} Clear {refineActive}
          </button>
        }
      </div>
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
  const [refine, setRefine] = useState({
    keywordQuality: "all",
    platformHeat: "all",
    accountInfluence: "all",
    recency: "all",
    priority: "all"
  });
  const [sort, setSort] = useState("relevance");
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
    if (refine.keywordQuality !== "all" && p.keywordQuality !== refine.keywordQuality) return false;
    if (refine.platformHeat !== "all" && p.platformHeat !== refine.platformHeat) return false;
    if (refine.accountInfluence !== "all" && p.accountInfluence !== refine.accountInfluence) return false;
    if (refine.recency !== "all" && p.recency !== refine.recency) return false;
    if (refine.priority === "on" && !p.isPriority) return false;
    return true;
  });

  // sort
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "newest") {
      const ah = parseInt(a.time);
      const bh = parseInt(b.time);
      return ah - bh;
    }
    if (sort === "engagement") {
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

  const selectedPost = sorted.find((p) => p.id === selectedId) || FEED_DATA.find((p) => p.id === selectedId);
  const showPanel = !!selectedPost && activeTab === "signal";

  const resetRefine = () => setRefine({
    keywordQuality: "all", platformHeat: "all",
    accountInfluence: "all", recency: "all", priority: "all"
  });

  return (
    <div className="fade-in">
      {/* Engage banner — compact 76px lavender bar (no tabs inside) */}
      <div className="engage-banner" style={{ borderRadius: "16px", borderWidth: "4px", borderStyle: "solid", color: "rgb(255, 255, 255)", padding: "12px 16px" }}>
        <div className="engage-banner-top">
          <div className="icon-bubble">
            <img src={window.__resources && window.__resources.engageIcon || "engage-v3/engage-icon.svg"} alt="" />
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
          sort={sort} setSort={setSort} />
        
          <div style={{ padding: "10px 32px 0", fontSize: 12, color: "var(--muted)" }}>
            Showing <b style={{ color: "var(--black)" }}>{sorted.length}</b> of {totals.all} opportunities
            {sort !== "relevance" && <> · sorted by <b style={{ color: "var(--black)" }}>{sort}</b></>}
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