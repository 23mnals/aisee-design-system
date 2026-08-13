/* global React, window */
/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// initial-config.jsx → app/(pages)/engage/_components/initial-config.tsx
//
// First-run setup: pick keywords, tracked accounts, and subreddits, then
// hit "Start tracking posts" to switch into the main feed view.
// ─────────────────────────────────────────────────────────────────────────────

const { useState: useStateIC } = React;
const { cn, Button, Switch, EngageBanner } = window;
const I = window.Icons;

// ── Custom checkbox to match the prototype's filled-yellow checked state ────
function YellowCheckbox({ checked, className }) {
  return (
    <span
      className={cn(
        "w-[18px] h-[18px] rounded border-[1.5px] border-primary shrink-0 inline-flex items-center justify-center transition-colors",
        checked ? "bg-yellow-ffe253" : "bg-white",
        className
      )}
    >
      {checked && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m20 6-11 11-5-5" />
        </svg>
      )}
    </span>
  );
}

// ── Card wrapper used by all three config sections ─────────────────────────
function CfgCard({ children, className }) {
  return (
    <div className={cn("bg-white rounded-2xl border border-primary/[0.05] p-5 flex flex-col gap-3.5", className)}>
      {children}
    </div>
  );
}

function SectionHead({ title, sub, right }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-1 min-w-0">
        <h3 className="font-karla font-bold text-[17px] leading-tight m-0">{title}</h3>
        <div className="text-[13px] text-primary/60 mt-0.5">{sub}</div>
      </div>
      {right}
    </div>
  );
}

function CountPill({ children, variant = "yellow" }) {
  const map = {
    yellow: "bg-green-eff4e2 text-green-8c7400",
    danger: "bg-red-ffd0d0 text-red-ec5212",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-semibold", map[variant])}>
      {children}
    </span>
  );
}

window.InitialConfig = function InitialConfig({ onStart }) {
  const D = window.EngageData;

  const [keywords, setKeywords] = useStateIC([
    { id: "k1", text: "GEO optimization",     checked: true,  tag: null },
    { id: "k2", text: "AI search visibility", checked: true,  tag: null },
    { id: "k3", text: "ChatGPT SEO",          checked: false, tag: null },
    { id: "k4", text: "Perplexity marketing", checked: true,  tag: null },
    { id: "k5", text: "generative search",    checked: true,  tag: null },
    { id: "k6", text: "AISEE",                checked: true,  tag: "brand" },
    { id: "k7", text: "Semrush AI",           checked: false, tag: "competitor" },
  ]);
  const [newKw, setNewKw] = useStateIC("");
  const [accounts, setAccounts] = useStateIC(D.seedAccounts.map((a) => ({ ...a })));
  const [subs, setSubs]         = useStateIC(D.seedSubs.map((s) => ({ ...s })));

  const kwActive  = keywords.filter((k) => k.checked).length;
  const subActive = subs.filter((s) => s.on).length;
  const accActive = accounts.filter((a) => a.on).length;

  const toggleKw  = (id) => setKeywords((arr) => arr.map((k) => k.id === id ? { ...k, checked: !k.checked } : k));
  const toggleSub = (id) => setSubs((arr) => arr.map((s) => s.id === id ? { ...s, on: !s.on } : s));
  const toggleAcc = (id) => setAccounts((arr) => arr.map((a) => a.id === id ? { ...a, on: !a.on } : a));
  const removeAcc = (id) => setAccounts((arr) => arr.filter((a) => a.id !== id));
  const addKw = (e) => {
    if (e.key === "Enter" && newKw.trim()) {
      setKeywords((arr) => [...arr, { id: "k" + Date.now(), text: newKw.trim(), checked: true, tag: null }]);
      setNewKw("");
    }
  };

  return (
    <div className="font-karla">
      <EngageBanner
        variant="lime"
        title="Engage — Initial Setup"
        subtitle="Configure keywords and accounts. We'll scan X & Reddit every 24 hours for relevant conversations."
        stats={[
          { label: "Keywords",   value: kwActive },
          { label: "Subreddits", value: subActive },
          { label: "Accounts",   value: accActive },
        ]}
      />

      <div className="px-6 pt-4 pb-8 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-5">
        {/* ── Keywords ─────────────────────────────────────────── */}
        <CfgCard>
          <SectionHead
            title="Keywords"
            sub="We'll continuously track these terms on X and Reddit."
            right={<CountPill>{kwActive} active</CountPill>}
          />

          <div className="flex flex-col gap-0.5">
            {keywords.map((k) => (
              <button
                key={k.id}
                onClick={() => toggleKw(k.id)}
                className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-left cursor-pointer hover:bg-primary/[0.03] transition-colors"
              >
                <YellowCheckbox checked={k.checked} />
                <span className="text-[14px] font-medium flex-1">{k.text}</span>
                {k.tag === "brand" && (
                  <span className="inline-flex items-center px-2 h-[22px] rounded-full text-[11px] font-medium bg-yellow-fff2b3">Brand</span>
                )}
                {k.tag === "competitor" && (
                  <span className="inline-flex items-center px-2 h-[22px] rounded-full text-[11px] font-medium bg-red-ffd0d0">Competitor</span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-dashed border-primary/[0.12] bg-gray-fafafa">
            <I.Plus className="w-3.5 h-3.5 text-primary/40" />
            <input
              type="text"
              placeholder="Add custom keyword, press Enter"
              value={newKw}
              onChange={(e) => setNewKw(e.target.value)}
              onKeyDown={addKw}
              className="flex-1 bg-transparent border-0 outline-none text-[14px] font-karla placeholder:text-primary/40"
            />
            <span className="text-[11px] text-primary/60">Enter ⏎</span>
          </div>
        </CfgCard>

        {/* ── Right column: Accounts + Subreddits ──────────────── */}
        <div className="flex flex-col gap-5">
          {/* Tracked accounts */}
          <CfgCard>
            <SectionHead
              title="Tracked Accounts"
              sub="When these accounts post relevant content, push to feed."
              right={
                <Button variant="secondary" className="h-[30px] px-3 text-[13px]">
                  <I.Plus className="w-3 h-3" /> Add
                </Button>
              }
            />
            <div>
              {accounts.map((a, idx) => (
                <div key={a.id} className={cn("flex items-center gap-3 py-2.5", idx < accounts.length - 1 && "border-b border-dashed border-primary/[0.05]")}>
                  <div className="w-8 h-8 rounded-full bg-primary/[0.08] inline-flex items-center justify-center font-bold text-[13px]">
                    {a.handle[1].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[14px] truncate">{a.handle}</div>
                    <div className="text-[12px] text-primary/60">{a.role}</div>
                  </div>
                  <button
                    onClick={() => removeAcc(a.id)}
                    aria-label="Remove"
                    className="w-[26px] h-[26px] rounded-md bg-primary text-white inline-flex items-center justify-center cursor-pointer hover:bg-[#333] transition-colors"
                  >
                    <I.X className="w-3 h-3" />
                  </button>
                  <Switch checked={a.on} onCheckedChange={() => toggleAcc(a.id)} />
                </div>
              ))}
            </div>
          </CfgCard>

          {/* Subreddits */}
          <CfgCard>
            <SectionHead
              title="Reddit Subreddits"
              sub="Monitor keyword-matching posts in these communities."
              right={<CountPill>{subActive} active</CountPill>}
            />

            <div className="grid grid-cols-2 gap-2">
              {subs.map((s) => (
                <button
                  key={s.id}
                  onClick={() => toggleSub(s.id)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] border text-left cursor-pointer transition-colors",
                    s.on
                      ? "bg-yellow-fffadd border-primary/[0.15]"
                      : "bg-white border-primary/[0.05] hover:bg-primary/[0.02]"
                  )}
                >
                  <YellowCheckbox checked={s.on} />
                  <span className="w-[26px] h-[26px] rounded-md bg-red-ec5212 text-white inline-flex items-center justify-center text-[11px] font-bold">r/</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[14px] leading-tight truncate">{s.name}</div>
                    <div className="text-[11px] text-primary/60">{s.members} members</div>
                  </div>
                </button>
              ))}
            </div>

            <button className="inline-flex items-center gap-1.5 self-start text-[13px] font-medium text-red-ec5212 hover:underline cursor-pointer">
              <I.Plus className="w-3 h-3" /> Add subreddit
            </button>
          </CfgCard>
        </div>
      </div>

      {/* ── Footer summary + Start CTA ─────────────────────────── */}
      <div className="mx-6 mb-8 bg-white rounded-2xl border border-primary/[0.05] px-6 py-4 flex items-center gap-3.5">
        <div className="flex-1 flex items-center gap-2 flex-wrap text-[14px] text-primary/60">
          <span className="inline-flex items-center gap-1.5 font-semibold text-green-92bc01">
            <I.Check className="w-3.5 h-3.5" /> Setup complete
          </span>
          <span>·</span>
          <span><b className="text-primary font-semibold">{kwActive}</b> keywords</span>
          <span>·</span>
          <span><b className="text-primary font-semibold">{subActive}</b> subreddits</span>
          <span>·</span>
          <span><b className="text-primary font-semibold">{accActive}</b> accounts</span>
          <span>·</span>
          <span>scans every <b className="text-primary font-semibold">24 hours</b></span>
        </div>
        <Button
          variant="secondary"
          onClick={onStart}
          className="h-11 px-5 text-[15px] font-bold rounded-[12px] border border-primary/[0.08]"
        >
          <I.Rocket className="w-4 h-4" /> Start tracking posts
        </Button>
      </div>
    </div>
  );
};
