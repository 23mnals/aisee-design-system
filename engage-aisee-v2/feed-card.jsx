/* global React, window */
/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// feed-card.jsx (v5 — adds Replied / Expired states + hover tooltip)
//
// v5 additions per dapp-design.v5.md §13.5.3:
//   - Replied state: lavender pill (#FAE2FE — NOT Engage banner #F3E7F4)
//   - Expired state: yellow pill + tooltip "This post is over 7 days old"
//   - Selected card: 1px black border + 4px outline yellow halo
// ─────────────────────────────────────────────────────────────────────────────

const { useState: useStateFC } = React;
const { cn, Button } = window;
const I = window.Icons;

const INTENT_BG = {
  intent:  "bg-purple-fae2fe",
  opinion: "bg-[#DCEEFF]",
  discuss: "bg-yellow-f7f6e9",
  compare: "bg-yellow-fffadd",
  data:    "bg-yellow-f7f6e9",
};
const EXTRA_BG = {
  brand:       "bg-yellow-fff2b3",
  competitor:  "bg-red-ffd0d0",
  painpoint:   "bg-red-fdebe4",
};

window.FeedCard = function FeedCard({ post, selected, onSelect, onGenerate }) {
  const [tooltipOpen, setTooltipOpen] = useStateFC(false);

  const intentBg = INTENT_BG[post.intentVariant] || "bg-primary/[0.05]";
  const isExpired = post.expired;
  const isReplied = post.replied;

  return (
    <article
      onClick={() => onSelect(post.id)}
      onMouseEnter={() => isExpired && setTooltipOpen(true)}
      onMouseLeave={() => setTooltipOpen(false)}
      className={cn(
        "relative bg-white rounded-xl border p-4 px-[18px] cursor-pointer transition-all",
        selected
          ? "border-primary outline outline-4 outline-yellow-ffe253"
          : "border-primary/[0.05] hover:border-primary/[0.18]",
        isExpired && "opacity-[0.92]"
      )}
    >
      {/* Expired hover tooltip */}
      {isExpired && tooltipOpen && (
        <div className="absolute -top-2 left-4 -translate-y-full z-30 animate-fade-in">
          <div className="bg-primary text-white px-3.5 py-2.5 rounded-lg text-[13px] shadow-[0_10px_12px_rgba(0,0,0,0.12)] whitespace-nowrap">
            This post is over 7 days old — the reply window has closed.
            <div className="absolute -bottom-1 left-6 w-2 h-2 bg-primary rotate-45" />
          </div>
        </div>
      )}

      {/* Top row */}
      <div className="flex items-center gap-2 mb-2.5 flex-wrap">
        {post.platform === "x" ? (
          <span className="w-[22px] h-[22px] rounded-md bg-primary text-white inline-flex items-center justify-center">
            <I.PlatformX size={11} />
          </span>
        ) : (
          <span className="w-[22px] h-[22px] rounded-md bg-red-ec5212 text-white inline-flex items-center justify-center">
            <I.PlatformR />
          </span>
        )}

        <span className={cn("inline-flex items-center h-[22px] px-2 rounded-full text-[11px] font-medium", intentBg)}>
          {post.intent}
        </span>

        {post.subreddit && (
          <span className="inline-flex items-center h-[22px] px-2 rounded-full text-[11px] font-medium bg-white border border-primary/[0.05] text-primary/60">
            {post.subreddit}
          </span>
        )}

        {/* v5 state pills */}
        {isReplied && (
          <span className="inline-flex items-center gap-1 h-[22px] px-2 rounded-full text-[11px] font-medium text-primary"
            style={{ backgroundColor: "#FAE2FE" }}>
            <I.MessageCircle className="w-3 h-3" /> Replied at {post.repliedAt || "Jun 4, 10:30 AM"}
          </span>
        )}
        {isExpired && (
          <span className="inline-flex items-center gap-1 h-[22px] px-2 rounded-full text-[11px] font-semibold bg-yellow-fffadd text-primary">
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="8" cy="8" r="6"/>
              <path d="M5 5l6 6M11 5l-6 6" strokeLinecap="round"/>
            </svg>
            Expired
          </span>
        )}

        {post.actionTag && !isReplied && !isExpired && (
          <span className="inline-flex items-center h-[22px] px-2 rounded-full text-[11px] font-semibold bg-yellow-ffe253 text-primary">
            {post.actionTag}
          </span>
        )}

        <span className="ml-auto flex items-center gap-2.5 text-[12px] text-primary/60 shrink-0">
          <span>{post.time} ago</span>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <I.ExternalLink className="w-3 h-3" /> Source
          </a>
          <span className="font-bold text-[16px] text-primary">{post.score}</span>
        </span>
      </div>

      {/* User row */}
      <div className="flex items-center gap-2 mb-2 text-[13px]">
        <span className="w-[22px] h-[22px] rounded-full bg-primary/[0.08] inline-flex items-center justify-center text-[11px] font-semibold">
          {post.user.avatar}
        </span>
        <span className="font-semibold">{post.user.handle}</span>
        {post.user.followers && (
          <>
            <span className="text-primary/60">·</span>
            <span className="text-primary/60">{post.user.followers}</span>
          </>
        )}
      </div>

      {/* Body */}
      <div className="text-[14px] leading-[1.5] text-primary mb-3" style={{ textWrap: "pretty" }}>
        {post.body}
      </div>

      {/* Bottom row */}
      <div className="flex items-center gap-2 flex-wrap">
        {post.tags.map((t, i) => {
          const cls = i === 1 && post.extraTagClass ? EXTRA_BG[post.extraTagClass] : "bg-primary/[0.05]";
          return (
            <span key={i} className={cn("inline-flex items-center h-[22px] px-2 rounded-full text-[11px] font-medium", cls)}>
              {t}
            </span>
          );
        })}
        <div className="flex-1" />
        <div className="text-primary/60 text-[12px] flex items-center gap-3 shrink-0">
          {post.platform === "x" ? (
            <>
              <span className="inline-flex items-center gap-1"><I.Heart className="w-3 h-3" /> {post.stats.likes}</span>
              <span className="inline-flex items-center gap-1"><I.MessageCircle className="w-3 h-3" /> {post.stats.replies}</span>
            </>
          ) : (
            <>
              <span className="inline-flex items-center gap-1"><I.ArrowUp className="w-3 h-3" /> {post.stats.upvotes}</span>
              <span className="inline-flex items-center gap-1"><I.MessageCircle className="w-3 h-3" /> {post.stats.comments}</span>
            </>
          )}
        </div>
        {isReplied ? (
          <button
            onClick={(e) => { e.stopPropagation(); onGenerate(post.id); }}
            className="h-8 px-3.5 inline-flex items-center gap-1 text-[13px] font-semibold text-primary/70 hover:text-primary cursor-pointer"
          >
            View Reply <I.ArrowRight className="w-3 h-3" />
          </button>
        ) : isExpired ? (
          <Button
            variant="secondary"
            disabled
            onClick={(e) => e.stopPropagation()}
            className="h-8 px-3.5 text-[13px] font-semibold opacity-50 cursor-not-allowed"
          >
            Generate Reply <I.ArrowRight className="w-3 h-3" />
          </Button>
        ) : (
          <Button
            variant={selected ? "primary" : "secondary"}
            onClick={(e) => { e.stopPropagation(); onGenerate(post.id); }}
            className="h-8 px-3.5 text-[13px] font-semibold"
          >
            Generate Reply <I.ArrowRight className="w-3 h-3" />
          </Button>
        )}
      </div>
    </article>
  );
};
