/* global React, window */
/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// filter-bar.jsx → app/(pages)/engage/_components/filter-bar.tsx
//
// Source / sync status / inline pill filters for the Signal Feed.
//
// Layout (left → right):
//   [Platform picker] [sync info] · · · [6 filter chips] [Sort by] [↕] [Clear]
//
// Responsive strategy (container queries, no JS):
//   • Sync labels strip progressively (Next in → Last sync prefix → entire block)
//   • Chip strip never wraps — it scrolls horizontally when there's no room
//   • Popovers render with `position: fixed` so the overflow container can't
//     clip them open
// ─────────────────────────────────────────────────────────────────────────────

const { useState: useStateFB, useRef: useRefFB, useEffect: useEffectFB } = React;
const { cn, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } = window;
const I = window.Icons;

// ── Shared popover positioner ────────────────────────────────────────────────
// Returns { ref, open, setOpen, anchor } where `anchor` is a {top,left} for a
// fixed-positioned panel anchored just below the trigger, flipped to the right
// when it would overflow the viewport. Using fixed (not absolute) means an
// `overflow:auto` ancestor on the filter row can't clip the panel.
function useChipPopover(panelWidth = 240) {
  const [open, setOpen] = useStateFB(false);
  const [anchor, setAnchor] = useStateFB({ top: 0, left: 0 });
  const ref = useRefFB(null);

  useEffectFB(() => {
    if (!open) return;
    const place = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const flipRight = r.left + panelWidth > window.innerWidth - 8;
      setAnchor({
        top: Math.round(r.bottom + 6),
        left: Math.round(flipRight ? r.right - panelWidth : r.left),
      });
    };
    place();
    const onDoc = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, panelWidth]);

  return { ref, open, setOpen, anchor };
}

// ── MultiSelectChip — N-of-M filter chip with checkbox popover ───────────────
function MultiSelectChip({ label, options, selected, onChange }) {
  const PANEL_W = 240;
  const { ref, open, setOpen, anchor } = useChipPopover(PANEL_W);
  const [hover, setHover] = useStateFB(false);
  const count = selected.size;
  const isSet = count > 0;

  const toggle = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    onChange(next);
  };
  const clearAll = (e) => {
    e.stopPropagation();
    onChange(new Set());
  };

  // Render the popover into <body> so the scroll container can't clip it.
  const panel = open && window.ReactDOM ? window.ReactDOM.createPortal(
    <div
      style={{ position: "fixed", top: anchor.top, left: anchor.left, width: PANEL_W, zIndex: 1000 }}
      className="bg-white rounded-xl border border-primary/[0.12] shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)] overflow-hidden"
    >
      <div className="flex items-center justify-between px-3.5 pt-2.5 pb-1.5">
        <span className="text-[10.5px] font-semibold tracking-[0.04em] uppercase text-primary/50">
          {label}{isSet && ` · ${count} selected`}
        </span>
        {isSet && (
          <button
            type="button"
            onClick={clearAll}
            className="text-[12px] font-medium text-primary underline underline-offset-2 hover:text-primary/70 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>
      <div className="py-1 max-h-[280px] overflow-y-auto">
        {options.length === 0 && (
          <div className="px-3.5 py-3 text-[12px] text-primary/50">No options.</div>
        )}
        {options.map((opt) => {
          const checked = selected.has(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggle(opt.id)}
              className="w-full flex items-center gap-2.5 px-3.5 py-1.5 text-[13px] text-primary text-left hover:bg-primary/[0.04] cursor-pointer"
            >
              <span className={cn(
                "w-4 h-4 rounded border inline-flex items-center justify-center flex-none",
                checked ? "bg-primary border-primary" : "bg-white border-primary/35"
              )}>
                {checked && <I.Check className="w-2.5 h-2.5 text-yellow-cff229" />}
              </span>
              <span className="truncate">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>,
    document.body
  ) : null;

  // When exactly 1 selected, show its label inline (matches Figma "Not replied").
  const soloLabel = count === 1 ? options.find((o) => o.id === [...selected][0])?.label : null;

  return (
    <div ref={ref} className="relative inline-flex" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "h-6 px-2 rounded-lg border font-karla text-[12px] font-medium inline-flex items-center gap-1 whitespace-nowrap cursor-pointer transition-colors",
          isSet
            ? "bg-yellow-fffadd border-primary/[0.15] text-primary"
            : "bg-transparent border-primary/[0.05] text-primary hover:border-primary/[0.18] hover:bg-primary/[0.02]",
          open && "border-primary/[0.3]"
        )}
      >
        {isSet && soloLabel ? (
          <span className="leading-none">{soloLabel}</span>
        ) : (
          <>
            <span className="leading-none">{label}</span>
            {isSet && (
              <span className="h-4 min-w-4 px-1 rounded-full bg-primary text-yellow-ffe253 text-[10px] font-semibold leading-4 inline-flex items-center justify-center tabular-nums">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </>
        )}
        {isSet ? (
          <span
            role="button"
            tabIndex={0}
            aria-label={`Clear ${label}`}
            onClick={clearAll}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") clearAll(e); }}
            className={cn(
              "ml-0.5 w-3.5 h-3.5 rounded-full inline-flex items-center justify-center text-primary/60 hover:bg-primary/[0.12] hover:text-primary transition-opacity",
              (hover || open) ? "opacity-100" : "opacity-0"
            )}
          >
            <I.X className="w-2.5 h-2.5" />
          </span>
        ) : (
          <I.ChevronDown className="w-3 h-3 text-primary/60" />
        )}
      </button>

      {panel}
    </div>
  );
}

// ── SingleSelectChip — one-of-N radio popover (e.g. Scores, Sort by) ─────────
function SingleSelectChip({ label, value, options, onChange, panelWidth = 200, prefix }) {
  const { ref, open, setOpen, anchor } = useChipPopover(panelWidth);
  const [hover, setHover] = useStateFB(false);

  const isSet = value && value !== "all";
  const current = options.find((o) => o.id === value);
  const triggerLabel = isSet && current ? current.label : label;

  const clear = (e) => {
    e.stopPropagation();
    onChange("all");
  };

  const panel = open && window.ReactDOM ? window.ReactDOM.createPortal(
    <div
      style={{ position: "fixed", top: anchor.top, left: anchor.left, width: panelWidth, zIndex: 1000 }}
      className="bg-white rounded-xl border border-primary/[0.12] shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)] overflow-hidden"
    >
      <div className="px-3.5 pt-2.5 pb-1.5">
        <span className="text-[10.5px] font-semibold tracking-[0.04em] uppercase text-primary/50">{label}</span>
      </div>
      <div className="py-1">
        {options.map((opt) => {
          const checked = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => { onChange(opt.id); setOpen(false); }}
              className={cn(
                "w-full flex items-center gap-2.5 px-3.5 py-1.5 text-[13px] text-left cursor-pointer",
                checked ? "bg-yellow-fffadd text-primary font-semibold" : "text-primary hover:bg-primary/[0.04]"
              )}
            >
              <span className="flex-1 truncate">{opt.label}</span>
              {checked && <I.Check className="w-3 h-3 text-primary" />}
            </button>
          );
        })}
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div ref={ref} className="relative inline-flex" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "h-6 px-2 rounded-lg border font-karla text-[12px] font-medium inline-flex items-center gap-1 whitespace-nowrap cursor-pointer transition-colors",
          isSet
            ? "bg-yellow-fffadd border-primary/[0.15] text-primary"
            : "bg-transparent border-primary/[0.05] text-primary hover:border-primary/[0.18] hover:bg-primary/[0.02]",
          open && "border-primary/[0.3]"
        )}
      >
        {prefix && <span className="fb-sort-prefix text-primary/50 uppercase tracking-wider text-[10px] leading-none">{prefix}</span>}
        <span className="leading-none">{triggerLabel}</span>
        {isSet && !prefix ? (
          <span
            role="button"
            tabIndex={0}
            aria-label={`Clear ${label}`}
            onClick={clear}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") clear(e); }}
            className={cn(
              "ml-0.5 w-3.5 h-3.5 rounded-full inline-flex items-center justify-center text-primary/60 hover:bg-primary/[0.12] hover:text-primary transition-opacity",
              (hover || open) ? "opacity-100" : "opacity-0"
            )}
          >
            <I.X className="w-2.5 h-2.5" />
          </span>
        ) : (
          <I.ChevronDown className="w-3 h-3 text-primary/60" />
        )}
      </button>
      {panel}
    </div>
  );
}

function PlatformPicker({ source, setSource, totals }) {
  const labelMap = { all: "All Platform", x: "X", reddit: "Reddit" };
  const count = source === "x" ? totals.x : source === "reddit" ? totals.reddit : totals.all;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="h-7 px-2 rounded-lg border border-primary/[0.05] bg-transparent font-karla text-[12px] font-medium text-primary inline-flex items-center gap-1.5 hover:border-primary/[0.18] hover:bg-primary/[0.02] transition-colors cursor-pointer"
        >
          <span className="leading-none">{labelMap[source]}</span>
          <span className="min-w-4 h-4 rounded-full bg-primary/[0.04] text-[10px] leading-4 text-primary px-1.5 inline-flex items-center justify-center opacity-80 tabular-nums">
            {count}
          </span>
          <I.ChevronDown className="w-3 h-3 text-primary" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[180px]">
        {[
          { id: "all",    label: "All Platform", count: totals.all },
          { id: "x",      label: "X",            count: totals.x },
          { id: "reddit", label: "Reddit",       count: totals.reddit },
        ].map((opt) => (
          <DropdownMenuItem
            key={opt.id}
            onClick={() => setSource(opt.id)}
            className={cn(source === opt.id && "bg-yellow-fffadd font-semibold")}
          >
            <span className="inline-flex items-center gap-1.5">
              {opt.id === "x" && <I.PlatformX size={11} />}
              {opt.id === "reddit" && <I.PlatformR />}
              {opt.label}
            </span>
            <span className="ml-auto text-primary/60 text-[11px]">{opt.count}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

window.FilterBar = function FilterBar({
  source, setSource,
  totals, onReset,
  selectedScore,      setSelectedScore,
  selectedKeywords,   setSelectedKeywords,
  selectedStatus,     setSelectedStatus,
  selectedIntents,    setSelectedIntents,
  selectedAccounts,   setSelectedAccounts,
  selectedSubreddits, setSelectedSubreddits,
  sortBy,             setSortBy,
  sortDir,            setSortDir,
}) {
  const D = window.EngageData;

  // Option lists built from the seed data so chips stay in sync.
  const scoreOptions = [
    { id: "all",  label: "All scores" },
    { id: "90",   label: "90 +"       },
    { id: "70",   label: "70 – 89"    },
    { id: "low",  label: "Below 70"   },
  ];
  const keywordOptions = D.seedKeywords.map((k) => ({ id: k.id, label: k.text }));
  const statusOptions = [
    { id: "notReplied", label: "Not replied" },
    { id: "replied",    label: "Replied"     },
  ];
  const intentOptions = [...new Set(D.feed.map((p) => p.intent).filter(Boolean))]
    .map((i) => ({ id: i, label: i }));
  const accountOptions = (D.seedAccounts || []).map((a) => ({ id: a.id, label: a.handle }));
  const subredditOptions = D.seedSubs.map((s) => ({ id: s.id, label: `r/${s.name}` }));
  const sortOptions = [
    { id: "score",      label: "Score"      },
    { id: "time",       label: "Newest"     },
    { id: "engagement", label: "Engagement" },
  ];

  const totalActive =
    (selectedScore && selectedScore !== "all" ? 1 : 0) +
    (selectedKeywords?.size   || 0) +
    (selectedStatus?.size     || 0) +
    (selectedIntents?.size    || 0) +
    (selectedAccounts?.size   || 0) +
    (selectedSubreddits?.size || 0);

  return (
    <div className="border-b border-primary/[0.05] fb-wrap" style={{ containerType: "inline-size" }}>
      <div className="px-6 py-3 flex items-center gap-2 min-h-[52px]">
        {/* ── Left: platform + sync (sync labels strip progressively) ── */}
        <div className="flex items-center gap-2 shrink-0">
          <PlatformPicker source={source} setSource={setSource} totals={totals} />

          <span className="fb-sync inline-flex items-center gap-2 ml-1 pl-1 font-karla text-[12px] text-primary leading-none whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-green-92bc01 shrink-0" style={{ boxShadow: "0 0 0 3px rgba(146,188,1,0.2)" }} />
            <span className="fb-sync-last inline-flex items-center gap-1">
              <span className="fb-sync-label text-primary/70">Last sync</span>
              <b className="font-bold">2m ago</b>
            </span>
            <span className="fb-sync-next inline-flex items-center gap-1">
              <span className="text-primary/40 mx-0.5">·</span>
              <span className="text-primary/70">Next in</span>
              <b className="font-bold">23h 58m</b>
            </span>
          </span>
        </div>

        {/* Flexible spacer */}
        <div className="flex-1 min-w-0" />

        {/* ── Right: filter chips strip — horizontally scrolls instead of wrapping ── */}
        <div className="fb-chips flex items-center gap-2 min-w-0 overflow-x-auto">
          <SingleSelectChip
            label="All scores"
            value={selectedScore || "all"}
            options={scoreOptions}
            onChange={setSelectedScore}
          />
          <MultiSelectChip
            label="Keywords"
            options={keywordOptions}
            selected={selectedKeywords || new Set()}
            onChange={setSelectedKeywords}
          />
          <MultiSelectChip
            label="Status"
            options={statusOptions}
            selected={selectedStatus || new Set()}
            onChange={setSelectedStatus}
          />
          <MultiSelectChip
            label="Intents"
            options={intentOptions}
            selected={selectedIntents || new Set()}
            onChange={setSelectedIntents}
          />
          <MultiSelectChip
            label="Accounts"
            options={accountOptions}
            selected={selectedAccounts || new Set()}
            onChange={setSelectedAccounts}
          />
          <MultiSelectChip
            label="Subreddits"
            options={subredditOptions}
            selected={selectedSubreddits || new Set()}
            onChange={setSelectedSubreddits}
          />
        </div>

        {/* ── Sort: dropdown + asc/desc toggle ── */}
        <div className="flex items-center gap-1.5 shrink-0 fb-sort pl-1.5 ml-0.5 border-l border-primary/[0.06]">
          <SingleSelectChip
            label="Sort by"
            value={sortBy || "score"}
            options={sortOptions}
            onChange={setSortBy}
            prefix="Sort by"
          />
          <button
            type="button"
            onClick={() => setSortDir((sortDir || "desc") === "desc" ? "asc" : "desc")}
            aria-label={`Toggle sort direction (currently ${(sortDir || "desc") === "desc" ? "descending" : "ascending"})`}
            className="h-6 w-6 rounded-lg border border-primary/[0.05] bg-transparent text-primary inline-flex items-center justify-center hover:border-primary/[0.18] hover:bg-primary/[0.02] cursor-pointer transition-colors"
          >
            {(sortDir || "desc") === "desc" ? (
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M2 3.5h8M3 6h6M4.5 8.5h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path d="M2 8.5h8M3 6h6M4.5 3.5h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>

        {totalActive > 0 && (
          <button
            onClick={onReset}
            className="shrink-0 h-6 px-2 rounded-lg text-[12px] font-medium text-primary/60 hover:text-primary hover:bg-primary/[0.04] inline-flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap"
          >
            <I.RotateCcw className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>
    </div>
  );
};
