/* global React, window */
/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// sent-tab.jsx → app/(pages)/engage/_components/sent-tab.tsx
//
// Shows sent replies with engagement stats. Reuses the same card + tag styles
// as the Signal Feed for visual consistency.
// ─────────────────────────────────────────────────────────────────────────────

const { cn, Button } = window;
const I = window.Icons;

function StatCard({ value, suffix, label }) {
  return (
    <div className="bg-white border border-primary/[0.05] rounded-xl px-4 py-3.5 flex flex-col gap-1">
      <div className="flex items-baseline gap-1">
        <span className="text-[26px] font-bold tabular-nums">{value}</span>
        {suffix && <span className="text-[12px] text-primary/60 font-medium">{suffix}</span>}
      </div>
      <div className="text-[11px] uppercase tracking-[0.06em] text-primary/60 font-semibold">{label}</div>
    </div>
  );
}

function SentCard({ item }) {
  return (
    <article className="bg-white rounded-xl border border-primary/[0.05] p-4 pl-[18px] pr-[18px] flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {item.platform === "x" ? (
          <span className="w-[22px] h-[22px] rounded-md bg-primary text-white inline-flex items-center justify-center">
            <I.PlatformX size={11} />
          </span>
        ) : (
          <span className="w-[22px] h-[22px] rounded-md bg-red-ec5212 text-white inline-flex items-center justify-center"><I.PlatformR /></span>
        )}
        <span className="w-[22px] h-[22px] rounded-full bg-primary/[0.08] inline-flex items-center justify-center text-[11px] font-semibold">
          {item.user.avatar}
        </span>
        <span className="text-[13px] font-semibold">{item.user.handle}</span>
        <span className="text-[12px] text-primary/60">· {item.user.name}</span>

        <span className="inline-flex items-center h-[22px] px-2 rounded-full text-[11px] font-medium bg-yellow-fffadd text-primary">
          {item.strategy}
        </span>

        <span className="ml-auto inline-flex items-center gap-2 text-[12px] text-primary/60">
          {item.replied ? (
            <span className="inline-flex items-center gap-1 text-green-92bc01 font-semibold">
              <I.Check className="w-3 h-3" /> Replied
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-primary/60">
              <I.Send className="w-3 h-3" /> Posted
            </span>
          )}
          <span>· {item.time} ago</span>
        </span>
      </div>

      <div className="text-[14px] leading-[1.5] text-primary italic" style={{ textWrap: "pretty" }}>
        {item.body}
      </div>

      <div className="grid grid-cols-5 gap-2 pt-2 border-t border-dashed border-primary/[0.05]">
        <div className="flex flex-col gap-0.5">
          <div className="text-[11px] uppercase tracking-[0.04em] text-primary/60">Impressions</div>
          <div className="text-[15px] font-bold tabular-nums">{item.stats.impressions}</div>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="text-[11px] uppercase tracking-[0.04em] text-primary/60 inline-flex items-center gap-1"><I.Heart className="w-2.5 h-2.5" /> Likes</div>
          <div className="text-[15px] font-bold tabular-nums">{item.stats.likes}</div>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="text-[11px] uppercase tracking-[0.04em] text-primary/60 inline-flex items-center gap-1"><I.RefreshCw className="w-2.5 h-2.5" /> Reposts</div>
          <div className="text-[15px] font-bold tabular-nums">{item.stats.retweets}</div>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="text-[11px] uppercase tracking-[0.04em] text-primary/60 inline-flex items-center gap-1"><I.MessageCircle className="w-2.5 h-2.5" /> Replies</div>
          <div className="text-[15px] font-bold tabular-nums">{item.stats.replies}</div>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="text-[11px] uppercase tracking-[0.04em] text-primary/60 inline-flex items-center gap-1"><I.Bookmark className="w-2.5 h-2.5" /> Bookmarks</div>
          <div className="text-[15px] font-bold tabular-nums">{item.stats.bookmarks}</div>
        </div>
      </div>
    </article>
  );
}

window.SentTab = function SentTab() {
  const D = window.EngageData;
  return (
    <div className="px-8 pt-5 pb-12 flex flex-col gap-4 font-karla">
      {/* Overview stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard value="12" label="Sent this week" />
        <StatCard value="72.4" suffix="K" label="Total impressions" />
        <StatCard value="1.2" suffix="K" label="Total engagements" />
        <StatCard value="1.66" suffix="%" label="Engagement rate" />
      </div>

      <div className="flex items-center gap-2 mt-2">
        <span className="text-[13px] font-semibold">All sent replies</span>
        <span className="text-[12px] text-primary/60">· {D.sent.length} entries</span>
        <div className="flex-1" />
        <Button variant="outlined" className="h-8 px-3 text-[12px]">
          <I.Filter className="w-3 h-3" /> Filter
        </Button>
      </div>

      <div className="flex flex-col gap-3.5">
        {D.sent.map((s) => <SentCard key={s.id} item={s} />)}
      </div>
    </div>
  );
};
