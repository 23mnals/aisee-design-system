/* global React, window */
/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// signal-feed.jsx → app/(pages)/engage/_components/signal-feed.tsx
//
// Main Engage page. Renders banner + 3 tabs (Signal Feed / Keywords & Accounts
// / Sent) and the feed + reply panel grid.
// ─────────────────────────────────────────────────────────────────────────────

const { useState: useStateSF } = React;
const { cn, EngageBanner, FilterBar, FeedCard, ReplyPanel, KeywordsAccounts, SentTab, Button } = window;
const I = window.Icons;

// ── Page tabs — matches the underline pattern from app/_components/tabs.tsx ─
function PageTabs({ value, onChange, counts }) {
  const tabs = [
    { id: "signal",   label: "Signal Feed",         count: counts.signal },
    { id: "keywords", label: "Keywords & Accounts" },
    { id: "sent",     label: "Sent",                count: counts.sent },
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
              )}>
                {t.count}
              </span>
            )}
            {on && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-primary rounded-t" />}
          </button>
        );
      })}
    </div>
  );
}

window.SignalFeed = function SignalFeed({ onResetConfig }) {
  const D = window.EngageData;

  const [activeTab, setActiveTab] = useStateSF("signal");
  const [source, setSource]       = useStateSF("all");
  const [refine, setRefine]       = useStateSF({
    keywordQuality: "all",
    platformHeat: "all",
    accountInfluence: "all",
    recency: "all",
    priority: "all",
  });
  const [selectedId, setSelectedId] = useStateSF("p1");
  const [selectedScore,      setSelectedScore]      = useStateSF("all"); // single-select: all|90|70|low
  const [selectedKeywords,   setSelectedKeywords]   = useStateSF(new Set()); // Set<keyword id>
  const [selectedStatus,     setSelectedStatus]     = useStateSF(new Set()); // Set<"replied"|"notReplied">
  const [selectedIntents,    setSelectedIntents]    = useStateSF(new Set()); // Set<intent label>
  const [selectedAccounts,   setSelectedAccounts]   = useStateSF(new Set()); // Set<tracked account id>
  const [selectedSubreddits, setSelectedSubreddits] = useStateSF(new Set()); // Set<subreddit id>
  const [sortBy,  setSortBy]  = useStateSF("score"); // score | time | engagement
  const [sortDir, setSortDir] = useStateSF("desc");  // asc | desc
  // Loose match: a keyword like "GEO optimization" matches any post tag containing
  // its first significant word ("GEO"). Mirrors how the real backend will likely
  // index keyword ↔ mention links.
  const kwTextById = Object.fromEntries(D.seedKeywords.map((k) => [k.id, k.text]));
  const selectedKwTokens = [...selectedKeywords].map((id) =>
    (kwTextById[id] || "").split(/\s+/)[0].toLowerCase()
  ).filter(Boolean);
  const subNameById = Object.fromEntries(D.seedSubs.map((s) => [s.id, `r/${s.name}`]));
  const selectedSubNames = new Set([...selectedSubreddits].map((id) => subNameById[id]).filter(Boolean));

  // Score band → numeric predicate
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
    if (refine.keywordQuality !== "all" && p.keywordQuality !== refine.keywordQuality) return false;
    if (refine.platformHeat !== "all" && p.platformHeat !== refine.platformHeat) return false;
    if (refine.accountInfluence !== "all" && p.accountInfluence !== refine.accountInfluence) return false;
    if (refine.recency !== "all" && p.recency !== refine.recency) return false;
    if (refine.priority === "on" && !p.isPriority) return false;
    if (selectedKwTokens.length > 0) {
      const tagBlob = (p.tags || []).join(" ").toLowerCase();
      const hit = selectedKwTokens.some((tok) => tagBlob.includes(tok));
      if (!hit) return false;
    }
    if (selectedStatus.size > 0) {
      // Feed posts default to "not replied" (replied ones live in the Sent tab).
      const postStatus = p.replied ? "replied" : "notReplied";
      if (!selectedStatus.has(postStatus)) return false;
    }
    if (selectedIntents.size > 0 && !selectedIntents.has(p.intent)) return false;
    if (selectedAccounts.size > 0) {
      // Tracked-accounts filter: post must mention/come from one of the picked accounts.
      // The mock data doesn't tag accounts per-post, so we map account handle → post user.
      const handles = new Set([...selectedAccounts].map((id) => {
        const a = (D.seedAccounts || []).find((x) => x.id === id);
        return (a?.handle || "").toLowerCase();
      }));
      if (!handles.has((p.user?.handle || "").toLowerCase())) return false;
    }
    if (selectedSubNames.size > 0) {
      // Only reddit posts can match a subreddit; X posts auto-fail when a subreddit
      // filter is applied. That's the correct behavior — user is asking "only these
      // subreddits", which excludes X by definition.
      if (!p.subreddit || !selectedSubNames.has(p.subreddit)) return false;
    }
    return true;
  });

  // Sort the filtered list by chosen field/direction.
  const sortField = (p) => {
    if (sortBy === "time") {
      // tiny parse — strings like "1h", "3h"; smaller = newer
      const m = String(p.time || "").match(/(\d+)/);
      return m ? -parseInt(m[1], 10) : 0;
    }
    if (sortBy === "engagement") {
      const s = p.stats || {};
      return (s.likes || 0) + (s.replies || 0) + (s.comments || 0) + (s.upvotes || 0) + (s.retweets || 0);
    }
    return p.score || 0;
  };
  filtered.sort((a, b) => {
    const av = sortField(a), bv = sortField(b);
    return sortDir === "asc" ? av - bv : bv - av;
  });

  const totals = {
    all:    D.feed.length,
    x:      D.feed.filter((p) => p.platform === "x").length,
    reddit: D.feed.filter((p) => p.platform === "reddit").length,
  };

  const selectedPost = filtered.find((p) => p.id === selectedId) || D.feed.find((p) => p.id === selectedId);
  const showPanel = !!selectedPost && activeTab === "signal";

  const resetRefine = () => {
    setRefine({
      keywordQuality: "all", platformHeat: "all",
      accountInfluence: "all", recency: "all", priority: "all",
    });
    setSelectedScore("all");
    setSelectedKeywords(new Set());
    setSelectedStatus(new Set());
    setSelectedIntents(new Set());
    setSelectedAccounts(new Set());
    setSelectedSubreddits(new Set());
  };

  return (
    <div className="font-karla">
      <EngageBanner
        title="Engage"
        subtitle="Monitor and reply to relevant conversations across X and Reddit."
        stats={[
          { label: "New",      value: totals.all },
          { label: "Keywords", value: 6 },
          { label: "Accounts", value: 3 },
          { label: "Sent",     value: 3 },
        ]}
      />

      <PageTabs
        value={activeTab}
        onChange={setActiveTab}
        counts={{ signal: totals.all, sent: 3 }}
      />

      {activeTab === "signal" && (
        <>
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
            totals={totals} onReset={resetRefine}
          />

          <div className="px-8 pt-2.5 text-[12px] text-primary/60">
            Showing <b className="text-primary font-semibold">{filtered.length}</b> of {totals.all} opportunities
          </div>

          <div className={cn("px-8 pt-6 pb-12 grid gap-6 items-start", showPanel ? "grid-cols-[1fr_400px]" : "grid-cols-1")}>
            <div className="flex flex-col gap-[18px]">
              {filtered.length === 0 ? (
                <div className="bg-white rounded-xl border border-primary/[0.05] p-14 text-center">
                  <div className="text-[14px] text-primary/60">No matches for these filters.</div>
                  <div className="text-[12px] text-primary/60 mt-1">Try clearing a refine option or switching source.</div>
                  <Button variant="outlined" onClick={resetRefine} className="mt-4 h-9 px-3.5 text-[13px]">
                    <I.RotateCcw className="w-3 h-3" /> Clear refine filters
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
        </>
      )}

      {activeTab === "keywords" && <KeywordsAccounts />}
      {activeTab === "sent"     && <SentTab />}

      {/* Demo helper */}
      <button
        onClick={onResetConfig}
        className="fixed right-4 bottom-4 z-[100] text-[11px] bg-primary text-white px-2.5 py-1.5 rounded-full opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
      >
        ↺ Reset to initial setup (demo)
      </button>
    </div>
  );
};
