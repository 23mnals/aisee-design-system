/* global React, window */
/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// reply-panel.jsx (v5 — single "Configure your reply" workspace + Continue)
//
// v5 spec changes per dapp-design.v5.md §13.5.4:
//   1. No 2-step OuterSteps. Single Configure block + Continue at bottom
//   2. Required / Optional pills on every step header
//   3. Length labels are CHAR COUNTS (~80 / ~280 / 500+)
//   4. Mention is TAG PILLS + Add button (not free text input)
//   5. Continue button is disabled-gray when required fields unfilled
// ─────────────────────────────────────────────────────────────────────────────

const { useState: useStateRP, useEffect: useEffectRP } = React;
const { cn, Button } = window;
const I = window.Icons;

// ── Required / Optional pill ──────────────────────────────────────────────
function ReqPill({ required }) {
  if (required) {
    return (
      <span className="inline-flex items-center h-[18px] px-1.5 rounded text-[10px] font-bold uppercase tracking-[0.04em] bg-yellow-ffe253 text-primary">
        Required
      </span>
    );
  }
  return (
    <span className="inline-flex items-center h-[18px] px-1.5 rounded text-[10px] font-medium uppercase tracking-[0.04em] bg-primary/[0.06] text-primary/60 border border-primary/[0.08]">
      Optional
    </span>
  );
}

// ── Numbered step header (number badge + title + Required/Optional pill) ─
function StepHeader({ num, title, hint, complete, required, optional, expanded, onToggle, collapsible }) {
  return (
    <button
      type={collapsible ? "button" : undefined}
      onClick={collapsible ? onToggle : undefined}
      className={cn(
        "flex items-center gap-2 w-full text-left",
        collapsible && "cursor-pointer"
      )}
    >
      <span className={cn(
        "w-[18px] h-[18px] rounded-full text-[10px] font-bold inline-flex items-center justify-center shrink-0",
        optional
          ? "bg-white text-primary/50 border border-dashed border-primary/30"
          : complete ? "bg-yellow-ffe253 text-primary" : "bg-primary text-white"
      )}>
        {complete ? <I.Check className="w-2.5 h-2.5" /> : num}
      </span>
      <span className={cn(
        "text-[12px] font-semibold uppercase tracking-[0.04em]",
        optional ? "text-primary/70" : "text-primary"
      )}>{title}</span>
      {required && <ReqPill required />}
      {optional && <ReqPill required={false} />}
      {hint && <span className="text-[11px] text-primary/60 ml-auto truncate">{hint}</span>}
      {collapsible && (
        <I.ChevronDown className={cn("w-3 h-3 text-primary/50 shrink-0 transition-transform", expanded && "rotate-180")} />
      )}
    </button>
  );
}

// ── Length micro chart (3 bars) ───────────────────────────────────────────
function LengthBars({ level, selected }) {
  // level: 1 (Short) / 2 (Medium) / 3 (Long)
  const heights = [5, 8, 11];
  return (
    <span className="flex items-end gap-[2px] h-3">
      {heights.map((h, i) => {
        const lit = i < level;
        return (
          <span key={i}
            className={cn(
              "w-[3px] rounded-sm",
              lit
                ? (selected ? "bg-primary" : "bg-primary/30")
                : (selected ? "bg-primary/30" : "bg-primary/15")
            )}
            style={{ height: h }}
          />
        );
      })}
    </span>
  );
}

window.ReplyPanel = function ReplyPanel({ post, onClose }) {
  const D = window.EngageData;

  const [strategy, setStrategy] = useStateRP("expert");
  const [length, setLength] = useStateRP("short");        // v5: default Short
  const [mentionOpen, setMentionOpen] = useStateRP(true); // v5 figma shows expanded
  const [mentionTags, setMentionTags] = useStateRP(["aisee"]);
  const [mentionInput, setMentionInput] = useStateRP("");
  const [intensity, setIntensity] = useStateRP(2);

  useEffectRP(() => {
    setStrategy("expert");
    setLength("short");
    setMentionOpen(true);
    setMentionTags(["aisee"]);
    setMentionInput("");
    setIntensity(2);
  }, [post?.id]);

  const intensityLabels = ["Don't mention", "Subtle", "Natural", "Direct"];
  const lengthOpts = [
    { id: "short",  label: "Short",  hint: "~80 chars",  bars: 1 },
    { id: "medium", label: "Medium", hint: "~280 chars", bars: 2 },
    { id: "long",   label: "Long",   hint: "500+ chars", bars: 3 },
  ];

  const addMention = () => {
    const v = mentionInput.trim();
    if (v && !mentionTags.includes(v)) {
      setMentionTags([...mentionTags, v]);
    }
    setMentionInput("");
  };
  const removeMention = (t) => setMentionTags(mentionTags.filter((x) => x !== t));

  const onMentionKey = (e) => {
    if (e.key === "Enter") { e.preventDefault(); addMention(); }
    else if (e.key === "Backspace" && !mentionInput && mentionTags.length > 0) {
      setMentionTags(mentionTags.slice(0, -1));
    }
  };

  // Both required fields default-filled, so "Continue" is enabled by default
  // — but if user clears a required field by some means, disable
  const canContinue = !!strategy && !!length;

  if (!post) return null;

  return (
    <div
      key={post.id}
      className="relative sticky top-6 bg-white border border-primary/[0.05] rounded-xl p-5 flex flex-col gap-4 max-h-[calc(100vh-118px)] overflow-y-auto font-karla"
    >
      {/* Head */}
      <div className="grid grid-cols-[1fr_auto] gap-x-3 items-start">
        <div className="col-start-1">
          <div className="text-[16px] font-semibold">Generate reply</div>
          <div className="text-[12px] text-primary/60 flex items-center gap-1.5 mt-0.5">
            {post.platform === "x" ? (
              <span className="w-[18px] h-[18px] rounded-md bg-primary text-white inline-flex items-center justify-center">
                <I.PlatformX size={9} />
              </span>
            ) : (
              <span className="w-[18px] h-[18px] rounded-md bg-red-ec5212 text-white inline-flex items-center justify-center">
                <I.PlatformR />
              </span>
            )}
            <span>{post.user.handle}</span>
            <span className="text-primary/40">·</span>
            <span>{post.time} ago</span>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="col-start-2 row-start-1 row-span-2 w-7 h-7 rounded-md inline-flex items-center justify-center text-primary/60 hover:bg-primary/[0.05] hover:text-primary cursor-pointer transition-colors"
        >
          <I.X className="w-4 h-4" />
        </button>
      </div>

      {/* Post preview */}
      <div className="bg-gray-fafafa rounded-[10px] border border-primary/[0.05] px-3.5 py-3 text-[13px] leading-[1.5]">
        <div className="flex items-center gap-1.5 mb-1.5 text-[12px] text-primary/60">
          <span className="w-5 h-5 rounded-full bg-yellow-fffadd text-primary text-[10px] font-semibold inline-flex items-center justify-center">
            {post.user.avatar}
          </span>
          <b className="text-primary font-semibold text-[12px]">{post.user.handle}</b>
          {post.user.followers && <span className="text-primary/40 ml-0.5">{post.user.followers}</span>}
        </div>
        <div className="text-primary text-[13px]">{post.body}</div>
        <button className="text-[11px] text-primary/55 hover:text-primary cursor-pointer mt-1.5">See more ▾</button>
      </div>

      {/* "Configure your reply" header */}
      <div className="flex items-center gap-2 pt-1">
        <span className="w-[20px] h-[20px] rounded-full bg-primary text-white text-[11px] font-bold inline-flex items-center justify-center">1</span>
        <span className="text-[13px] font-semibold">Configure your reply</span>
        <span className="ml-auto text-[11px] text-primary/55">Auto-regenerates on change</span>
      </div>

      {/* Step 1 — Reply Strategy [Required] */}
      <div className="flex flex-col gap-2">
        <StepHeader num="1" title="Reply Strategy" hint="Pick the angle" required complete={!!strategy} />
        <div className="flex flex-wrap gap-1.5">
          {D.strategies.map((s) => {
            const StratIcon = I[s.icon] || I.Sparkles;
            const on = strategy === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setStrategy(s.id)}
                title={s.ttl + " — " + s.sub}
                className={cn(
                  "h-8 px-2.5 rounded-lg border text-[12.5px] font-medium inline-flex items-center gap-1.5 cursor-pointer transition-colors",
                  on
                    ? "bg-yellow-ffe253 border-primary"
                    : "bg-white border-primary/[0.05] hover:border-primary/[0.18]"
                )}
              >
                <StratIcon className={cn("w-3.5 h-3.5 shrink-0", on ? "text-primary" : "text-primary/55")} />
                {s.ttl}
              </button>
            );
          })}
        </div>
        {/* Hint line: shows the selected strategy's description so meaning isn't lost */}
        <div className="text-[11px] text-primary/60 inline-flex items-center gap-1.5">
          <I.Info className="w-3 h-3 text-primary/40 shrink-0" />
          {(() => {
            const sel = D.strategies.find((s) => s.id === strategy);
            return sel ? <><b className="text-primary/75 font-semibold">{sel.ttl}</b> — {sel.sub}</> : "Pick how the reply should approach the conversation.";
          })()}
        </div>
      </div>

      {/* Step 2 — Length [Required] — v5 char-count labels */}
      <div className="flex flex-col gap-2">
        <StepHeader num="2" title="Length" hint="How long the reply should be" required complete={!!length} />
        <div className="grid grid-cols-3 gap-2">
          {lengthOpts.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setLength(opt.id)}
              className={cn(
                "px-2.5 py-2 rounded-[10px] border text-left cursor-pointer transition-colors",
                length === opt.id
                  ? "bg-yellow-ffe253 border-primary"
                  : "bg-white border-primary/[0.05] hover:border-primary/[0.18]"
              )}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <LengthBars level={opt.bars} selected={length === opt.id} />
                <div className="text-[13px] font-semibold">{opt.label}</div>
              </div>
              <div className={cn("text-[11px]", length === opt.id ? "text-primary/70" : "text-primary/60")}>{opt.hint}</div>
            </button>
          ))}
        </div>
        <div className="text-[11px] text-primary/60 inline-flex items-center gap-1.5 mt-0.5">
          <I.Info className="w-3 h-3 text-primary/40 shrink-0" />
          3–5 sentences · all-purpose default · fits both X and Reddit replies.
        </div>
      </div>

      {/* Step + — Mention Intensity [Optional] */}
      <div className="flex flex-col gap-2">
        <StepHeader
          num="+"
          title="Mention Intensity"
          hint={mentionOpen ? "What to bring up & how hard" : "Add a mention"}
          optional
          collapsible
          expanded={mentionOpen}
          onToggle={() => setMentionOpen((v) => !v)}
        />

        {mentionOpen && (
          <div className="bg-gray-fafafa border border-dashed border-primary/[0.18] rounded-[10px] p-3.5 flex flex-col gap-3">
            {/* Tag pill input — v5 hybrid */}
            <div>
              <label className="text-[12px] font-medium text-primary block mb-1.5">What to mention</label>
              <div className="flex items-stretch gap-2">
                <div className="flex-1 flex items-center gap-1.5 flex-wrap min-h-[36px] px-2 py-1.5 rounded-lg border border-primary/[0.05] bg-white">
                  {mentionTags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 h-6 px-2 rounded-md bg-yellow-ffe253 text-[12.5px] font-medium text-primary">
                      {t}
                      <button onClick={() => removeMention(t)} className="hover:text-primary/60 cursor-pointer">
                        <I.X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    value={mentionInput}
                    onChange={(e) => setMentionInput(e.target.value)}
                    onKeyDown={onMentionKey}
                    placeholder={mentionTags.length === 0 ? "Enter or click to add" : ""}
                    className="flex-1 min-w-[80px] bg-transparent border-0 outline-none text-[13px] font-karla placeholder:text-primary/40"
                  />
                </div>
                <button
                  onClick={addMention}
                  className="h-9 px-3 rounded-lg border border-primary/[0.05] bg-white text-[12.5px] font-semibold text-primary hover:border-primary/[0.18] cursor-pointer transition-colors inline-flex items-center gap-1"
                >
                  <I.Plus className="w-3 h-3" /> Add
                </button>
              </div>
              <div className="text-[11px] text-primary/60 mt-1.5 inline-flex items-center gap-1.5">
                <I.Info className="w-3 h-3 text-primary/40" />
                Enter or click to add · ⌫ on empty to remove last
              </div>
            </div>

            {/* Intensity slider */}
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-[12px] font-medium text-primary">How Strongly</span>
                <span className="text-[12px] font-semibold text-primary">{intensityLabels[intensity]}</span>
              </div>
              <div
                className="relative h-9 cursor-pointer"
                onClick={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - r.left) / r.width;
                  setIntensity(Math.max(0, Math.min(3, Math.round(pct * 3))));
                }}
              >
                <div className="absolute left-0 right-0 top-[17px] h-0.5 bg-primary/[0.08] rounded" />
                <div className="absolute left-0 top-[17px] h-0.5 bg-primary rounded" style={{ width: `${(intensity / 3) * 100}%` }} />
                <div
                  className="absolute top-[9px] w-[18px] h-[18px] rounded-full bg-yellow-ffe253 border-2 border-primary cursor-grab"
                  style={{ left: `${(intensity / 3) * 100}%`, transform: "translateX(-50%)" }}
                />
              </div>
              <div className="grid grid-cols-4 text-[11px] text-primary/60 mt-1">
                {intensityLabels.map((l, i) => (
                  <span key={i}
                    className={cn(
                      i === 0 ? "text-left" : i === 3 ? "text-right" : "text-center",
                      i === intensity && "text-primary font-semibold"
                    )}>{l}</span>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-primary/60 inline-flex items-center gap-1.5">
              <I.Info className="w-3 h-3 text-primary/40 shrink-0" />
              Woven into the reply where it genuinely fits the answer.
            </div>
          </div>
        )}
      </div>

      {/* Empty draft placeholder */}
      <div className="rounded-[10px] border border-dashed border-primary/[0.12] px-4 py-5 text-center"
        style={{ backgroundColor: "#FBFBF3" }}>
        <div className="inline-flex w-9 h-9 rounded-full bg-white border border-primary/[0.05] items-center justify-center text-primary mb-2">
          <I.Pencil className="w-4 h-4" />
        </div>
        <div className="text-[13px] text-primary/60">
          Pick a strategy, optionally guide the angle, set intensity — then generate.
        </div>
      </div>

      {/* Bottom: Continue button — disabled gray when required fields missing */}
      <div className="pt-3 border-t border-primary/[0.05]">
        <button
          disabled={!canContinue}
          className={cn(
            "w-full h-11 rounded-[10px] inline-flex items-center justify-center gap-1.5 text-[14px] font-semibold transition-colors cursor-pointer",
            canContinue
              ? "bg-yellow-ffe253 text-primary hover:bg-yellow-fceb63"
              : "bg-primary/[0.06] text-primary/50 cursor-not-allowed"
          )}
        >
          Continue <I.ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
