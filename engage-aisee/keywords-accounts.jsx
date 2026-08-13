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

// ── Card wrapper ────────────────────────────────────────────────────────────
function KwaCard({ children }) {
  return (
    <div className="bg-white rounded-[14px] border border-primary/[0.05] overflow-hidden">
      {children}
    </div>
  );
}

function CardHead({ stepN, stepLabel, title, sub, right }) {
  return (
    <div className="px-5 pt-5 pb-3.5 flex items-start gap-3 border-b border-dashed border-primary/[0.05]">
      <div className="flex-1 min-w-0">
        <h3 className="font-karla text-[16px] font-bold m-0 inline-flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 h-5 pl-1.5 pr-2 rounded-full bg-primary/[0.04] text-[10px] font-semibold text-primary/60 uppercase tracking-[0.04em]">
            <span className="w-4 h-4 rounded-full bg-primary text-white inline-flex items-center justify-center text-[10px] font-bold">{stepN}</span>
            {stepLabel}
          </span>
          {title}
        </h3>
        <div className="text-[12px] text-primary/60 mt-1">{sub}</div>
      </div>
      {right}
    </div>
  );
}

function Stepper({ active }) {
  const steps = [
    { n: 1, label: "Keywords" },
    { n: 2, label: "X accounts" },
    { n: 3, label: "Reddit subs" },
  ];
  return (
    <div className="inline-flex items-center gap-2 text-[12px] text-primary/60 font-karla">
      {steps.map((s, i) => (
        <React.Fragment key={s.n}>
          <span className={cn("inline-flex items-center gap-1.5", active === s.n ? "text-primary font-semibold" : "")}>
            <span className={cn(
              "w-4 h-4 rounded-full inline-flex items-center justify-center text-[10px] font-bold",
              active === s.n ? "bg-primary text-white" : "bg-primary/[0.08] text-primary/60"
            )}>{s.n}</span>
            {s.label}
          </span>
          {i < steps.length - 1 && <span className="text-primary/30">→</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Keyword row ─────────────────────────────────────────────────────────────
function KeywordRow({ kw, onToggle }) {
  const pct = Math.min(100, Math.round((kw.weekN / MAX_WEEK) * 100));
  return (
    <div className="grid grid-cols-[1fr_auto] gap-x-4 items-center px-5 py-3.5 border-t border-primary/[0.05] first:border-t-0 hover:bg-primary/[0.015] transition-colors">
      <div className="flex flex-col gap-2 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[14px] font-semibold">{kw.text}</span>
          <span className={cn("inline-flex items-center h-[20px] px-2 rounded-full text-[10px] font-semibold uppercase tracking-[0.04em]", TYPE_TAG[kw.type])}>
            {TYPE_LABEL[kw.type]}
          </span>
        </div>
        <div className="flex items-center gap-3.5">
          <div className="w-[220px] h-1 rounded bg-primary/[0.06] overflow-hidden">
            <span className={cn("block h-full rounded transition-all", TYPE_BAR[kw.type])} style={{ width: `${pct}%` }} />
          </div>
          <span className="text-[12px] text-primary/60 tabular-nums"><b className="text-primary font-semibold">{kw.weekN}</b> this week</span>
          {kw.posts > 0 && (
            <button className="text-[12px] font-semibold text-primary inline-flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-fffadd hover:bg-yellow-fff2b3 cursor-pointer transition-colors">
              {kw.posts} {kw.posts === 1 ? "post" : "posts"} <I.ChevronDown className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      </div>
      <Switch checked={kw.on} onCheckedChange={() => onToggle(kw.id)} />
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

  const [keywords, setKeywords] = useStateKA(D.seedKeywords);
  const [accounts, setAccounts] = useStateKA(D.seedAccounts);
  const [subs,     setSubs]     = useStateKA(D.seedSubs);
  const [newKw,    setNewKw]    = useStateKA("");
  const [autoReply, setAutoReply] = useStateKA(false);
  const [addAccountOpen, setAddAccountOpen] = useStateKA(false);
  const [addSubOpen,     setAddSubOpen]     = useStateKA(false);

  const kwActive  = keywords.filter((k) => k.on).length;
  const accActive = accounts.filter((a) => a.on).length;
  const subActive = subs.filter((s) => s.on).length;

  const toggleKw  = (id) => setKeywords((arr) => arr.map((k) => k.id === id ? { ...k, on: !k.on } : k));
  const toggleAcc = (id) => setAccounts((arr) => arr.map((a) => a.id === id ? { ...a, on: !a.on } : a));
  const toggleSub = (id) => setSubs((arr) => arr.map((s) => s.id === id ? { ...s, on: !s.on } : s));
  const removeAcc = (id) => setAccounts((arr) => arr.filter((a) => a.id !== id));

  const addKw = (e) => {
    if (e.key === "Enter" && newKw.trim()) {
      setKeywords((arr) => [...arr, { id: "k" + Date.now(), text: newKw.trim(), type: "core", on: true, weekN: 0, posts: 0 }]);
      setNewKw("");
    }
  };

  return (
    <div className="px-8 pt-5 pb-12 flex flex-col gap-4 font-karla">
      {/* Top: X auto-reply */}
      <div className="bg-white border border-primary/[0.05] rounded-[14px] px-5 py-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="text-[14px] font-semibold inline-flex items-center gap-2">
            <I.PlatformX size={13} />
            X Auto-reply
            <span className={cn(
              "inline-flex items-center h-5 px-2 rounded-full text-[10px] font-semibold uppercase tracking-[0.04em]",
              autoReply ? "bg-green-cfff29 text-primary" : "bg-primary/[0.06] text-primary/60"
            )}>{autoReply ? "On" : "Off"}</span>
          </div>
          <div className="text-[12px] text-primary/60 mt-1">
            {autoReply
              ? "Auto-reply is active. Configure accounts and quiet hours below."
              : "Turn on to let Engage reply automatically using your selected accounts."}
          </div>
        </div>
        <Switch checked={autoReply} onCheckedChange={setAutoReply} />
      </div>

      <Stepper active={1} />

      {/* ── 1. Keywords ──────────────────────────────────────── */}
      <KwaCard>
        <CardHead
          stepN="1" stepLabel="Pick first"
          title="Keywords"
          sub={<>Scans <b className="text-primary font-semibold">X</b> + <b className="text-primary font-semibold">Reddit</b> every 24 hours · <b className="text-primary font-semibold">{kwActive}</b> active · matches feed into Signal Feed</>}
          right={
            <Button variant="secondary" className="h-8 px-3.5 text-[13px] font-semibold border border-primary/[0.08]">
              <I.Plus className="w-3 h-3" /> Add
            </Button>
          }
        />
        <div className="py-1 pb-2">
          {keywords.map((kw) => <KeywordRow key={kw.id} kw={kw} onToggle={toggleKw} />)}
        </div>
        <div className="mx-5 mt-2 mb-4 flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] border border-dashed border-primary/[0.15] bg-gray-fafafa focus-within:border-primary focus-within:border-solid focus-within:bg-white transition-colors">
          <I.Plus className="w-3.5 h-3.5 text-primary/40" />
          <input
            value={newKw}
            onChange={(e) => setNewKw(e.target.value)}
            onKeyDown={addKw}
            placeholder="Add a keyword, press Enter to confirm"
            className="flex-1 bg-transparent border-0 outline-none text-[13.5px] font-karla placeholder:text-primary/40"
          />
          <span className="text-[11px] text-primary/60 px-1.5 py-0.5 rounded bg-primary/[0.05]">Enter ⏎</span>
        </div>
      </KwaCard>

      {/* ── 2. Priority Accounts ─────────────────────────────── */}
      <KwaCard>
        <CardHead
          stepN="2" stepLabel="X config"
          title="Priority Accounts"
          sub={<>When these accounts post, push to Signal Feed regardless of keyword match · <b className="text-primary font-semibold">{accActive}</b> tracked</>}
          right={
            <Button variant="secondary" onClick={() => setAddAccountOpen(true)} className="h-8 px-3.5 text-[13px] font-semibold border border-primary/[0.08]">
              <I.Plus className="w-3 h-3" /> Add account
            </Button>
          }
        />
        <div className="py-1 pb-3">
          {accounts.map((a) => (
            <div key={a.id} className="grid grid-cols-[38px_1fr_auto] gap-3.5 items-center px-5 py-3 border-t border-primary/[0.05] first:border-t-0 hover:bg-primary/[0.015] transition-colors">
              <div className="w-[38px] h-[38px] rounded-full bg-primary/[0.08] inline-flex items-center justify-center font-bold text-[14px] text-primary">
                {a.initial}
              </div>
              <div className="min-w-0">
                <div className="text-[14px] font-semibold flex items-center gap-1.5">
                  {a.handle}
                  <span className="inline-flex items-center h-[22px] px-2 rounded-md bg-primary text-white text-[11px] font-semibold gap-1"><I.PlatformX size={9} /></span>
                </div>
                <div className="text-[12px] text-primary/60 mt-0.5">{a.role}</div>
              </div>
              <div className="flex items-center gap-2.5">
                <Switch checked={a.on} onCheckedChange={() => toggleAcc(a.id)} />
                <button
                  onClick={() => removeAcc(a.id)}
                  aria-label="Remove"
                  className="w-[26px] h-[26px] rounded-md inline-flex items-center justify-center text-primary/40 hover:bg-primary/[0.06] hover:text-primary cursor-pointer transition-colors"
                >
                  <I.X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </KwaCard>

      {/* ── 3. Subreddits ───────────────────────────────────── */}
      <KwaCard>
        <CardHead
          stepN="3" stepLabel="Reddit config"
          title="Subreddits"
          sub={<>Monitor keyword-matching posts in these communities · <b className="text-primary font-semibold">{subActive}</b> active</>}
          right={
            <Button variant="outlined" onClick={() => setAddSubOpen(true)} className="h-8 px-3.5 text-[13px] font-semibold">
              <I.Plus className="w-3 h-3" /> Add subreddit
            </Button>
          }
        />
        <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {subs.map((s) => (
            <button
              key={s.id}
              onClick={() => toggleSub(s.id)}
              className={cn(
                "flex items-center gap-3 px-3.5 py-3 rounded-[10px] border text-left cursor-pointer transition-colors",
                s.on ? "bg-yellow-fffadd border-primary/[0.15]" : "bg-gray-fafafa border-primary/[0.05] hover:border-primary/[0.18]"
              )}
            >
              <span className="w-[30px] h-[30px] rounded-lg bg-red-ec5212 text-white inline-flex items-center justify-center text-[12px] font-bold"><I.PlatformR /></span>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold">{s.name}</div>
                <div className="text-[11px] text-primary/60 mt-0.5">{s.members} members</div>
              </div>
              <Switch checked={s.on} onCheckedChange={(v) => toggleSub(s.id)} />
            </button>
          ))}
        </div>
      </KwaCard>

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
