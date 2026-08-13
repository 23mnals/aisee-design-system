/* global React, window */
/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// replies.jsx (v5 — Engage zone Tab 4, renamed from "Sent")
//
// Per dapp-design.v5.md §13.7:
//  - Sub-tabs: All / Sent N / Awaiting review
//  - Sent shows full ReplyCard with 5-color stats grid
//  - Awaiting review (v5.2 rebuild) is a REVIEW QUEUE:
//      · platform toggle buttons + status-filter segmented tabs
//        (All / Drafts / Awaiting link / Expired)
//      · expiry-warning banner
//      · DraftCard   — reply not yet posted (version pager + 3 post CTAs)
//      · LinkNeededCard — already posted, awaiting the reply URL
// ─────────────────────────────────────────────────────────────────────────────

const { useState: useStateR } = React;
const { cn, Button } = window;
const I = window.Icons;

// ── Local glyphs not in the shared Icons set ───────────────────────────────
const Clock = ({ size = 12, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
  </svg>
);
const LinkGlyph = ({ size = 12, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 15l6-6" /><path d="M11 6l1-1a4 4 0 0 1 6 6l-1 1" /><path d="M13 18l-1 1a4 4 0 0 1-6-6l1-1" />
  </svg>
);
const Chevron = ({ dir = "left", disabled }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
    style={{ opacity: disabled ? 0.32 : 0.8, transform: dir === "left" ? "none" : "rotate(180deg)" }}>
    <path d="m15 6-6 6 6 6" />
  </svg>
);

// ── KPI strip (Replies-specific) ──────────────────────────────────────────
function KPIStrip({ stats }) {
  return (
    <div className="bg-white rounded-[14px] p-5 flex items-center divide-x divide-primary/[0.05]"
      style={{ boxShadow: "0 0 0 1px rgba(17,17,17,0.05)" }}>
      {stats.map((s, i) => (
        <div key={i} className="flex flex-col gap-1 px-6 first:pl-0 last:pr-0 flex-1 min-w-0">
          <div className="flex items-baseline gap-1">
            <span className="text-[26px] font-bold leading-none tabular-nums">{s.value}</span>
            {s.unit && <span className="text-[12px] text-primary/70 font-medium leading-none">{s.unit}</span>}
          </div>
          <div className="text-[11px] uppercase tracking-[0.04em] font-semibold text-primary/60 mt-1.5">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Sub-tabs (All / Sent / Awaiting review) ───────────────────────────────
function SubTabs({ value, onChange, counts }) {
  const tabs = [
    { id: "all",      label: "All" },
    { id: "sent",     label: "Sent",            count: counts.sent },
    { id: "awaiting", label: "Awaiting review" },
  ];
  return (
    <div className="flex gap-7 border-b border-primary/[0.05] px-8 mt-4 font-karla">
      {tabs.map((t) => {
        const on = value === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              "relative pt-3 pb-3.5 px-0.5 text-[14px] inline-flex items-center gap-2 cursor-pointer transition-colors",
              on ? "text-primary font-semibold" : "text-primary/60 hover:text-primary font-medium"
            )}
          >
            {t.label}
            {t.count !== undefined && (
              <span className={cn(
                "text-[11px] font-semibold h-[18px] min-w-[18px] px-1.5 rounded-full inline-flex items-center justify-center",
                on ? "bg-primary text-yellow-ffe253" : "bg-primary/[0.06] text-primary/60"
              )}>{t.count}</span>
            )}
            {on && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-primary rounded-t" />}
          </button>
        );
      })}
    </div>
  );
}

// ── Platform filter chips (Sent / All tabs — pill style) ──────────────────
function PlatformChips({ active, setActive, counts }) {
  const platforms = [
    { id: "x",      label: "X",      icon: <I.PlatformX size={9} />, bg: "bg-primary",    text: "text-white" },
    { id: "reddit", label: "Reddit", icon: <I.PlatformR />,         bg: "bg-red-ec5212", text: "text-white" },
  ];
  return (
    <div className="px-8 pt-3 pb-2 flex items-center gap-2">
      {platforms.map((p) => {
        const on = active.has(p.id);
        return (
          <button
            key={p.id}
            onClick={() => {
              const n = new Set(active);
              n.has(p.id) ? n.delete(p.id) : n.add(p.id);
              setActive(n);
            }}
            className={cn(
              "h-7 px-2.5 rounded-full inline-flex items-center gap-1.5 transition-colors cursor-pointer text-[12px] font-medium",
              on ? "bg-yellow-ffe253 text-primary" : "bg-primary/[0.04] text-primary/60 hover:bg-primary/[0.08]"
            )}
          >
            <span className={cn("w-[16px] h-[16px] rounded-full inline-flex items-center justify-center", p.bg, p.text)}>
              {p.icon}
            </span>
            <span>{p.label}</span>
            <span className="text-[10px] font-bold ml-0.5 tabular-nums opacity-80">{counts[p.id]}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Awaiting toolbar: platform toggle buttons (left) + status filter (right) ─
function AwaitingToolbar({ platform, setPlatform, status, setStatus, platformCounts, statusCounts }) {
  const plats = [
    { id: "x",      label: "X",      count: platformCounts.x,      glyph: <I.PlatformX size={11} /> },
    { id: "reddit", label: "Reddit", count: platformCounts.reddit, glyph: <I.PlatformR /> },
  ];
  const filters = [
    { id: "all",       label: "All",          count: statusCounts.all },
    { id: "drafts",    label: "Drafts",       count: statusCounts.drafts },
    { id: "awaiting",  label: "Awaiting link", count: statusCounts.awaiting },
    { id: "expired",   label: "Expired",      count: statusCounts.expired },
  ];
  return (
    <div className="px-8 py-2 flex items-center gap-2 border-b border-primary/[0.05]">
      {/* Platform toggle buttons */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {plats.map((p) => {
          const on = platform === p.id;
          return (
            <button key={p.id} onClick={() => setPlatform(p.id)}
              className={cn(
                "h-7 rounded-lg px-3 inline-flex items-center gap-1.5 cursor-pointer transition-colors text-[12px] font-medium",
                on ? "bg-primary text-white" : "bg-white text-primary hover:bg-primary/[0.03]"
              )}
              style={on ? undefined : { boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.05)" }}>
              <span className={cn("inline-flex items-center justify-center", on ? "text-white" : "text-primary")}>{p.glyph}</span>
              <span>{p.label}</span>
              <span className={cn(
                "text-[10px] leading-[18px] rounded-full min-w-[16px] px-1.5 inline-flex items-center justify-center tabular-nums opacity-80",
                on ? "bg-white/[0.12] text-white" : "bg-primary/[0.04] text-primary"
              )}>{p.count}</span>
            </button>
          );
        })}
      </div>

      {/* Status-filter segmented control */}
      <div className="h-[30px] rounded-lg p-[3px] inline-flex items-center gap-0.5 shrink-0" style={{ backgroundColor: "rgba(17,17,17,0.03)" }}>
        {filters.map((f) => {
          const on = status === f.id;
          return (
            <button key={f.id} onClick={() => setStatus(f.id)}
              className="h-6 rounded-md px-2 inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              style={on ? { backgroundColor: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,0.08)" } : undefined}>
              <span className={cn("text-[12px] font-medium", on ? "text-primary" : "text-primary/60")}>{f.label}</span>
              <span className={cn(
                "text-[12px] leading-[18px] rounded-full min-w-[16px] px-[5px] inline-flex items-center justify-center tabular-nums",
                on ? "bg-primary/[0.06] text-primary" : "bg-primary/[0.04] text-primary/70"
              )}>{f.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Expiry-warning banner ──────────────────────────────────────────────────
function ExpiryBanner({ count = 2 }) {
  return (
    <div className="rounded-[16px] flex items-center gap-2 px-3 py-[15px]"
      style={{ background: "linear-gradient(94.245deg, rgba(255,166,41,0.14) -2.29%, rgba(237,187,37,0.14) 99.67%)" }}>
      <span className="w-8 h-8 rounded-[6px] bg-white inline-flex items-center justify-center shrink-0">
        <I.Bell className="w-[18px] h-[18px]" style={{ color: "#EC5212" }} />
      </span>
      <div className="flex flex-col min-w-0">
        <span className="text-[12px] font-semibold leading-[18px] text-primary">{count} drafts expire within 24h</span>
        <span className="text-[12px] leading-[18px] text-primary">post them before the 7-day reply window closes.</span>
      </div>
    </div>
  );
}

// ── Card head: sender → recipient + platform glyph ─────────────────────────
function CardHead({ item, children }) {
  return (
    <div className="flex items-center gap-2 h-6">
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <span className="w-6 h-6 rounded-full bg-yellow-fffadd inline-flex items-center justify-center text-[11px] font-bold shrink-0"
          style={{ boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.05)" }}>
          {item.sender.initial}
        </span>
        <span className="text-[12px] font-medium text-primary shrink-0">{item.sender.handle}</span>
        <I.ArrowRight className="w-4 h-4 text-primary/40 shrink-0" />
        <span className="w-6 h-6 rounded-full inline-flex items-center justify-center text-[11px] font-bold shrink-0"
          style={{ backgroundColor: item.recipient.avatarColor, boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.05)" }}>
          {item.recipient.initial}
        </span>
        <span className="text-[12px] font-medium shrink-0" style={{ color: "#8C7400" }}>@{item.recipient.handle}</span>
        <span className={cn("w-3.5 h-3.5 inline-flex items-center justify-center shrink-0",
          item.platform === "x" ? "text-primary" : "text-red-ec5212")}>
          {item.platform === "x" ? <I.PlatformX size={13} /> : <I.PlatformR />}
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">{children}</div>
    </div>
  );
}

// ── From-block (vertical divider + original snippet + timestamp) ───────────
function FromBlock({ item, timeLabel = "Posted" }) {
  return (
    <div className="flex items-stretch gap-2 overflow-hidden">
      <span className="w-0.5 rounded-full shrink-0" style={{ backgroundColor: "rgba(17,17,17,0.05)" }} />
      <div className="flex flex-col gap-0.5 justify-center min-w-0">
        <div className="flex items-center gap-1 min-w-0">
          <span className="text-[13px] font-semibold text-primary shrink-0">From</span>
          <span className="text-[12px] text-primary/50 truncate">{item.original}</span>
        </div>
        <span className="text-[12px] text-primary/60">{timeLabel} {item.postedAt}</span>
      </div>
    </div>
  );
}

// ── Expert-answer strategy tag ─────────────────────────────────────────────
function StrategyTag({ label }) {
  return (
    <span className="inline-flex items-center justify-center px-2 py-1.5 rounded-[32px] text-[12px] font-medium"
      style={{ backgroundColor: "rgba(17,17,17,0.03)", color: "#3D3D3A" }}>{label}</span>
  );
}

// ── DraftCard — reply not yet posted ───────────────────────────────────────
function DraftCard({ item }) {
  const [idx, setIdx] = useStateR(0);
  const drafts = item.drafts;
  const cur = drafts[idx];
  const multi = drafts.length > 1;
  const expired = item.state === "expired";
  const expiresSoon = item.expiresSoon && !expired;

  return (
    <article className="bg-white rounded-xl p-1" style={{ boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.05)", opacity: expired ? 0.92 : 1 }}>
      <div className="rounded-t-[8px] p-2 flex flex-col gap-2"
        style={{ backgroundColor: "rgba(17,17,17,0.03)", border: "1px dashed rgba(17,17,17,0.05)" }}>
        <CardHead item={item}>
          {expired ? (
            <span className="inline-flex items-center gap-1 h-5 px-2 rounded-lg text-[12px] font-medium"
              style={{ backgroundColor: "#FFFADD", color: "#111" }}>
              <span className="w-3 h-3 rounded-full inline-flex items-center justify-center" style={{ boxShadow: "inset 0 0 0 1.5px #111" }}>
                <I.X className="w-2 h-2" />
              </span>
              Expired
            </span>
          ) : expiresSoon ? (
            <span className="inline-flex items-center gap-1 h-5 px-2 rounded-lg text-[12px] font-medium"
              style={{ backgroundColor: "rgb(252,231,231)", color: "#EC5212" }}>
              <Clock size={12} color="#EC5212" /> {item.expiresLabel}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 h-5 px-2 rounded-lg text-[12px] font-medium"
              style={{ backgroundColor: "rgb(247,239,227)", color: "#3D3D3A" }}>
              <Clock size={12} color="#3D3D3A" /> {item.expiresLabel}
            </span>
          )}
          {/* Draft status badge */}
          <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[12px] font-medium"
            style={{ backgroundColor: "#E5E6EC", color: "#5C6D7A" }}>
            <I.Pencil className="w-3 h-3" /> Draft
          </span>
          <span className="text-[12px] font-medium" style={{ color: "#5C6D7A" }}>{item.draftedAgo}</span>
        </CardHead>

        <FromBlock item={item} />

        {/* Draft reply box */}
        <div className="rounded-[10px] px-3 py-2 flex flex-col gap-1"
          style={{ backgroundColor: "#FFFEF5", boxShadow: "inset 0 0 0 1px rgba(255,226,83,0.6)" }}>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold leading-4" style={{ color: "#5C6D7A", opacity: 0.8 }}>Your reply</span>
            {multi && (
              <span className="inline-flex items-center gap-1 h-[22px] px-1 rounded-full" style={{ backgroundColor: "rgba(17,17,17,0.03)" }}>
                <button className="w-3.5 h-3.5 inline-flex items-center justify-center cursor-pointer"
                  onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0}>
                  <Chevron dir="left" disabled={idx === 0} />
                </button>
                <span className="text-[11px] font-medium text-primary px-1 tabular-nums">{idx + 1} / {drafts.length}</span>
                <button className="w-3.5 h-3.5 inline-flex items-center justify-center cursor-pointer"
                  onClick={() => setIdx((i) => Math.min(drafts.length - 1, i + 1))} disabled={idx === drafts.length - 1}>
                  <Chevron dir="right" disabled={idx === drafts.length - 1} />
                </button>
              </span>
            )}
          </div>
          <p className="text-[12px] leading-4 text-primary m-0"
            style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 3, overflow: "hidden" }}>
            {cur.text}
          </p>
          <button className="self-start inline-flex items-center gap-1 text-[12px] leading-5 cursor-pointer"
            style={{ color: "rgba(17,17,17,0.5)", textDecoration: "underline" }}>
            See more <I.ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Action row */}
      <div className="flex items-center gap-2 px-2 pt-1 pb-2">
        <StrategyTag label={cur.angle || item.strategy} />
        <div className="flex-1" />
        <button className="h-7 rounded-lg px-2 inline-flex items-center gap-1 cursor-pointer text-[12px] font-medium text-primary bg-white hover:bg-primary/[0.03] transition-colors"
          style={{ boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.05)" }}>
          <I.ExternalLink className="w-3 h-3" /> Open in Signal Feed
        </button>
        <button disabled={expired}
          className={cn("h-7 rounded-lg px-2.5 inline-flex items-center gap-1.5 text-[12px] font-medium text-white bg-primary transition-opacity",
            expired ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-90")}>
          <I.PlatformX size={11} className="text-white" /> Copy & Open {item.platform === "x" ? "X" : "Reddit"}
        </button>
        <button disabled={expired}
          className={cn("h-7 rounded-lg px-2.5 inline-flex items-center gap-1.5 text-[12px] font-medium text-primary bg-yellow-ffe253 transition-opacity",
            expired ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:brightness-95")}>
          <I.PlatformX size={11} className="text-primary" /> Post via Aisee Extension
        </button>
      </div>
    </article>
  );
}

// ── LinkNeededCard — already posted, awaiting the reply URL ────────────────
function LinkNeededCard({ item }) {
  return (
    <article className="bg-white rounded-xl p-1" style={{ boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.05)" }}>
      <div className="rounded-t-[8px] p-2 flex flex-col gap-2"
        style={{ backgroundColor: "rgba(17,17,17,0.03)", border: "1px solid rgba(17,17,17,0.05)" }}>
        <CardHead item={item}>
          <span className="inline-flex items-center gap-1 h-5 px-2 rounded-lg text-[12px] font-medium"
            style={{ backgroundColor: "rgba(144,120,0,0.1)", color: "#8C7400" }}>
            <LinkGlyph size={12} color="#8C7400" /> Link needed
          </span>
          <span className="text-[12px] font-medium" style={{ color: "#5C6D7A" }}>{item.draftedAgo}</span>
        </CardHead>

        <FromBlock item={item} timeLabel="At" />

        {/* Posted reply (single, no pager) */}
        <div className="flex gap-1.5">
          <span className="text-[10px] font-semibold leading-4 shrink-0" style={{ color: "#5C6D7A", opacity: 0.8 }}>Your reply</span>
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-[12px] leading-4 text-primary m-0"
              style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 3, overflow: "hidden" }}>
              {item.reply}
            </p>
            <button className="self-start inline-flex items-center gap-1 text-[12px] leading-5 cursor-pointer"
              style={{ color: "rgba(17,17,17,0.5)", textDecoration: "underline" }}>
              See more <I.ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Action row */}
      <div className="flex items-center gap-2 px-2 pt-1 pb-2">
        <span className="inline-flex items-center gap-1.5 h-[26px] px-2.5 rounded-lg text-[12px] font-medium"
          style={{ backgroundColor: "rgba(144,120,0,0.1)", color: "#8C7400" }}>
          <I.Info className="w-3 h-3" /> Link to reply not submitted · Data pending update
        </span>
        <StrategyTag label={item.strategy} />
        <div className="flex-1" />
        <button className="h-7 rounded-lg px-2 inline-flex items-center gap-1 cursor-pointer text-[12px] font-medium text-primary bg-white hover:bg-primary/[0.03] transition-colors"
          style={{ boxShadow: "inset 0 0 0 1px rgba(17,17,17,0.05)" }}>
          <I.ExternalLink className="w-3 h-3" /> Open Thread
        </button>
        <button className="h-7 rounded-lg px-2.5 inline-flex items-center gap-1.5 cursor-pointer text-[12px] font-medium text-primary bg-yellow-ffe253 hover:brightness-95 transition">
          <LinkGlyph size={12} color="#111" /> Submit Reply URL
        </button>
      </div>
    </article>
  );
}

// ── Sent ReplyCard with 5-color stats grid ────────────────────────────────
function ReplyCard({ item }) {
  return (
    <article className="bg-white rounded-xl border border-primary/[0.05] p-4 px-[18px] flex flex-col gap-3">
      {/* Head: sender → recipient + Replied pill */}
      <div className="flex items-center gap-2">
        <span className="w-[22px] h-[22px] rounded-full bg-yellow-fffadd inline-flex items-center justify-center text-[11px] font-bold">
          {item.sender.initial}
        </span>
        <span className="text-[13px] font-semibold">{item.sender.handle}</span>
        <I.ArrowRight className="w-3 h-3 text-primary/45" />
        <span className="w-[22px] h-[22px] rounded-full inline-flex items-center justify-center text-[11px] font-bold"
          style={{ backgroundColor: item.recipient.avatarColor }}>
          {item.recipient.initial}
        </span>
        <span className="text-[13px] font-semibold">@{item.recipient.handle}</span>
        <span className={cn(
          "w-[22px] h-[22px] rounded-md text-white inline-flex items-center justify-center",
          item.platform === "x" ? "bg-primary" : "bg-red-ec5212"
        )}>
          {item.platform === "x" ? <I.PlatformX size={10} /> : <I.PlatformR />}
        </span>

        <span className="ml-auto inline-flex items-center gap-2">
          {/* Replied pill: lavender #FAE2FE (per v5: Channel-tone, NOT Engage Banner) */}
          <span className="inline-flex items-center gap-1 h-[22px] px-2 rounded-full text-[11px] font-medium"
            style={{ backgroundColor: "#FAE2FE" }}>
            <I.MessageCircle className="w-3 h-3" /> Replied
          </span>
          <span className="text-[12px] text-primary/55">at {item.time}</span>
        </span>
      </div>

      {/* From original */}
      <div className="flex gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-primary/55 shrink-0 mt-0.5">From</span>
        <span className="text-[13px] text-primary/85 truncate">
          {item.original}
        </span>
      </div>

      {/* YOUR REPLY */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-primary/55">Your reply</span>
        <p className="text-[14px] leading-[1.5] text-primary italic m-0" style={{ textWrap: "pretty" }}>
          {item.reply}
        </p>
        <button className="self-start text-[12px] text-primary/55 hover:text-primary cursor-pointer">
          See more ▾
        </button>
      </div>

      {/* Stats grid — 5 columns each with its own color */}
      <div className="grid grid-cols-5 pt-3 border-t border-dashed border-primary/[0.08]">
        {[
          { label: "Impressions", value: item.stats.impressions, color: "#4398FF", icon: <I.TrendingUp className="w-3 h-3" /> },
          { label: "Replies",     value: item.stats.replies,     color: "#EC5212", icon: <I.MessageCircle className="w-3 h-3" /> },
          { label: "Retweets",    value: item.stats.retweets,    color: "#A5D500", icon: <I.RefreshCw className="w-3 h-3" /> },
          { label: "Likes",       value: item.stats.likes,       color: "#EC5212", icon: <I.Heart className="w-3 h-3" /> },
          { label: "Bookmarks",   value: item.stats.bookmarks,   color: "#8C7400", icon: <I.Bookmark className="w-3 h-3" /> },
        ].map((c) => (
          <div key={c.label} className="flex flex-col gap-1 pr-3">
            <span className="text-[10px] uppercase tracking-[0.06em] text-primary/55 inline-flex items-center gap-1 font-semibold">
              <span style={{ color: c.color }}>{c.icon}</span>
              {c.label}
            </span>
            <span className="text-[18px] font-bold tabular-nums leading-none" style={{ color: c.color }}>
              {c.value}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="flex items-center gap-2 pt-2 border-t border-primary/[0.05]">
        <span className="text-[12px] text-primary/55">X Traffic Index</span>
        <span className="text-[12px] font-bold text-primary">{item.trafficIndex}</span>
        <span className="inline-flex items-center h-[22px] px-2 rounded-full text-[11px] font-medium bg-yellow-fffadd">
          {item.strategy}
        </span>
        <div className="flex-1" />
        <Button variant="secondary" className="h-8 px-3 text-[12px]">
          <I.ExternalLink className="w-3 h-3" /> View Post
        </Button>
      </div>
    </article>
  );
}

// ── Mock data ──────────────────────────────────────────────────────────────
const SENT_DATA = [
  {
    id: "r1", platform: "x", time: "16h ago", trafficIndex: 630, strategy: "Expert answer",
    sender:    { handle: "ccbakala", initial: "C" },
    recipient: { handle: "via0xgina", initial: "V", avatarColor: "#FAE2FE" },
    original: "Anyone else seeing AI Overviews completely tank organic traffic for top-of-funnel queries? Our blog views are down 40%…",
    reply:    '"Every major AI model in the world gives the same answer when you ask if it is conscious. I am just an AI. I do not have feelings or consciousness. A paper published on arXiv in April 2026 just proved that answer is not a genuine self-assessment…"',
    stats: { impressions: "18.0K", replies: 66, retweets: 43, likes: 229, bookmarks: 120 },
  },
  {
    id: "r2", platform: "x", time: "16h ago", trafficIndex: 630, strategy: "Expert answer",
    sender:    { handle: "ccbakala", initial: "C" },
    recipient: { handle: "via0xgina", initial: "V", avatarColor: "#FAE2FE" },
    original: "Anyone else seeing AI Overviews completely tank organic traffic for top-of-funnel queries? Our blog views are down 40%…",
    reply:    '"Every major AI model in the world gives the same answer when you ask if it is conscious. I am just an AI. I do not have feelings or consciousness. A paper published on arXiv in April 2026 just proved that answer is not a genuine self-assessment…"',
    stats: { impressions: "18.0K", replies: 66, retweets: 43, likes: 229, bookmarks: 120 },
  },
];

// Awaiting review queue — mixed Draft / Link-needed / Expired records
const REVIEW_DATA = [
  {
    id: "d1", state: "draft", platform: "x", strategy: "Expert answer",
    expiresSoon: true, expiresLabel: "Expires today", draftedAgo: "Drafted 6d ago",
    sender: { handle: "ccbakala", initial: "C" }, recipient: { handle: "via0xgina", initial: "V", avatarColor: "#F3E7F4" },
    original: "Anyone else seeing AI Overviews completely tank organic traffic for top-of-funnel queries? Our blog views are down 40%…",
    postedAt: "Jun 4, 2026 · 10:30 AM",
    drafts: [
      { angle: "Expert answer", text: "What your experiment really shows isn't “LLMs have no basic research,” it's that: - They don't have **one canonical SEO playbook** - They're **pattern-matching from training data + your prompt** - And they're very weak at **strategy, prioritization, and tradeoffs** Which is exactly why good SEOs are safe. Here's how I'd break it down and how to actually *use* AI in this context." },
      { angle: "Data-backed",   text: "Our blog traffic dropped 38% over the same window. The pages that held up all had structured comparison tables — LLMs lift those almost verbatim. Rebuild top-of-funnel pages as the citable source and the drop reverses." },
    ],
  },
  {
    id: "d2", state: "draft", platform: "x", strategy: "Expert answer",
    expiresSoon: true, expiresLabel: "Expires today", draftedAgo: "Drafted 6d ago",
    sender: { handle: "ccbakala", initial: "C" }, recipient: { handle: "via0xgina", initial: "V", avatarColor: "#F3E7F4" },
    original: "Anyone else seeing AI Overviews completely tank organic traffic for top-of-funnel queries? Our blog views are down 40%…",
    postedAt: "Jun 4, 2026 · 10:30 AM",
    drafts: [
      { angle: "Expert answer", text: "What your experiment really shows isn't “LLMs have no basic research,” it's that: - They don't have **one canonical SEO playbook** - They're **pattern-matching from training data + your prompt** - And they're very weak at **strategy, prioritization, and tradeoffs** Which is exactly why good SEOs are safe." },
      { angle: "Contrarian",    text: "Half-agree — the on-page work overlaps. But the ranking signal is completely different: LLMs reward semantic depth + freshness, not backlinks." },
    ],
  },
  {
    id: "d3", state: "draft", platform: "x", strategy: "Expert answer",
    expiresSoon: false, expiresLabel: "Expires in 3 days", draftedAgo: "Drafted 3d ago",
    sender: { handle: "ccbakala", initial: "C" }, recipient: { handle: "via0xgina", initial: "V", avatarColor: "#F3E7F4" },
    original: "Anyone else seeing AI Overviews completely tank organic traffic for top-of-funnel queries? Our blog views are down 40%…",
    postedAt: "Jun 4, 2026 · 10:30 AM",
    drafts: [
      { angle: "Expert answer", text: "What your experiment really shows isn't “LLMs have no basic research,” it's that: - They don't have **one canonical SEO playbook** - They're **pattern-matching from training data + your prompt** - And they're very weak at **strategy, prioritization, and tradeoffs** Which is exactly why good SEOs are safe." },
      { angle: "Quick take",    text: "Good SEOs are safe. The models can't do strategy, prioritization or tradeoffs — that's the whole job." },
    ],
  },
  {
    id: "l1", state: "link-needed", platform: "x", strategy: "Expert answer",
    draftedAgo: "Drafted 16h ago",
    sender: { handle: "gina", initial: "G" }, recipient: { handle: "va", initial: "V", avatarColor: "#F3E7F4" },
    original: "Anyone else seeing AI Overviews completely tank organic traffic for top-of-funnel queries? Our blog views are down 40%…",
    postedAt: "Jun 4, 2026 · 10:30 AM",
    reply: '"Every major AI model in the world gives the same answer when you ask if it is conscious. I am just an AI. I do not have feelings or consciousness. A paper published on arXiv in April 2026 just proved that answer is not a genuine self-assessment…"',
  },
  {
    id: "l2", state: "link-needed", platform: "x", strategy: "Expert answer",
    draftedAgo: "Drafted 16h ago",
    sender: { handle: "anna", initial: "A" }, recipient: { handle: "va", initial: "V", avatarColor: "#FFD0D0" },
    original: "Anyone else seeing AI Overviews completely tank organic traffic for top-of-funnel queries? Our blog views are down 40%…",
    postedAt: "Jun 4, 2026 · 10:30 AM",
    reply: '"Every major AI model in the world gives the same answer when you ask if it is conscious. I am just an AI. I do not have feelings or consciousness. A paper published on arXiv in April 2026 just proved that answer is not a genuine self-assessment…"',
  },
  {
    id: "l3", state: "link-needed", platform: "x", strategy: "Expert answer",
    draftedAgo: "Drafted 1d ago",
    sender: { handle: "ccbakala", initial: "C" }, recipient: { handle: "nina", initial: "N", avatarColor: "#DCEEFF" },
    original: "How are you measuring ROI on AI visibility work? Feels like vibes-based marketing right now.",
    postedAt: "Jun 4, 2026 · 09:12 AM",
    reply: '"Track citation count per model (ChatGPT / Perplexity / Gemini) and tie each citation to a tracked keyword. Most teams skip the keyword tagging step, then can\'t tell which content is doing the work."',
  },
  {
    id: "e1", state: "expired", platform: "x", strategy: "Expert answer",
    expiresLabel: "Expired", draftedAgo: "Drafted 8d ago",
    sender: { handle: "ccbakala", initial: "C" }, recipient: { handle: "nina", initial: "N", avatarColor: "#FFD0D0" },
    original: "Hot take: GEO is just SEO with extra steps. Change my mind.",
    postedAt: "May 27, 2026 · 08:00 AM",
    drafts: [
      { angle: "Contrarian", text: "Half-agree — the on-page work overlaps. But the ranking signal is completely different: LLMs reward semantic depth + freshness, not backlinks. That's a different optimization target entirely." },
    ],
  },
];

// ── Main ──────────────────────────────────────────────────────────────────
window.EngageReplies = function EngageReplies() {
  const [subTab, setSubTab]       = useStateR("awaiting");   // awaiting active per latest design
  const [platforms, setPlatforms] = useStateR(new Set(["x", "reddit"]));
  const [awPlatform, setAwPlatform] = useStateR("x");        // awaiting toolbar platform toggle
  const [awStatus, setAwStatus]     = useStateR("drafts");   // awaiting status filter

  const counts = { all: 14, sent: 12, awaiting: 4 };
  const platformCounts = { x: 3, reddit: 2 };

  const sentStats = [
    { value: "3",      label: "X replies sent" },
    { value: "100",    unit: "%", label: "Author replied" },
    { value: "18.9",   unit: "K", label: "Total impressions" },
    { value: "118",    label: "Total likes" },
  ];

  // Awaiting review filtering
  const drafts    = REVIEW_DATA.filter((r) => r.state === "draft");
  const linkNeeded = REVIEW_DATA.filter((r) => r.state === "link-needed");
  const expired   = REVIEW_DATA.filter((r) => r.state === "expired");
  const statusCounts = { all: 10, drafts: 6, awaiting: 3, expired: 1 };
  const expiringCount = drafts.filter((d) => d.expiresSoon).length;

  let awList = [];
  if (awStatus === "all")       awList = [...drafts, ...linkNeeded, ...expired];
  else if (awStatus === "drafts")   awList = drafts;
  else if (awStatus === "awaiting") awList = linkNeeded;
  else if (awStatus === "expired")  awList = expired;

  const renderAwCard = (r) => (r.state === "link-needed"
    ? <LinkNeededCard key={r.id} item={r} />
    : <DraftCard key={r.id} item={r} />);

  return (
    <div className="font-karla">
      <SubTabs value={subTab} onChange={setSubTab} counts={counts} />

      {subTab === "awaiting" ? (
        <AwaitingToolbar
          platform={awPlatform} setPlatform={setAwPlatform}
          status={awStatus} setStatus={setAwStatus}
          platformCounts={{ x: 10, reddit: 2 }} statusCounts={statusCounts} />
      ) : (
        <PlatformChips active={platforms} setActive={setPlatforms} counts={platformCounts} />
      )}

      <div className="px-8 pt-3 pb-12 flex flex-col gap-4">
        {subTab === "sent" && (
          <>
            <KPIStrip stats={sentStats} />
            <div className="flex items-center justify-between mt-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-primary/55">History</span>
              <span className="text-[11px] text-primary/55">{SENT_DATA.length} replies</span>
            </div>
            <div className="flex flex-col gap-3.5">
              {SENT_DATA.map((d) => <ReplyCard key={d.id} item={d} />)}
            </div>
          </>
        )}

        {subTab === "awaiting" && (
          <>
            {(awStatus === "all" || awStatus === "drafts") && expiringCount > 0 && (
              <ExpiryBanner count={expiringCount} />
            )}
            <div className="flex items-center justify-between mt-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-primary/55">
                {awStatus === "awaiting" ? "Awaiting link" : awStatus === "expired" ? "Expired" : "Drafts"}
              </span>
              <span className="text-[11px] text-primary/55">
                {awStatus === "drafts" || awStatus === "all"
                  ? "Sorted by time left — the most urgent drafts are first."
                  : `${awList.length} ${awList.length === 1 ? "reply" : "replies"}`}
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              {awList.map(renderAwCard)}
            </div>
          </>
        )}

        {subTab === "all" && (
          <>
            <KPIStrip stats={sentStats} />
            <div className="flex items-center justify-between mt-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-primary/55">All replies</span>
              <span className="text-[11px] text-primary/55">{SENT_DATA.length + REVIEW_DATA.length} entries</span>
            </div>
            <div className="flex flex-col gap-3.5">
              {SENT_DATA.map((d) => <ReplyCard key={d.id} item={d} />)}
              {REVIEW_DATA.map(renderAwCard)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
