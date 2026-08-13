/* global React, window */
/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// reply-panel.jsx → app/(pages)/engage/_components/reply-panel.tsx
//
// Two-step reply flow:
//   Step 1 → strategy + length + (optional mention) + AI draft (typewriter)
//   Step 2 → copy draft, post on X manually, paste reply link back for tracking
// ─────────────────────────────────────────────────────────────────────────────

const { useState: useStateRP, useEffect: useEffectRP } = React;
const { cn, Button } = window;
const I = window.Icons;

// ── Outer 2-step indicator ──────────────────────────────────────────────────
function OuterSteps({ step }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-3.5 py-3 bg-gray-fafafa border border-primary/[0.05] rounded-[10px]">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className={cn(
          "w-[22px] h-[22px] rounded-full text-[11px] font-bold inline-flex items-center justify-center shrink-0",
          step > 1 ? "bg-yellow-ffe253 text-primary" : "bg-primary text-white"
        )}>
          {step > 1 ? <I.Check className="w-3 h-3" /> : "1"}
        </span>
        <div className="min-w-0">
          <div className="text-[13px] font-semibold leading-[1.2] truncate">Generate Draft</div>
          <div className="text-[11px] text-primary/60 leading-[1.2] mt-0.5 truncate">Strategy &amp; content</div>
        </div>
      </div>
      <div className="w-6 h-px bg-primary/[0.18]" />
      <div className="flex items-center gap-2.5 min-w-0">
        <span className={cn(
          "w-[22px] h-[22px] rounded-full text-[11px] font-bold inline-flex items-center justify-center shrink-0",
          step === 2 ? "bg-primary text-white" : "bg-white text-primary/60 border border-primary/[0.18]"
        )}>
          2
        </span>
        <div className="min-w-0">
          <div className={cn("text-[13px] font-semibold leading-[1.2] truncate", step === 2 ? "text-primary" : "text-primary/60")}>Post &amp; Track</div>
          <div className="text-[11px] text-primary/60 leading-[1.2] mt-0.5 truncate">Reply on X, paste link</div>
        </div>
      </div>
    </div>
  );
}

function StepHeader({ num, title, hint, complete, required, optional }) {
  return (
    <div className="flex items-center gap-2 w-full">
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
      {required && (
        <span className="text-[10px] font-semibold uppercase tracking-[0.06em] px-1.5 py-0.5 rounded-[4px] bg-primary text-yellow-ffe253 leading-none">
          Required
        </span>
      )}
      {optional && (
        <span className="text-[10px] font-medium uppercase tracking-[0.06em] px-1.5 py-0.5 rounded-[4px] bg-primary/[0.06] text-primary/60 leading-none border border-primary/[0.08]">
          Optional
        </span>
      )}
      {hint && <span className="text-[11px] text-primary/60 ml-auto truncate">{hint}</span>}
    </div>
  );
}

window.ReplyPanel = function ReplyPanel({ post, onClose }) {
  const D = window.EngageData;

  const [outerStep, setOuterStep] = useStateRP(1);
  const [strategy, setStrategy] = useStateRP("expert");
  const [length, setLength] = useStateRP("medium");
  const [mentionOpen, setMentionOpen] = useStateRP(false);
  const [mention, setMention] = useStateRP("aisee — AI visibility tracker");
  const [intensity, setIntensity] = useStateRP(2);
  const [draft, setDraft] = useStateRP("");
  const [generating, setGenerating] = useStateRP(false);

  // Step 2 state — manual-post & link-back flow
  const [copied, setCopied] = useStateRP(false);            // "Copy draft" feedback
  const [postedClicked, setPostedClicked] = useStateRP(false); // user clicked "I've posted my reply"
  const [replyUrl, setReplyUrl] = useStateRP("");
  const [tracking, setTracking] = useStateRP(false);           // final success state

  useEffectRP(() => {
    setOuterStep(1);
    setStrategy("expert");
    setLength("medium");
    setMentionOpen(false);
    setMention("aisee — AI visibility tracker");
    setIntensity(2);
    setDraft("");
    setGenerating(false);
    setCopied(false);
    setPostedClicked(false);
    setReplyUrl("");
    setTracking(false);
  }, [post?.id]);

  // Trim full draft to requested length by paragraph.
  const lengthFor = (full) => {
    const paras = full.split(/\n\n+/);
    if (length === "short")  return paras.slice(0, 1).join("\n\n");
    if (length === "medium") return paras.slice(0, 2).join("\n\n");
    return full; // long
  };

  const generate = () => {
    setGenerating(true);
    setDraft("");
    const target = lengthFor(D.draftsByStrategy[strategy]);
    let i = 0;
    const tick = () => {
      i += Math.max(3, Math.floor(target.length / 30));
      setDraft(target.slice(0, i));
      if (i < target.length) setTimeout(tick, 28);
      else setGenerating(false);
    };
    setTimeout(tick, 350);
  };

  const lengthOpts = [
    { id: "short",  label: "Short",  hint: "1 paragraph" },
    { id: "medium", label: "Medium", hint: "2 paragraphs" },
    { id: "long",   label: "Long",   hint: "Full reply" },
  ];

  const handleCopyDraft = () => {
    try { navigator.clipboard && navigator.clipboard.writeText(draft); } catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handlePasteUrl = async () => {
    try {
      const txt = await navigator.clipboard.readText();
      if (txt) setReplyUrl(txt.trim());
    } catch (e) {}
  };

  const confirmUrl = () => {
    setTracking(true);
    setTimeout(() => { onClose(); }, 1400);
  };

  const validUrl = /^https?:\/\/(x|twitter)\.com\//i.test(replyUrl.trim());

  const intensityLabels = ["Don't mention", "Subtle", "Natural", "Direct"];

  if (!post) return null;
  const hasDraft = draft.length > 0;

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

      <OuterSteps step={outerStep} />

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
      </div>

      {outerStep === 1 && (
        <>
          {/* Step 1 — Strategy (Required) */}
          <div className="flex flex-col gap-2">
            <StepHeader num="1" title="Reply Strategy" hint="How the reply is structured" required />
            <div className="grid grid-cols-3 gap-2">
              {D.strategies.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStrategy(s.id)}
                  className={cn(
                    "p-2.5 rounded-[10px] border text-left cursor-pointer transition-colors",
                    strategy === s.id
                      ? "bg-yellow-ffe253 border-primary"
                      : "bg-white border-primary/[0.05] hover:border-primary/[0.18]"
                  )}
                >
                  <div className="text-[13px] font-semibold mb-0.5">{s.ttl}</div>
                  <div className={cn("text-[11px]", strategy === s.id ? "text-primary/70" : "text-primary/60")}>{s.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2 — Draft Length (Required) */}
          <div className="flex flex-col gap-2">
            <StepHeader num="2" title="Draft Length" hint="How long the reply should be" required />
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
                    <span className="flex items-end gap-[2px] h-3">
                      <span className={cn("w-[3px] rounded-sm h-[5px]", length === opt.id ? "bg-primary" : "bg-primary/30")} />
                      <span className={cn("w-[3px] rounded-sm h-[8px]",  (opt.id === "medium" || opt.id === "long") ? (length === opt.id ? "bg-primary" : "bg-primary/30") : (length === opt.id ? "bg-primary/30" : "bg-primary/15"))} />
                      <span className={cn("w-[3px] rounded-sm h-[11px]", opt.id === "long" ? (length === opt.id ? "bg-primary" : "bg-primary/30") : (length === opt.id ? "bg-primary/30" : "bg-primary/15"))} />
                    </span>
                    <div className="text-[13px] font-semibold">{opt.label}</div>
                  </div>
                  <div className={cn("text-[11px]", length === opt.id ? "text-primary/70" : "text-primary/60")}>{opt.hint}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Optional — Mention */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setMentionOpen((v) => !v)}
              className="flex items-center gap-2 w-full text-left cursor-pointer"
            >
              <StepHeader num="+" title="Mention Intensity" hint={mentionOpen ? "Hide" : "Add a mention"} optional />
              <I.ChevronDown className={cn("w-3 h-3 text-primary/50 shrink-0 transition-transform", mentionOpen && "rotate-180")} />
            </button>

            {mentionOpen && (
            <div className="bg-gray-fafafa border border-dashed border-primary/[0.18] rounded-[10px] p-3.5 flex flex-col gap-2.5">
              <label className="text-[12px] font-medium text-primary">What to mention</label>
              <input
                value={mention}
                onChange={(e) => setMention(e.target.value)}
                placeholder="Your product, brand, or angle"
                className="w-full h-9 px-3 rounded-lg border border-primary/[0.05] bg-white text-[13px] outline-none focus:border-primary placeholder:text-primary/40"
              />

              <div className="flex items-baseline justify-between mt-1">
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

              <div className="grid grid-cols-4 text-[11px] text-primary/60">
                {intensityLabels.map((l, i) => (
                  <span
                    key={i}
                    className={cn(
                      i === 0 ? "text-left" : i === 3 ? "text-right" : "text-center",
                      i === intensity && "text-primary font-semibold"
                    )}
                  >{l}</span>
                ))}
              </div>

              <div className="text-[11px] text-primary/60 inline-flex items-center gap-1.5 mt-0.5">
                <I.Info className="w-3 h-3 text-primary/40 shrink-0" />
                Woven into the reply where it genuinely fits the answer.
              </div>
            </div>
            )}
          </div>

          {/* Draft / placeholder */}
          {hasDraft ? (
            <div className="flex flex-col gap-2">
              <StepHeader num="✓" title="AI Draft" hint={`${draft.length} chars`} complete />
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-full min-h-[168px] resize-y rounded-[10px] border border-primary/[0.05] bg-yellow-f7f6e9 px-3.5 py-3 pb-7 text-[14px] leading-[1.55] outline-none font-karla focus:border-primary"
              />
              <button
                onClick={generate}
                className="inline-flex items-center justify-center gap-1.5 h-9 rounded-lg bg-white border border-primary/[0.05] text-[13px] font-semibold hover:bg-primary/[0.03] hover:border-primary/[0.18] cursor-pointer transition-colors"
              >
                <I.RefreshCw className="w-3 h-3" /> Regenerate with current settings
              </button>
            </div>
          ) : generating ? (
            <div className="bg-yellow-fbfbf3 border border-dashed border-primary/[0.12] rounded-[10px] px-4 py-5 flex items-center justify-center gap-1 text-primary/60 text-[13px]">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0s" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.15s" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.3s" }} />
              <span className="ml-1.5">Generating draft…</span>
            </div>
          ) : (
            <div className="bg-yellow-fbfbf3 border border-dashed border-primary/[0.12] rounded-[10px] px-4 py-5 text-center text-[13px] text-primary/60 leading-[1.5]">
              <div className="inline-flex w-9 h-9 rounded-full bg-white border border-primary/[0.05] items-center justify-center text-primary mb-2">
                <I.Pencil className="w-4 h-4" />
              </div>
              <div>Pick a strategy, optionally guide the angle, set intensity — then generate.</div>
            </div>
          )}
        </>
      )}

      {outerStep === 2 && !tracking && (
        <>
          {/* Final draft card with Copy + Open thread */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-semibold text-primary/60 uppercase tracking-[0.06em]">Your draft</div>
              <div className="text-[11px] text-primary/50">{draft.length} chars</div>
            </div>
            <div className="relative bg-yellow-fbfbf3 border border-primary/[0.05] rounded-[10px] p-3.5">
              <div className="text-[13px] text-primary leading-[1.55] whitespace-pre-wrap pr-1">{draft}</div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-primary/[0.06]">
                <button
                  onClick={handleCopyDraft}
                  className={cn(
                    "inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12.5px] font-semibold cursor-pointer transition-all",
                    copied
                      ? "bg-primary text-yellow-ffe253"
                      : "bg-primary text-white hover:bg-primary/90"
                  )}
                >
                  {copied ? (
                    <><I.Check className="w-3 h-3" /> Copied</>
                  ) : (
                    <><I.Copy className="w-3 h-3" /> Copy draft</>
                  )}
                </button>
                <a
                  href={post.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white border border-primary/[0.10] text-[12.5px] font-semibold text-primary hover:bg-primary/[0.03] hover:border-primary/[0.25] cursor-pointer transition-colors"
                >
                  <I.ExternalLink className="w-3 h-3" /> Open original post
                </a>
              </div>
            </div>
          </div>

          {/* Tutorial animation — only before user has clicked "posted" */}
          {!postedClicked && (
            <window.CopyLinkTutorial snippet={draft} handle="@yinye" />
          )}

          {/* CTA: I've posted → reveals URL input */}
          {!postedClicked ? (
            <button
              onClick={() => setPostedClicked(true)}
              className="inline-flex items-center justify-center gap-2 h-11 rounded-[10px] bg-yellow-ffe253 border border-primary text-primary text-[14px] font-semibold hover:bg-yellow-fceb63 cursor-pointer transition-colors"
            >
              <I.Check className="w-3.5 h-3.5" />
              I’ve posted my reply
            </button>
          ) : (
            <div className="flex flex-col gap-2.5 bg-white border-2 border-primary rounded-[10px] p-3.5 animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-yellow-ffe253 text-[10px] font-bold inline-flex items-center justify-center">✓</span>
                <div className="text-[12px] font-semibold uppercase tracking-[0.04em] text-primary">Paste your reply link</div>
              </div>
              <div className="text-[12px] text-primary/65 leading-[1.45]">
                Paste the comment URL you copied from X. aisee will track likes &amp; replies on it automatically.
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40">
                    <I.Link2 className="w-3.5 h-3.5" />
                  </span>
                  <input
                    autoFocus
                    value={replyUrl}
                    onChange={(e) => setReplyUrl(e.target.value)}
                    placeholder="https://x.com/yinye/status/…"
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-primary/[0.12] bg-white text-[13px] outline-none focus:border-primary placeholder:text-primary/35 font-mono"
                  />
                </div>
                <button
                  onClick={handlePasteUrl}
                  className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg bg-white border border-primary/[0.12] text-[12.5px] font-semibold text-primary hover:bg-primary/[0.03] hover:border-primary/[0.25] cursor-pointer transition-colors"
                >
                  <I.Copy className="w-3 h-3" /> Paste
                </button>
              </div>
              <button
                type="button"
                onClick={() => setPostedClicked(false)}
                className="text-[11.5px] text-primary/55 hover:text-primary self-start cursor-pointer underline decoration-dotted underline-offset-2"
              >
                Show me again how to copy the link
              </button>
            </div>
          )}
        </>
      )}

      {/* Success state */}
      {tracking && (
        <div className="flex flex-col items-center justify-center text-center gap-3 py-8 px-4 bg-yellow-fbfbf3 border border-primary/[0.05] rounded-[12px] animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-primary text-yellow-ffe253 inline-flex items-center justify-center">
            <I.Check className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[15px] font-semibold text-primary">Reply linked — tracking started</div>
            <div className="text-[12px] text-primary/60 mt-1">We’ll watch likes &amp; replies and add it to your Sent tab.</div>
          </div>
        </div>
      )}

      {/* Actions */}
      {!tracking && (
      <div className="flex items-center gap-2 pt-3.5 border-t border-primary/[0.05]">
        {outerStep === 1 ? (
          <>
            <Button variant="tertiary" onClick={onClose} className="h-9 px-3.5 text-[13px]">Skip</Button>
            <div className="flex-1" />
            {!hasDraft ? (
              <Button variant="primary" onClick={generate} disabled={generating} className="h-9 px-4 text-[13px]">
                {generating ? "Generating…" : (<><I.Zap className="w-3 h-3" /> Generate Draft</>)}
              </Button>
            ) : (
              <Button variant="primary" onClick={() => setOuterStep(2)} className="h-9 px-4 text-[13px]">
                Continue <I.ArrowRight className="w-3 h-3" />
              </Button>
            )}
          </>
        ) : (
          <>
            <Button variant="tertiary" onClick={() => setOuterStep(1)} className="h-9 px-3.5 text-[13px]">← Back</Button>
            <div className="flex-1" />
            {postedClicked ? (
              <Button
                variant="primary"
                onClick={confirmUrl}
                disabled={!validUrl}
                className="h-9 px-4 text-[13px]"
              >
                Done <I.Check className="w-3 h-3" />
              </Button>
            ) : (
              <span className="text-[11.5px] text-primary/55 italic">Copy the draft, reply on X, then come back</span>
            )}
          </>
        )}
      </div>
      )}

      {/* (schedule overlay removed — manual-post flow doesn't schedule) */}
    </div>
  );
};
