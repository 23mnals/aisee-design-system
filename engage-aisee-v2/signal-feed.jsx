/* global React, window */
/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// signal-feed.jsx (v5 — slimmed down; routing moved to sidebar)
//
// Renders ONLY the Signal Feed view: platform tabs + sync row + filter bar +
// feed cards + reply panel. PageTabs (Sent/Keywords) and EngageBanner are
// owned by page.jsx in v5.
// ─────────────────────────────────────────────────────────────────────────────

const { useState: useStateSF } = React;
const { cn, FilterBar, FeedCard, ReplyPanel, Button } = window;
const I = window.Icons;

// Option 3 — Inline plugin banner above the Signal Feed content.
// Lives only on Signal Feed because that's where the extension delivers value.
function PluginInlineBanner() {
  const [dismissed, setDismissed] = useStateSF(false);
  if (dismissed) return null;
  return (
    <div className="mx-8 mt-3 rounded-xl bg-purple-f3e7f4 px-4 py-3 flex items-center gap-3.5">
      <span className="shrink-0 w-9 h-9 rounded-lg bg-white inline-flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-primary">
          <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.302.515.08.876.532 1.073 1.013a2.5 2.5 0 1 0 3.259-3.259c-.482-.197-.933-.558-1.014-1.073-.05-.336.062-.676.302-.916l1.525-1.525A2.402 2.402 0 0 1 11.998 2c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z"/>
        </svg>
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-primary leading-tight">Reply without leaving the tab you're already on</div>
        <div className="text-[11.5px] text-primary/65 leading-snug mt-0.5">Install the aisee browser extension to draft replies inline on X and Reddit.</div>
      </div>
      <button className="h-8 px-3.5 rounded-lg bg-primary text-white text-[12.5px] font-medium hover:bg-primary/90 transition-colors cursor-pointer inline-flex items-center gap-1.5">
        Install for Chrome
      </button>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="w-7 h-7 inline-flex items-center justify-center rounded-md text-primary/40 hover:text-primary hover:bg-white/70 transition-colors cursor-pointer"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
      </button>
    </div>
  );
}

// ── Top platform mini-tabs (All / X / Reddit + Sort) ───────────────────────
function PlatformMiniTabs({ source, setSource, totals, sortBy, setSortBy, sortDir, setSortDir }) {
  const tabs = [
    { id: "all",    label: "All",    count: totals.all },
    { id: "x",      label: "X",      count: totals.x,      icon: <I.PlatformX size={9}/> },
    { id: "reddit", label: "Reddit", count: totals.reddit, icon: <I.PlatformR/> },
  ];
  return (
    <div className="px-8 pt-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        {tabs.map((t) => {
          const on = source === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSource(t.id)}
              className={cn(
                "relative pt-1 pb-2 inline-flex items-center gap-1.5 cursor-pointer transition-colors text-[14px]",
                on ? "text-primary font-semibold" : "text-primary/60 hover:text-primary font-medium"
              )}
            >
              {t.icon && (
                <span className={cn(
                  "w-[16px] h-[16px] rounded-md inline-flex items-center justify-center text-white",
                  t.id === "reddit" ? "bg-red-ec5212" : "bg-primary"
                )}>{t.icon}</span>
              )}
              {t.label}
              <span className="text-[11px] font-medium text-primary/55 tabular-nums">{t.count.toLocaleString()}</span>
              {on && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-primary rounded-t" />}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2 text-[12px]">
        <button className="h-7 px-2.5 rounded-lg border border-primary/[0.05] bg-white inline-flex items-center gap-1.5 hover:border-primary/[0.18] cursor-pointer transition-colors">
          <span className="uppercase text-primary/55 text-[10px] tracking-wider">Sort by</span>
          <span className="font-semibold">Score</span>
          <I.ChevronDown className="w-3 h-3" />
        </button>
        <button
          onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
          className="h-7 w-7 rounded-lg border border-primary/[0.05] bg-white inline-flex items-center justify-center hover:border-primary/[0.18] cursor-pointer transition-colors"
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d={sortDir === "asc" ? "M2 8.5h8M3 6h6M4.5 3.5h3" : "M2 3.5h8M3 6h6M4.5 8.5h3"}
              stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── Sync status row (replaces v4's separate stripe) ───────────────────────
function SyncRow() {
  return (
    <div className="px-8 mt-2 flex items-center gap-2 text-[12px]">
      <span className="text-primary/60">
        <b className="text-primary font-semibold">3320</b> feeds total ·
        <b className="text-primary font-semibold"> 12</b> new since your last visit ·
        Last sync <b className="text-primary font-semibold">1m ago</b> ·
        Next in <b className="text-primary font-semibold">23h 58m</b>
      </span>
      <div className="flex-1" />
      <button className="h-7 px-3 rounded-lg border border-primary/[0.05] bg-white inline-flex items-center gap-1.5 hover:border-primary/[0.18] cursor-pointer transition-colors text-[12px] font-medium">
        <I.RefreshCw className="w-3 h-3" /> Sync now
      </button>
    </div>
  );
}

// ── Main Signal Feed view ─────────────────────────────────────────────────
window.SignalFeed = function SignalFeed({ onResetConfig }) {
  const D = window.EngageData;

  const [source, setSource]       = useStateSF("all");
  const [selectedId, setSelectedId] = useStateSF("p1");
  const [selectedScore,      setSelectedScore]      = useStateSF("all");
  const [selectedKeywords,   setSelectedKeywords]   = useStateSF(new Set());
  const [selectedStatus,     setSelectedStatus]     = useStateSF(new Set());
  const [selectedIntents,    setSelectedIntents]    = useStateSF(new Set());
  const [selectedAccounts,   setSelectedAccounts]   = useStateSF(new Set());
  const [selectedSubreddits, setSelectedSubreddits] = useStateSF(new Set());
  const [sortBy,  setSortBy]  = useStateSF("score");
  const [sortDir, setSortDir] = useStateSF("desc");

  const kwTextById = Object.fromEntries(D.seedKeywords.map((k) => [k.id, k.text]));
  const selectedKwTokens = [...selectedKeywords].map((id) =>
    (kwTextById[id] || "").split(/\s+/)[0].toLowerCase()
  ).filter(Boolean);
  const subNameById = Object.fromEntries(D.seedSubs.map((s) => [s.id, `r/${s.name}`]));
  const selectedSubNames = new Set([...selectedSubreddits].map((id) => subNameById[id]).filter(Boolean));

  const scorePass = (score) => {
    if (selectedScore === "all") return true;
    if (selectedScore === "90")  return score >= 90;
    if (selectedScore === "70")  return score >= 70 && score < 90;
    if (selectedScore === "low") return score < 70;
    return true;
  };

  const filtered = D.feed.filter((p) => {
    if (source === "x" && p.platform !== "x") return false;
    if (source === "reddit" && p.platform !== "reddit") return false;
    if (!scorePass(p.score ?? 0)) return false;
    if (selectedKwTokens.length > 0) {
      const blob = (p.tags || []).join(" ").toLowerCase();
      if (!selectedKwTokens.some((t) => blob.includes(t))) return false;
    }
    if (selectedStatus.size > 0) {
      const st = p.replied ? "replied" : "notReplied";
      if (!selectedStatus.has(st)) return false;
    }
    if (selectedIntents.size > 0 && !selectedIntents.has(p.intent)) return false;
    if (selectedSubNames.size > 0) {
      if (!p.subreddit || !selectedSubNames.has(p.subreddit)) return false;
    }
    return true;
  });

  filtered.sort((a, b) => sortDir === "asc" ? (a.score - b.score) : (b.score - a.score));

  const totals = {
    all:    3300, // demo total ignoring filters (matches figma copy)
    x:      2100,
    reddit: 1200,
  };

  const selectedPost = filtered.find((p) => p.id === selectedId) || D.feed.find((p) => p.id === selectedId);
  const showPanel = !!selectedPost;

  const resetAll = () => {
    setSelectedScore("all");
    setSelectedKeywords(new Set());
    setSelectedStatus(new Set());
    setSelectedIntents(new Set());
    setSelectedAccounts(new Set());
    setSelectedSubreddits(new Set());
  };

  return (
    <div className="font-karla">
      {window.PLUGIN_OPT === "banner" && <PluginInlineBanner />}
      <PlatformMiniTabs
        source={source} setSource={setSource} totals={totals}
        sortBy={sortBy} setSortBy={setSortBy}
        sortDir={sortDir} setSortDir={setSortDir}
      />
      <SyncRow />

      <FilterBar
        source={source} setSource={setSource}
        selectedScore={selectedScore}           setSelectedScore={setSelectedScore}
        selectedKeywords={selectedKeywords}     setSelectedKeywords={setSelectedKeywords}
        selectedStatus={selectedStatus}         setSelectedStatus={setSelectedStatus}
        selectedIntents={selectedIntents}       setSelectedIntents={setSelectedIntents}
        selectedAccounts={selectedAccounts}     setSelectedAccounts={setSelectedAccounts}
        selectedSubreddits={selectedSubreddits} setSelectedSubreddits={setSelectedSubreddits}
        sortBy={sortBy} setSortBy={setSortBy}
        sortDir={sortDir} setSortDir={setSortDir}
        totals={{ all: filtered.length, x: filtered.filter(p=>p.platform==="x").length, reddit: filtered.filter(p=>p.platform==="reddit").length }}
        onReset={resetAll}
      />

      <div className={cn("px-8 pt-5 pb-12 grid gap-6 items-start", showPanel ? "grid-cols-[1fr_400px]" : "grid-cols-1")}>
        <div className="flex flex-col gap-[18px]">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-primary/[0.05] p-14 text-center">
              <div className="text-[14px] text-primary/60">No matches for these filters.</div>
              <Button variant="outlined" onClick={resetAll} className="mt-4 h-9 px-3.5 text-[13px]">
                <I.RotateCcw className="w-3 h-3" /> Clear filters
              </Button>
            </div>
          ) : (
            filtered.map((post) => (
              <FeedCard
                key={post.id}
                post={post}
                selected={selectedId === post.id}
                onSelect={setSelectedId}
                onGenerate={setSelectedId}
              />
            ))
          )}
        </div>

        {showPanel && (
          <ReplyPanel post={selectedPost} onClose={() => setSelectedId(null)} />
        )}
      </div>
    </div>
  );
};
