/* global React, window */
/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// feed-card.jsx → app/(pages)/engage/_components/feed-card.tsx
// ─────────────────────────────────────────────────────────────────────────────

const { cn, Button } = window;
const I = window.Icons;

// Intent tag colour map (uses repo palette only)
const INTENT_BG = {
  intent:  "bg-purple-fae2fe",
  opinion: "bg-[#DCEEFF]",          // blue-soft (not in repo palette but neutral)
  discuss: "bg-yellow-f7f6e9",      // cream
  compare: "bg-yellow-fffadd",
  data:    "bg-yellow-f7f6e9",
};

const EXTRA_BG = {
  brand:       "bg-yellow-fff2b3",
  competitor:  "bg-red-ffd0d0",
  painpoint:   "bg-red-fdebe4",
};

window.FeedCard = function FeedCard({ post, selected, onSelect, onGenerate }) {
  const intentBg = INTENT_BG[post.intentVariant] || "bg-primary/[0.05]";

  return (
    <article
      onClick={() => onSelect(post.id)}
      className={cn(
        "bg-white rounded-xl border p-4 pl-[18px] pr-[18px] cursor-pointer transition-all",
        selected
          ? "border-primary outline outline-4 outline-yellow-ffe253"
          : "border-primary/[0.05] hover:border-primary/[0.18]"
      )}
    >
      {/* Top row: platform pill / intent tag / sub / action / score */}
      <div className="flex items-center gap-2 mb-2.5">
        {post.platform === "x" ? (
          <span className="w-[22px] h-[22px] rounded-md bg-primary text-white inline-flex items-center justify-center">
            <I.PlatformX size={11} />
          </span>
        ) : (
          <span className="w-[22px] h-[22px] rounded-md bg-red-ec5212 text-white inline-flex items-center justify-center text-[11px] font-bold">
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

        {post.actionTag && (
          <span className="inline-flex items-center h-[22px] px-2 rounded-full text-[11px] font-semibold bg-yellow-ffe253 text-primary">
            {post.actionTag}
          </span>
        )}

        <span className="ml-auto flex items-center gap-2.5 text-[12px] text-primary/60">
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

      {/* Bottom row: tags / stats / CTA */}
      <div className="flex items-center gap-2">
        {post.tags.map((t, i) => {
          const cls = i === 1 && post.extraTagClass ? EXTRA_BG[post.extraTagClass] : "bg-primary/[0.05]";
          return (
            <span key={i} className={cn("inline-flex items-center h-[22px] px-2 rounded-full text-[11px] font-medium", cls)}>
              {t}
            </span>
          );
        })}
        <div className="flex-1" />
        <div className="text-primary/60 text-[12px] flex items-center gap-3">
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
        <Button
          variant={selected ? "primary" : "secondary"}
          onClick={(e) => { e.stopPropagation(); onGenerate(post.id); }}
          className="h-8 px-3.5 text-[13px] font-semibold"
        >
          Generate Reply <I.ArrowRight className="w-3 h-3" />
        </Button>
      </div>
    </article>
  );
};
