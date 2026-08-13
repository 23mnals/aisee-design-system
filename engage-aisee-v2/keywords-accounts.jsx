/* global React, window */
/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// keywords-accounts.jsx → app/(pages)/engage/_components/keywords-accounts.tsx
//
// 3 sections: Keywords | X Priority Accounts | Reddit Subreddits.
// Add-account & add-subreddit dialogs use repo's <Dialog>.
// ─────────────────────────────────────────────────────────────────────────────

const { useState: useStateKA, useEffect: useEffectKA, useRef: useRefKA } = React;
const { cn, Button, Switch, Dialog, DialogContent, DialogTitle, DialogFooter } = window;
const I = window.Icons;

const MAX_WEEK = 600;
const TYPE_LABEL = { core: "Core", brand: "Brand", competitor: "Competitor" };
const TYPE_BAR = {
  core:       "bg-yellow-ffe253",
  brand:      "bg-green-ceebc8",
  competitor: "bg-red-ffd0d0",
};
const TYPE_TAG = {
  core:       "bg-[#DCEEFF] text-[#1F3D70]",
  brand:      "bg-green-e6f2db text-[#3B5A1F]",
  competitor: "bg-red-ffd0d0 text-red-ec5212",
};

// ── Plan limits ─────────────────────────────────────────────────────────────
const PLAN_LIMITS = {
  starter:    { id: "starter",    label: "Starter",    keywords: 3,        accounts: 1,        subs: 1        },
  pro:        { id: "pro",        label: "Pro",        keywords: 30,       accounts: 20,       subs: 20       },
  enterprise: { id: "enterprise", label: "Enterprise", keywords: Infinity, accounts: Infinity, subs: Infinity },
};
const PRO_BULLETS = {
  keywords: ["Track up to 30 keywords", "Hourly scans (Starter: every 24h)", "Per-keyword intent rules"],
  accounts: ["Track up to 20 X priority accounts", "Push-on-post (no keyword required)", "Per-account auto-reply policies"],
  subs:     ["Track up to 20 subreddits", "Hourly scans (Starter: every 24h)", "Per-sub keyword overrides"],
};

function LockIcon({ className = "w-3 h-3" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

// Segmented dots when max ≤ 6, else just "n / ∞"
function UsageDots({ used, max }) {
  const finite = max !== Infinity && max <= 6;
  if (!finite) {
    return (
      <span className="text-[11px] font-medium tabular-nums text-primary/60">
        <b className="font-semibold text-primary">{used}</b> / {max === Infinity ? "∞" : max}
      </span>
    );
  }
  const atLimit = used >= max;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-flex items-center gap-[3px]">
        {Array.from({ length: max }).map((_, i) => (
          <span key={i} className={cn(
            "w-[7px] h-[7px] rounded-full transition-colors",
            i < used ? (atLimit ? "bg-primary" : "bg-primary/75") : "bg-primary/[0.12]"
          )} />
        ))}
      </span>
      <span className="text-[11px] font-medium tabular-nums text-primary/60">
        <b className="font-semibold text-primary">{used}</b> / {max}
      </span>
    </span>
  );
}

// Anchored upgrade popover — click outside / Esc to dismiss
function UpgradePopover({ open, onClose, anchorRef, planLabel, feature, lines, onUpgrade }) {
  const popRef = useRefKA(null);
  useEffectKA(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (popRef.current?.contains(e.target)) return;
      if (anchorRef?.current?.contains(e.target)) return;
      onClose();
    };
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;
  return (
    <div ref={popRef} className="absolute right-0 top-[calc(100%+8px)] z-30 w-[300px] bg-white border border-primary/[0.08] rounded-[12px] shadow-[0_8px_28px_-12px_rgba(0,0,0,0.18)] p-4 font-karla animate-fade-in">
      <div className="flex items-start gap-2.5">
        <span className="w-8 h-8 rounded-lg bg-yellow-fff2b3 inline-flex items-center justify-center shrink-0">
          <I.Sparkles className="w-4 h-4 text-primary" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold leading-tight">{feature}</div>
          <div className="text-[11px] text-primary/60 mt-1">You're on <b className="text-primary font-semibold">{planLabel}</b>. Upgrade to Pro to unlock:</div>
        </div>
      </div>
      <ul className="mt-3 flex flex-col gap-1.5 text-[12px] text-primary/80">
        {lines.map((l, i) => (
          <li key={i} className="flex items-start gap-1.5">
            <I.Check className="w-3 h-3 text-green-92bc01 mt-0.5 shrink-0" />
            <span>{l}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3.5 flex items-center gap-2">
        <Button variant="primary" onClick={() => { onUpgrade?.(); onClose(); }} className="h-8 px-3 text-[12px] flex-1">
          <I.Sparkles className="w-3 h-3" /> Upgrade to Pro
        </Button>
        <Button variant="tertiary" onClick={onClose} className="h-8 px-2.5 text-[12px]">Later</Button>
      </div>
    </div>
  );
}

// Add button that swaps to a locked upgrade trigger when at limit
function AddOrUpgrade({ atLimit, onAdd, planLabel, feature, lines, onUpgrade, label = "Add", variant = "secondary" }) {
  const [open, setOpen] = useStateKA(false);
  const anchorRef = useRefKA(null);
  if (!atLimit) {
    return (
      <Button variant={variant} onClick={onAdd} className={cn("h-8 px-3.5 text-[13px] font-semibold", variant === "secondary" && "border border-primary/[0.08]")}>
        <I.Plus className="w-3 h-3" /> {label}
      </Button>
    );
  }
  return (
    <div className="relative">
      <button
        ref={anchorRef}
        onClick={() => setOpen((v) => !v)}
        className="h-8 px-3 inline-flex items-center gap-1.5 rounded-md bg-yellow-fff2b3 border border-yellow-ffe253 text-[#8C7400] text-[12.5px] font-semibold cursor-pointer hover:bg-yellow-fffadd transition-colors"
      >
        <LockIcon className="w-3 h-3" /> {planLabel} limit · Upgrade
      </button>
      <UpgradePopover
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={anchorRef}
        planLabel={planLabel}
        feature={feature}
        lines={lines}
        onUpgrade={onUpgrade}
      />
    </div>
  );
}

// Ghost row in the keywords list — single concrete "this is what Pro unlocks"
function GhostLockedKwRow({ onUpgrade }) {
  return (
    <button
      onClick={onUpgrade}
      className="w-full grid grid-cols-[1fr_auto] gap-x-4 items-center px-5 py-3 border-t border-dashed border-primary/[0.1] hover:bg-yellow-fbfbf3 cursor-pointer transition-colors text-left"
    >
      <div className="flex items-center gap-2.5">
        <span className="w-5 h-5 rounded-full bg-primary/[0.05] inline-flex items-center justify-center text-primary/40">
          <LockIcon className="w-2.5 h-2.5" />
        </span>
        <span className="text-[13.5px] text-primary/60">
          More keywords with <b className="text-primary font-semibold">Pro</b> — up to 30, hourly scans
        </span>
      </div>
      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary/70">
        Upgrade <I.ArrowRight className="w-3 h-3" />
      </span>
    </button>
  );
}

// Ghost tile for accounts / subreddits at limit
function GhostLockedTile({ onUpgrade, kind }) {
  return (
    <button
      onClick={onUpgrade}
      className="flex items-center gap-3 px-3.5 py-3 rounded-[10px] border border-dashed border-primary/[0.18] bg-gray-fafafa hover:bg-yellow-fbfbf3 hover:border-primary/[0.3] cursor-pointer transition-colors text-left"
    >
      <span className="w-[30px] h-[30px] rounded-lg bg-primary/[0.05] text-primary/40 inline-flex items-center justify-center">
        <LockIcon className="w-3.5 h-3.5" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-semibold text-primary/70">More {kind} with Pro</div>
        <div className="text-[11px] text-primary/50 mt-0.5">Unlimited tracking & higher refresh</div>
      </div>
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-md text-primary/60">
        <I.ArrowRight className="w-3 h-3" />
      </span>
    </button>
  );
}

// Top-of-page plan strip — compact summary across 3 dimensions
function PlanUsageStrip({ plan, usage, onUpgrade, onChangePlan }) {
  const dims = [
    { key: "keywords", label: "Keywords",   used: usage.kw,  max: plan.keywords },
    { key: "accounts", label: "X accounts", used: usage.acc, max: plan.accounts },
    { key: "subs",     label: "Subreddits", used: usage.sub, max: plan.subs     },
  ];
  const anyAtLimit = dims.some((d) => d.used >= d.max && d.max !== Infinity);
  const isFree = plan.id === "starter";
  return (
    <div className={cn(
      "rounded-[14px] border px-4 py-3 flex items-center gap-4 flex-wrap transition-colors",
      anyAtLimit
        ? "bg-yellow-fefbe3 border-yellow-ffe253"
        : "bg-white border-primary/[0.05]"
    )}>
      <div className="inline-flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 h-6 pl-1.5 pr-2.5 rounded-full bg-primary text-white text-[11px] font-semibold uppercase tracking-[0.04em]">
          <I.Sparkles className="w-3 h-3" /> {plan.label}
        </span>
        <span className="text-[12px] text-primary/60">
          {anyAtLimit ? "Some limits reached" : (isFree ? "Your plan tracks:" : "Tracking:")}
        </span>
      </div>
      <div className="h-5 w-px bg-primary/[0.08]" />
      <div className="inline-flex items-center gap-3 flex-wrap">
        {dims.map((d, i) => (
          <React.Fragment key={d.key}>
            {i > 0 && <span className="text-primary/20 text-[12px]">·</span>}
            <span className="inline-flex items-center gap-2">
              <span className="text-[12px] text-primary/70">{d.label}</span>
              <UsageDots used={d.used} max={d.max} />
              {d.used >= d.max && d.max !== Infinity && (
                <span className="inline-flex items-center h-4 px-1.5 rounded bg-yellow-ffe253 text-[9.5px] font-bold uppercase tracking-[0.05em] text-primary">Full</span>
              )}
            </span>
          </React.Fragment>
        ))}
      </div>
      <div className="flex-1" />
      {isFree && (
        anyAtLimit ? (
          <Button variant="primary" onClick={onUpgrade} className="h-8 px-3 text-[12.5px]">
            <I.Sparkles className="w-3 h-3" /> Upgrade to Pro
          </Button>
        ) : (
          <button onClick={onUpgrade} className="text-[12.5px] font-semibold text-primary/70 hover:text-primary inline-flex items-center gap-1 cursor-pointer">
            See Pro <I.ArrowRight className="w-3 h-3" />
          </button>
        )
      )}
      <button
        onClick={onChangePlan}
        className="ml-1 text-[10px] uppercase tracking-[0.06em] font-semibold text-primary/40 hover:text-primary border border-dashed border-primary/[0.15] px-2 h-6 rounded-md cursor-pointer"
        title="Demo only — switch plan"
      >
        Demo · switch plan
      </button>
    </div>
  );
}

// ── Shared card chrome ──────────────────────────────────────────────────────
function KwaCard({ children, className }) {
  return (
    <div className={cn("bg-white rounded-[14px] border border-primary/[0.05] overflow-hidden flex flex-col", className)}>
      {children}
    </div>
  );
}

function StepBadge({ n }) {
  return (
    <span className="inline-flex items-center justify-center w-[20px] h-[20px] rounded-full bg-yellow-ffe253 text-primary text-[11px] font-bold leading-none">
      {n}
    </span>
  );
}

function SectionHead({ stepN, title, sub, right }) {
  return (
    <div className="px-5 pt-4 pb-3.5 flex items-start gap-3 border-b border-primary/[0.05]">
      <div className="flex-1 min-w-0">
        <h3 className="font-karla text-[15px] font-bold m-0 inline-flex items-center gap-2">
          <StepBadge n={stepN} />
          {title}
        </h3>
        <div className="text-[12px] text-primary/60 mt-1 leading-snug">{sub}</div>
      </div>
      {right && <div className="shrink-0 flex items-center gap-2.5">{right}</div>}
    </div>
  );
}

// Inline "X / N keywords" counter — compact, no dots
function CountChip({ used, max, noun }) {
  const finite = max !== Infinity;
  return (
    <span className="text-[12px] tabular-nums text-primary/60">
      <b className="font-semibold text-primary">{used}</b>
      <span className="mx-0.5 text-primary/40">/</span>
      <span className="text-primary/70">{finite ? max : "∞"}</span>
      {noun && <span className="ml-1 text-primary/50">{noun}</span>}
    </span>
  );
}

// ── Keyword row ─────────────────────────────────────────────────────────────
function KeywordRow({ kw, onToggle, overPlan, onRemove, onUpgrade }) {
  const pct = Math.min(100, Math.round((kw.weekN / MAX_WEEK) * 100));
  return (
    <div className={cn(
      "group grid grid-cols-[1fr_auto_auto] gap-x-3 items-center px-5 py-3 border-t border-primary/[0.04] first:border-t-0 transition-colors",
      overPlan ? "bg-gray-fafafa/60" : "hover:bg-primary/[0.015]"
    )}>
      <div className={cn("flex flex-col gap-1.5 min-w-0", overPlan && "opacity-55")}>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[14px] font-semibold truncate">{kw.text}</span>
          <span className={cn("inline-flex items-center h-[18px] px-1.5 rounded text-[9.5px] font-semibold uppercase tracking-[0.04em]", TYPE_TAG[kw.type])}>
            {TYPE_LABEL[kw.type]}
          </span>
          {overPlan && (
            <span className="inline-flex items-center gap-1 h-[18px] px-1.5 rounded bg-yellow-fff2b3 text-[#8C7400] text-[9.5px] font-semibold uppercase tracking-[0.04em]">
              <LockIcon className="w-2.5 h-2.5" /> Pro
            </span>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex-1 max-w-[200px] h-[5px] rounded-full bg-primary/[0.06] overflow-hidden">
            <span className={cn("block h-full rounded-full transition-all", TYPE_BAR[kw.type])} style={{ width: `${pct}%` }} />
          </div>
          <span className="text-[11.5px] text-primary/60 tabular-nums">
            <b className="text-primary font-semibold">{kw.weekN}</b> this week
          </span>
        </div>
      </div>
      {overPlan ? (
        <button
          onClick={onUpgrade}
          className="h-7 px-2.5 inline-flex items-center gap-1.5 rounded-full bg-primary/[0.04] text-[11px] font-semibold text-primary/60 hover:bg-yellow-fff2b3 hover:text-[#8C7400] transition-colors cursor-pointer"
        >
          <LockIcon className="w-2.5 h-2.5" /> Unlock
        </button>
      ) : (
        <Switch checked={kw.on} onCheckedChange={() => onToggle(kw.id)} />
      )}
      <button
        onClick={() => onRemove(kw.id)}
        aria-label="Remove keyword"
        className="w-6 h-6 inline-flex items-center justify-center text-primary/30 hover:text-primary hover:bg-primary/[0.06] rounded-md cursor-pointer transition-colors"
      >
        <I.X className="w-3 h-3" />
      </button>
    </div>
  );
}

// ── Priority Account row (X) / Subreddit row (Reddit) ──────────────────────
function AccountRow({ a, onToggle, onRemove, overPlan, onUpgrade }) {
  return (
    <div className={cn(
      "grid grid-cols-[32px_1fr_auto_auto] gap-2.5 items-center px-4 py-3 border-t border-primary/[0.04] first:border-t-0 transition-colors",
      overPlan ? "bg-gray-fafafa/60" : "hover:bg-primary/[0.015]"
    )}>
      <div className={cn(
        "w-[32px] h-[32px] rounded-full inline-flex items-center justify-center font-bold text-[12px]",
        overPlan ? "bg-primary/[0.04] text-primary/40" : "bg-primary/[0.08] text-primary"
      )}>
        {a.initial}
      </div>
      <div className={cn("min-w-0", overPlan && "opacity-55")}>
        <div className="text-[13px] font-semibold truncate">{a.handle}</div>
        <div className="text-[11px] text-primary/60 truncate">{a.role}</div>
      </div>
      {overPlan ? (
        <button onClick={onUpgrade} className="h-7 px-2.5 inline-flex items-center gap-1 rounded-full bg-primary/[0.04] text-[11px] font-semibold text-primary/60 hover:bg-yellow-fff2b3 hover:text-[#8C7400] transition-colors cursor-pointer">
          <LockIcon className="w-2.5 h-2.5" /> Unlock
        </button>
      ) : (
        <Switch checked={a.on} onCheckedChange={() => onToggle(a.id)} />
      )}
      <button onClick={() => onRemove(a.id)} aria-label="Remove" className="w-6 h-6 inline-flex items-center justify-center text-primary/30 hover:text-primary hover:bg-primary/[0.06] rounded-md cursor-pointer">
        <I.X className="w-3 h-3" />
      </button>
    </div>
  );
}

function SubRow({ s, onToggle, onRemove, overPlan, onUpgrade }) {
  return (
    <div className={cn(
      "grid grid-cols-[32px_1fr_auto_auto] gap-2.5 items-center px-4 py-3 border-t border-primary/[0.04] first:border-t-0 transition-colors",
      overPlan ? "bg-gray-fafafa/60" : "hover:bg-primary/[0.015]"
    )}>
      <span className={cn(
        "w-[32px] h-[32px] rounded-lg inline-flex items-center justify-center",
        overPlan ? "bg-red-ec5212/30 text-white/80" : "bg-red-ec5212 text-white"
      )}>
        <I.PlatformR />
      </span>
      <div className={cn("min-w-0", overPlan && "opacity-55")}>
        <div className="text-[13px] font-semibold truncate">r/{s.name}</div>
        <div className="text-[11px] text-primary/60 truncate">{s.members} members</div>
      </div>
      {overPlan ? (
        <button onClick={onUpgrade} className="h-7 px-2.5 inline-flex items-center gap-1 rounded-full bg-primary/[0.04] text-[11px] font-semibold text-primary/60 hover:bg-yellow-fff2b3 hover:text-[#8C7400] transition-colors cursor-pointer">
          <LockIcon className="w-2.5 h-2.5" /> Unlock
        </button>
      ) : (
        <Switch checked={s.on} onCheckedChange={() => onToggle(s.id)} />
      )}
      <button onClick={() => onRemove(s.id)} aria-label="Remove" className="w-6 h-6 inline-flex items-center justify-center text-primary/30 hover:text-primary hover:bg-primary/[0.06] rounded-md cursor-pointer">
        <I.X className="w-3 h-3" />
      </button>
    </div>
  );
}

// ── Empty state for a tab at limit on Starter ──────────────────────────────
function PriorityEmpty({ kind, planLabel, onUpgrade }) {
  const copy = {
    x: {
      lines: ["Up to 20 X accounts", "Push-on-post (no keyword needed)", "Auto-reply policies"],
    },
    reddit: {
      lines: ["Up to 20 subreddits", "Hourly scans (Starter: 24h)", "Per-sub keyword overrides"],
    },
  }[kind];

  return (
    <div className="px-5 py-7 flex flex-col items-center text-center gap-3">
      <span className="relative w-12 h-12 rounded-2xl bg-yellow-fff2b3 inline-flex items-center justify-center">
        <LockIcon className="w-5 h-5 text-primary" />
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white inline-flex items-center justify-center">
          <I.Sparkles className="w-3 h-3" />
        </span>
      </span>
      <div>
        <div className="text-[13.5px] font-semibold leading-tight">More tracking on Pro</div>
        <div className="text-[11.5px] text-primary/60 mt-1 max-w-[260px]">
          You're on <b className="text-primary font-semibold">{planLabel}</b> — 1 slot per platform. Pro unlocks the full feature.
        </div>
      </div>
      <ul className="flex flex-col gap-1 text-[11.5px] text-primary/75 mt-1">
        {copy.lines.map((l, i) => (
          <li key={i} className="inline-flex items-center gap-1.5">
            <I.Check className="w-3 h-3 text-green-92bc01 shrink-0" /> {l}
          </li>
        ))}
      </ul>
      <button
        onClick={onUpgrade}
        className="mt-1 h-8 px-3.5 inline-flex items-center gap-1.5 rounded-md bg-yellow-ffe253 hover:bg-yellow-fff2b3 text-primary text-[12.5px] font-semibold cursor-pointer transition-colors"
      >
        <I.Sparkles className="w-3 h-3" /> Upgrade to unlock <I.ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
}

// ── Starter-limits sticky banner ────────────────────────────────────────────
function StarterLimitsBanner({ planLabel, onUpgrade, onDismiss }) {
  return (
    <div className="rounded-[12px] border border-yellow-ffe253 bg-yellow-fefbe3 px-4 py-3 flex items-center gap-3 shadow-[0_4px_16px_-8px_rgba(0,0,0,0.08)]">
      <span className="w-9 h-9 rounded-lg bg-yellow-ffe253 inline-flex items-center justify-center shrink-0">
        <I.Rocket className="w-4 h-4 text-primary" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-primary">You've reached your {planLabel} limits</div>
        <div className="text-[11.5px] text-primary/65 mt-0.5">
          Upgrade to track more <b className="text-primary font-semibold">keywords</b>, unlock <b className="text-primary font-semibold">priority accounts</b>, and scan faster.
        </div>
      </div>
      <button onClick={onDismiss} className="h-8 px-3 rounded-md bg-white border border-primary/[0.08] text-[12.5px] font-semibold text-primary/70 hover:text-primary hover:bg-gray-fafafa cursor-pointer">
        Later
      </button>
      <button onClick={onUpgrade} className="h-8 px-3.5 inline-flex items-center gap-1.5 rounded-md bg-primary text-white text-[12.5px] font-semibold cursor-pointer hover:bg-primary/90">
        <I.Sparkles className="w-3 h-3" /> Upgrade
      </button>
    </div>
  );
}

// ── Add-account dialog ──────────────────────────────────────────────────────
function AddAccountDialog({ open, onOpenChange, onAdd }) {
  const [handle, setHandle] = useStateKA("");
  const [phase, setPhase] = useStateKA("idle");
  const [verified, setVerified] = useStateKA(null);
  const [keywords, setKeywords] = useStateKA(new Set(["GEO"]));
  const [tracking, setTracking] = useStateKA(true);
  const inputRef = useRefKA(null);

  const KEYWORD_OPTIONS = ["GEO", "SEO media", "Technical SEO", "Growth", "AI search"];

  useEffectKA(() => {
    if (open) {
      setHandle(""); setPhase("idle"); setVerified(null);
      setKeywords(new Set(["GEO"])); setTracking(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const trimmed = handle.trim().replace(/^@/, "");
  const canVerify = trimmed.length >= 2 && phase !== "verifying";

  const runVerify = () => {
    if (!canVerify) return;
    setPhase("verifying"); setVerified(null);
    setTimeout(() => {
      const display = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).replace(/_/g, " ");
      setVerified({
        handle: "@" + trimmed, name: display,
        initial: trimmed.charAt(0).toUpperCase(),
        followers: "39K", postsPerWeek: 16,
      });
      setPhase("verified");
    }, 1100);
  };

  const submit = () => {
    if (phase !== "verified") return;
    onAdd({
      id: "a" + Date.now(),
      handle: verified.handle,
      role: [...keywords].join(", ") || "Tracked",
      on: tracking,
      initial: verified.initial,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogTitle className="mb-4">Add a tracked account</DialogTitle>

        <div className="flex flex-col gap-3.5">
          <div>
            <label className="text-[12px] font-medium text-primary">X handle</label>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="flex-1 flex items-center h-11 rounded-lg border border-primary/[0.05] px-3 bg-white focus-within:border-primary transition-colors">
                <span className="text-primary/40 text-[14px]">@</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={handle}
                  onChange={(e) => { setHandle(e.target.value); setPhase("idle"); setVerified(null); }}
                  onKeyDown={(e) => e.key === "Enter" && runVerify()}
                  placeholder="seo-practitioner"
                  className="flex-1 bg-transparent border-0 outline-none text-[14px] ml-0.5 placeholder:text-primary/40 font-karla"
                />
              </div>
              <Button variant="primary" onClick={runVerify} disabled={!canVerify} className="h-11 px-4 text-[13px]">
                Verify
              </Button>
            </div>
          </div>

          {phase === "verifying" && (
            <div className="text-[13px] text-primary/60 inline-flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              Verifying @{trimmed} on X…
            </div>
          )}

          {phase === "verified" && verified && (
            <>
              <div className="bg-yellow-fbfbf3 border border-primary/[0.05] rounded-lg p-3 flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-yellow-fffadd inline-flex items-center justify-center font-bold text-[16px]">
                    {verified.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold inline-flex items-center gap-1.5">
                      {verified.name}
                      <I.Check className="w-3 h-3 text-green-92bc01" />
                    </div>
                    <div className="text-[12px] text-primary/60">{verified.handle} · X</div>
                  </div>
                  <I.Check className="w-4 h-4 text-green-92bc01" />
                </div>
                <div className="text-[12px] text-primary/60 inline-flex items-center gap-1.5 flex-wrap">
                  <span><b className="text-primary font-semibold">{verified.followers}</b> followers</span>
                  <span className="text-primary/40">·</span>
                  <span>~<b className="text-primary font-semibold">{verified.postsPerWeek}</b> posts / week</span>
                  <span className="text-primary/40">·</span>
                  <span>Public account</span>
                </div>
              </div>

              <div>
                <label className="text-[12px] font-medium text-primary">Keyword</label>
                <div className="mt-1.5 flex gap-1.5 flex-wrap">
                  {KEYWORD_OPTIONS.map((k) => (
                    <button
                      key={k}
                      onClick={() => {
                        const next = new Set(keywords);
                        next.has(k) ? next.delete(k) : next.add(k);
                        setKeywords(next);
                      }}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[12px] font-medium border cursor-pointer transition-colors",
                        keywords.has(k)
                          ? "bg-yellow-ffe253 border-primary"
                          : "bg-white border-primary/[0.1] text-primary/70 hover:border-primary"
                      )}
                    >
                      {k}
                    </button>
                  ))}
                  <button className="px-2.5 py-1 rounded-full text-[12px] font-medium border border-dashed border-primary/[0.2] text-primary/60 cursor-pointer hover:border-primary hover:text-primary transition-colors">
                    + Custom
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-gray-fafafa border border-primary/[0.05] rounded-lg p-3">
                <span className="w-8 h-8 rounded-md bg-yellow-fffadd inline-flex items-center justify-center">
                  <I.Zap className="w-4 h-4 text-primary" />
                </span>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold">Start tracking on add</div>
                  <div className="text-[11px] text-primary/60 mt-0.5">New posts push to Signal Feed, checked every 3 hours.</div>
                </div>
                <Switch checked={tracking} onCheckedChange={setTracking} />
              </div>
            </>
          )}
        </div>

        <DialogFooter className="mt-5">
          <Button variant="tertiary" onClick={() => onOpenChange(false)} className="h-10 px-4 text-[13px]">Cancel</Button>
          <Button variant="primary" onClick={submit} disabled={phase !== "verified"} className="h-10 px-4 text-[13px]">
            <I.Plus className="w-3 h-3" /> Add account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Add-subreddit dialog ────────────────────────────────────────────────────
function AddSubredditDialog({ open, onOpenChange, onAdd }) {
  const [name, setName] = useStateKA("");
  const [phase, setPhase] = useStateKA("idle");
  const [found, setFound] = useStateKA(null);
  const [monitoring, setMonitoring] = useStateKA(true);
  const inputRef = useRefKA(null);

  useEffectKA(() => {
    if (open) {
      setName(""); setPhase("idle"); setFound(null); setMonitoring(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const trimmed = name.trim().replace(/^@/, "").replace(/^r\//, "");
  const canFind = trimmed.length >= 2 && phase !== "verifying";

  const runFind = () => {
    if (!canFind) return;
    setPhase("verifying"); setFound(null);
    setTimeout(() => {
      setFound({ name: "r/" + trimmed, members: "1.1M", postsPerDay: 28 });
      setPhase("verified");
    }, 1100);
  };

  const submit = () => {
    if (phase !== "verified") return;
    onAdd({
      id: "s" + Date.now(),
      name: found.name.replace(/^r\//, ""),
      members: found.members,
      on: monitoring,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogTitle className="mb-4">Add a subreddit</DialogTitle>

        <div className="flex flex-col gap-3.5">
          <div>
            <label className="text-[12px] font-medium text-primary">Subreddit</label>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="flex-1 flex items-center h-11 rounded-lg border border-primary/[0.05] px-3 bg-white focus-within:border-primary transition-colors">
                <span className="text-primary/40 text-[14px]">r/</span>
                <input
                  ref={inputRef}
                  value={name}
                  onChange={(e) => { setName(e.target.value); setPhase("idle"); setFound(null); }}
                  onKeyDown={(e) => e.key === "Enter" && runFind()}
                  placeholder="growthhacking"
                  className="flex-1 bg-transparent border-0 outline-none text-[14px] ml-0.5 placeholder:text-primary/40 font-karla"
                />
              </div>
              <Button variant="primary" onClick={runFind} disabled={!canFind} className="h-11 px-4 text-[13px]">Find</Button>
            </div>
          </div>

          {phase === "verifying" && (
            <div className="text-[13px] text-primary/60 inline-flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              Looking up r/{trimmed} on Reddit…
            </div>
          )}

          {phase === "verified" && found && (
            <>
              <div className="bg-yellow-fbfbf3 border border-primary/[0.05] rounded-lg p-3 flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-md bg-red-ec5212 text-white inline-flex items-center justify-center font-bold text-[14px]"><I.PlatformR /></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold inline-flex items-center gap-1.5">
                      {found.name}
                      <I.Check className="w-3 h-3 text-green-92bc01" />
                    </div>
                    <div className="text-[12px] text-primary/60">{found.members} members · Reddit community</div>
                  </div>
                  <I.Check className="w-4 h-4 text-green-92bc01" />
                </div>
                <div className="text-[12px] text-primary/60 inline-flex items-center gap-1.5 flex-wrap">
                  <span><b className="text-primary font-semibold">{found.postsPerDay}</b> posts / day</span>
                  <span className="text-primary/40">·</span>
                  <span className="text-green-92bc01 font-semibold">Active community</span>
                  <span className="text-primary/40">·</span>
                  <span>Public</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-gray-fafafa border border-primary/[0.05] rounded-lg p-3">
                <span className="w-8 h-8 rounded-md bg-yellow-fffadd inline-flex items-center justify-center">
                  <I.Zap className="w-4 h-4 text-primary" />
                </span>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold">Start monitoring on add</div>
                  <div className="text-[11px] text-primary/60 mt-0.5">New matching threads push to Signal Feed.</div>
                </div>
                <Switch checked={monitoring} onCheckedChange={setMonitoring} />
              </div>
            </>
          )}
        </div>

        <DialogFooter className="mt-5">
          <Button variant="tertiary" onClick={() => onOpenChange(false)} className="h-10 px-4 text-[13px]">Cancel</Button>
          <Button variant="primary" onClick={submit} disabled={phase !== "verified"} className="h-10 px-4 text-[13px]">
            <I.Plus className="w-3 h-3" /> Add subreddit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main ────────────────────────────────────────────────────────────────────
window.KeywordsAccounts = function KeywordsAccounts() {
  const D = window.EngageData;

  // ── Plan state (demo: starts on Starter to show locking) ─────────────────
  const [planId, setPlanId] = useStateKA("starter");
  const plan = PLAN_LIMITS[planId];
  const cyclePlan = () => {
    const order = ["starter", "pro", "enterprise"];
    setPlanId(order[(order.indexOf(planId) + 1) % order.length]);
  };
  const onUpgrade = () => setPlanId("pro");

  const [keywords, setKeywords] = useStateKA(D.seedKeywords);
  const [accounts, setAccounts] = useStateKA(D.seedAccounts);
  const [subs,     setSubs]     = useStateKA(D.seedSubs);
  const [newKw,    setNewKw]    = useStateKA("");
  const [paTab, setPaTab] = useStateKA("x"); // priority-accounts tab
  const [bannerDismissed, setBannerDismissed] = useStateKA(false);
  const [addAccountOpen, setAddAccountOpen] = useStateKA(false);
  const [addSubOpen,     setAddSubOpen]     = useStateKA(false);

  // ── Usage = items that count toward the plan (first N) ───────────────────
  const kwInPlan  = Math.min(keywords.length, plan.keywords);
  const accInPlan = Math.min(accounts.length, plan.accounts);
  const subInPlan = Math.min(subs.length,     plan.subs);
  const kwAtLimit  = keywords.length >= plan.keywords;
  const accAtLimit = accounts.length >= plan.accounts;
  const subAtLimit = subs.length     >= plan.subs;
  const anyAtLimit = kwAtLimit || accAtLimit || subAtLimit;

  const toggleKw = (id) => setKeywords((arr) => {
    const idx = arr.findIndex((k) => k.id === id);
    if (idx >= plan.keywords) return arr;
    return arr.map((k) => k.id === id ? { ...k, on: !k.on } : k);
  });
  const removeKw = (id) => setKeywords((arr) => arr.filter((k) => k.id !== id));
  const toggleAcc = (id) => setAccounts((arr) => {
    const idx = arr.findIndex((a) => a.id === id);
    if (idx >= plan.accounts) return arr;
    return arr.map((a) => a.id === id ? { ...a, on: !a.on } : a);
  });
  const removeAcc = (id) => setAccounts((arr) => arr.filter((a) => a.id !== id));
  const toggleSub = (id) => setSubs((arr) => {
    const idx = arr.findIndex((s) => s.id === id);
    if (idx >= plan.subs) return arr;
    return arr.map((s) => s.id === id ? { ...s, on: !s.on } : s);
  });
  const removeSub = (id) => setSubs((arr) => arr.filter((s) => s.id !== id));

  const addKw = (e) => {
    if (kwAtLimit) return;
    if (e.key === "Enter" && newKw.trim()) {
      setKeywords((arr) => [...arr, { id: "k" + Date.now(), text: newKw.trim(), type: "core", on: true, weekN: 0, posts: 0 }]);
      setNewKw("");
    }
  };

  return (
    <div className="px-8 pt-5 pb-6 flex flex-col gap-4 font-karla relative">
      {/* Demo plan-switcher (top-right) */}
      <div className="absolute top-3 right-8 z-10">
        <button
          onClick={cyclePlan}
          className="text-[10px] uppercase tracking-[0.06em] font-semibold text-primary/40 hover:text-primary border border-dashed border-primary/[0.15] px-2 h-6 rounded-md cursor-pointer inline-flex items-center gap-1.5 bg-white/80 backdrop-blur"
          title="Demo only — switch plan"
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-ffe253" />
          Plan: {plan.label} · switch
        </button>
      </div>

      {/* ── 2-col body ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-4 items-start">
        {/* ─── Keywords ──────────────────────────────────────── */}
        <KwaCard>
          <SectionHead
            stepN={1}
            title="Keywords"
            sub={<>Scans <b className="text-primary font-semibold">X</b> + <b className="text-primary font-semibold">Reddit</b> {plan.id === "starter" ? "every 24h" : "hourly"} · <b className="text-primary font-semibold">{keywords.slice(0, plan.keywords).filter((k)=>k.on).length}</b> active · matches feed into Signal Feed</>}
            right={
              <>
                <CountChip used={kwInPlan} max={plan.keywords} noun="keywords" />
                <AddOrUpgrade
                  atLimit={kwAtLimit}
                  planLabel={plan.label}
                  feature="Add more keywords"
                  lines={PRO_BULLETS.keywords}
                  onUpgrade={onUpgrade}
                  onAdd={() => document.getElementById("kw-input")?.focus()}
                  label="Add"
                />
              </>
            }
          />

          <div className="py-1">
            {keywords.map((kw, i) => (
              <KeywordRow
                key={kw.id}
                kw={kw}
                onToggle={toggleKw}
                onRemove={removeKw}
                overPlan={i >= plan.keywords}
                onUpgrade={onUpgrade}
              />
            ))}
          </div>

          {/* Footer: input when room, upsell when full */}
          {kwAtLimit ? (
            <div className="mx-5 mt-1.5 mb-4 flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] border border-yellow-ffe253 bg-yellow-fefbe3">
              <LockIcon className="w-3.5 h-3.5 text-primary shrink-0" />
              <div className="flex-1 text-[12px] text-primary/75 leading-snug">
                <b className="font-semibold text-primary">{plan.label} caps at {plan.keywords} keywords.</b> Pro unlocks 30 + hourly scans.
              </div>
              <button
                onClick={onUpgrade}
                className="h-7 px-2.5 inline-flex items-center gap-1 rounded-md bg-primary text-white text-[11.5px] font-semibold cursor-pointer hover:bg-primary/90"
              >
                Upgrade <I.ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="mx-5 mt-1.5 mb-4 flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] border border-dashed border-primary/[0.15] bg-gray-fafafa focus-within:border-primary focus-within:border-solid focus-within:bg-white transition-colors">
              <I.Plus className="w-3.5 h-3.5 text-primary/40" />
              <input
                id="kw-input"
                value={newKw}
                onChange={(e) => setNewKw(e.target.value)}
                onKeyDown={addKw}
                placeholder={`Add a keyword · ${plan.keywords === Infinity ? "unlimited" : `${plan.keywords - keywords.length} left`}`}
                className="flex-1 bg-transparent border-0 outline-none text-[13.5px] font-karla placeholder:text-primary/40"
              />
              <span className="text-[10.5px] text-primary/60 px-1.5 py-0.5 rounded bg-primary/[0.05]">Enter ⏎</span>
            </div>
          )}
        </KwaCard>

        {/* ─── Priority Accounts (X / Reddit tabs) ──────────── */}
        <KwaCard>
          <SectionHead
            stepN={2}
            title="Priority Accounts"
            sub={<>Push posts from these handles to Signal Feed — even when no keyword matches.</>}
          />

          {/* Tab bar */}
          <div className="px-5 pt-3 flex items-center gap-1 border-b border-primary/[0.05]">
            {[
              { id: "x",      label: "X",      Icon: I.PlatformX, used: accInPlan, max: plan.accounts },
              { id: "reddit", label: "Reddit", Icon: I.PlatformR, used: subInPlan, max: plan.subs     },
            ].map((t) => {
              const active = paTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setPaTab(t.id)}
                  className={cn(
                    "h-9 px-3 inline-flex items-center gap-1.5 text-[13px] font-semibold cursor-pointer border-b-2 -mb-px transition-colors",
                    active ? "border-primary text-primary" : "border-transparent text-primary/55 hover:text-primary"
                  )}
                >
                  <t.Icon size={11} />
                  {t.label}
                  <span className={cn(
                    "inline-flex items-center justify-center min-w-[20px] h-[18px] px-1.5 rounded text-[10px] tabular-nums font-semibold",
                    active ? "bg-primary text-white" : "bg-primary/[0.06] text-primary/60"
                  )}>
                    {t.used}<span className="opacity-60">/{t.max === Infinity ? "∞" : t.max}</span>
                  </span>
                </button>
              );
            })}
            <div className="flex-1" />
            {paTab === "x" && (
              <AddOrUpgrade
                atLimit={accAtLimit}
                planLabel={plan.label}
                feature="Add more X accounts"
                lines={PRO_BULLETS.accounts}
                onUpgrade={onUpgrade}
                onAdd={() => setAddAccountOpen(true)}
                label="Add"
              />
            )}
            {paTab === "reddit" && (
              <AddOrUpgrade
                atLimit={subAtLimit}
                planLabel={plan.label}
                feature="Add more subreddits"
                lines={PRO_BULLETS.subs}
                onUpgrade={onUpgrade}
                onAdd={() => setAddSubOpen(true)}
                label="Add"
              />
            )}
          </div>

          {/* Tab content */}
          {paTab === "x" && (
            <div>
              {accounts.length === 0 && (
                <PriorityEmpty kind="x" planLabel={plan.label} onUpgrade={onUpgrade} />
              )}
              {accounts.map((a, i) => (
                <AccountRow key={a.id} a={a} onToggle={toggleAcc} onRemove={removeAcc} overPlan={i >= plan.accounts} onUpgrade={onUpgrade} />
              ))}
              {accAtLimit && plan.accounts !== Infinity && accounts.length > 0 && (
                <button
                  onClick={onUpgrade}
                  className="w-full px-4 py-3 border-t border-dashed border-primary/[0.1] hover:bg-yellow-fbfbf3 cursor-pointer transition-colors flex items-center gap-2"
                >
                  <span className="w-[20px] h-[20px] rounded-full bg-primary/[0.05] inline-flex items-center justify-center text-primary/40">
                    <LockIcon className="w-2.5 h-2.5" />
                  </span>
                  <span className="text-[12px] text-primary/70 flex-1 text-left">
                    <b className="text-primary font-semibold">Pro</b> tracks up to 20 X accounts
                  </span>
                  <span className="text-[11.5px] font-semibold text-primary/70 inline-flex items-center gap-1">
                    Upgrade <I.ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              )}
            </div>
          )}
          {paTab === "reddit" && (
            <div>
              {subs.length === 0 && (
                <PriorityEmpty kind="reddit" planLabel={plan.label} onUpgrade={onUpgrade} />
              )}
              {subs.map((s, i) => (
                <SubRow key={s.id} s={s} onToggle={toggleSub} onRemove={removeSub} overPlan={i >= plan.subs} onUpgrade={onUpgrade} />
              ))}
              {subAtLimit && plan.subs !== Infinity && subs.length > 0 && (
                <button
                  onClick={onUpgrade}
                  className="w-full px-4 py-3 border-t border-dashed border-primary/[0.1] hover:bg-yellow-fbfbf3 cursor-pointer transition-colors flex items-center gap-2"
                >
                  <span className="w-[20px] h-[20px] rounded-full bg-primary/[0.05] inline-flex items-center justify-center text-primary/40">
                    <LockIcon className="w-2.5 h-2.5" />
                  </span>
                  <span className="text-[12px] text-primary/70 flex-1 text-left">
                    <b className="text-primary font-semibold">Pro</b> tracks up to 20 subreddits
                  </span>
                  <span className="text-[11.5px] font-semibold text-primary/70 inline-flex items-center gap-1">
                    Upgrade <I.ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              )}
            </div>
          )}
        </KwaCard>
      </div>

      {/* ── Starter limits banner (dismissible) ──────────────── */}
      {anyAtLimit && plan.id === "starter" && !bannerDismissed && (
        <div className="mt-1">
          <StarterLimitsBanner
            planLabel={plan.label}
            onUpgrade={onUpgrade}
            onDismiss={() => setBannerDismissed(true)}
          />
        </div>
      )}

      <AddAccountDialog
        open={addAccountOpen}
        onOpenChange={setAddAccountOpen}
        onAdd={(acc) => setAccounts((arr) => [acc, ...arr])}
      />
      <AddSubredditDialog
        open={addSubOpen}
        onOpenChange={setAddSubOpen}
        onAdd={(sub) => setSubs((arr) => [sub, ...arr])}
      />
    </div>
  );
};
