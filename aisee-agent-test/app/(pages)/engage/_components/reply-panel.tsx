"use client";
// ─────────────────────────────────────────────────────────────
// Reply Panel — the sticky right column that opens when a feed
// card is selected. Two macro steps:
//   1. Generate Draft — pick strategy + mention angle + intensity
//   2. Select account — pick which account replies
// ─────────────────────────────────────────────────────────────
import * as React from "react";
import {
    ArrowRight,
    Calendar,
    Check,
    Edit3,
    Info,
    RefreshCw,
    Send,
    X,
    Zap,
} from "./local-stubs";

import { cn } from "./local-stubs";

import { PlatformR, PlatformX } from "./platform-icons";
import type { FeedPost, ReplyAccount, ReplyStrategy } from "../_lib/types";

const STRATEGIES: { id: ReplyStrategy; ttl: string; sub: string }[] = [
    { id: "expert", ttl: "Expert answer", sub: "Structured steps" },
    { id: "data", ttl: "Data-backed", sub: "Cite numbers" },
    { id: "empathy", ttl: "Empathetic", sub: "Acknowledge pain first" },
];

const DRAFTS_BY_STRATEGY: Record<ReplyStrategy, string> = {
    expert: `This is one of the most common gaps we see — most brands score under 30 on AI Presence even with solid content.

Three things that consistently move the needle:
① FAQ schema — Q&A format that AI loves to cite directly
② Topical depth — clusters of 5+ pages on one narrow concept
③ External validation — getting cited on high-authority sources AI actually reads (not just Google's top results)

Happy to share the audit framework we use — it's surfaced these patterns across 500+ B2B brands.`,
    data: `We analyzed 500+ B2B brands across ChatGPT, Perplexity and Claude — only 18% had consistent mentions across all three.

The single biggest predictor of AI visibility (r=0.71): structured FAQ markup. Brands with 20+ FAQ entries showed a 3.2× higher citation rate vs. those relying on traditional SEO content alone.

Schema alone won't fix invisibility, but it's the cheapest lever we've measured.`,
    empathy: `Totally feel this — we hear it from almost every brand we onboard. Months of content, zero AI surface area, and no clear feedback loop on what's actually wrong.

The honest answer: AI engines read your content very differently from Google. Most "SEO-optimized" pages are still invisible to them because the structure doesn't match how LLMs retrieve facts.

If it helps, we put together a short diagnostic — happy to share what we usually look at first.`,
};

const ACCOUNTS: ReplyAccount[] = [
    { id: "a1", handle: "@aisee_official", role: "Brand account", followers: "8.2K" },
    { id: "a2", handle: "@geo_insights", role: "Content account", followers: "3.1K" },
];

const INTENSITY_LABELS = ["Don't mention", "Subtle", "Natural", "Direct"];

interface ReplyPanelProps {
    post: FeedPost;
    onClose: () => void;
}

export function ReplyPanel({ post, onClose }: ReplyPanelProps) {
    const [outerStep, setOuterStep] = React.useState<1 | 2>(1);
    const [strategy, setStrategy] = React.useState<ReplyStrategy>("expert");
    const [mention, setMention] = React.useState("aisee — AI visibility tracker");
    const [intensity, setIntensity] = React.useState(2);
    const [draft, setDraft] = React.useState("");
    const [generating, setGenerating] = React.useState(false);
    const [selectedAccount, setSelectedAccount] = React.useState("a1");
    const [scheduling, setScheduling] = React.useState(false);
    const [sent, setSent] = React.useState(false);

    // Reset all state when switching to a new post.
    React.useEffect(() => {
        setOuterStep(1);
        setStrategy("expert");
        setMention("aisee — AI visibility tracker");
        setIntensity(2);
        setDraft("");
        setGenerating(false);
        setSent(false);
    }, [post.id]);

    const generate = () => {
        setGenerating(true);
        setDraft("");
        const target = DRAFTS_BY_STRATEGY[strategy];
        let i = 0;
        const tick = () => {
            i += Math.max(3, Math.floor(target.length / 30));
            setDraft(target.slice(0, i));
            if (i < target.length) {
                window.setTimeout(tick, 28);
            } else {
                setGenerating(false);
            }
        };
        window.setTimeout(tick, 350);
    };

    const send = () => {
        setSent(true);
        window.setTimeout(() => {
            onClose();
            setSent(false);
        }, 1100);
    };

    const intensityLabel = INTENSITY_LABELS[intensity];
    const hasDraft = draft.length > 0;

    return (
        <div className="reply-panel slide-in" key={post.id}>
            {/* Head ─────────────────────────────────────────────── */}
            <div className="rp-head">
                <div className="ttl">Generate reply</div>
                <div className="rp-post-meta">
                    <span style={{ display: "inline-flex" }}>
                        {post.platform === "x" ? (
                            <span className="platform-pill" style={{ width: 18, height: 18 }}>
                                <PlatformX size={9} />
                            </span>
                        ) : (
                            <span className="platform-pill r" style={{ width: 18, height: 18 }}>
                                <PlatformR />
                            </span>
                        )}
                    </span>
                    <span>{post.user.handle}</span>
                    <span className="dot">·</span>
                    <span>{post.time} ago</span>
                </div>
                <button type="button" className="rp-close" onClick={onClose} aria-label="Close">
                    <X size={16} />
                </button>
            </div>

            {/* Outer 2-step indicator ───────────────────────────── */}
            <div className="rp-outer-steps">
                <div
                    className={cn(
                        "rp-outer-step",
                        outerStep === 1 ? "current" : outerStep > 1 ? "done" : "",
                    )}
                >
                    <span className="rp-outer-num">{outerStep > 1 ? <Check size={11} /> : "1"}</span>
                    <div className="rp-outer-text">
                        <div className="rp-outer-ttl">Generate Draft</div>
                        <div className="rp-outer-sub">Strategy &amp; content</div>
                    </div>
                </div>
                <div className="rp-outer-connector" />
                <div className={cn("rp-outer-step", outerStep === 2 ? "current" : "pending")}>
                    <span className="rp-outer-num">2</span>
                    <div className="rp-outer-text">
                        <div className="rp-outer-ttl">Select account</div>
                        <div className="rp-outer-sub">Select where to publish</div>
                    </div>
                </div>
            </div>

            {/* Post preview ─────────────────────────────────────── */}
            <div className="rp-preview">
                <div className="who">
                    <span className="av">{post.user.avatar}</span>
                    <b>{post.user.handle}</b>
                    {post.user.followers && <span className="meta">{post.user.followers}</span>}
                </div>
                <div className="body">{post.body}</div>
            </div>

            {outerStep === 1 && (
                <>
                    {/* Step 1 — Reply Strategy */}
                    <div className="rp-step">
                        <div className="rp-step-header">
                            <span className="rp-step-num">1</span>
                            <span className="rp-step-title">Reply Strategy</span>
                            <span className="rp-step-hint">How the reply is structured</span>
                        </div>
                        <div className="strategy-grid">
                            {STRATEGIES.map((s) => (
                                <button
                                    type="button"
                                    key={s.id}
                                    className={cn("strategy-card", strategy === s.id && "on")}
                                    onClick={() => setStrategy(s.id)}
                                >
                                    <div className="ttl">{s.ttl}</div>
                                    <div className="sub">{s.sub}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step 2 — Mention Intensity */}
                    <div className="rp-step">
                        <div className="rp-step-header">
                            <span className="rp-step-num">2</span>
                            <span className="rp-step-title">Mention Intensity</span>
                            <span className="rp-step-hint">What to bring up &amp; how hard</span>
                        </div>

                        <div className="rp-field-card">
                            <label className="rp-field-label">What to mention</label>
                            <div className="rp-text-input">
                                <input
                                    placeholder="Your product, brand, or angle"
                                    value={mention}
                                    onChange={(e) => setMention(e.target.value)}
                                />
                            </div>

                            <div className="rp-slider-row">
                                <span className="rp-slider-lbl">How Strongly</span>
                                <span className="rp-slider-val">{intensityLabel}</span>
                            </div>
                            <div
                                className="intensity-track"
                                onClick={(e) => {
                                    const r = e.currentTarget.getBoundingClientRect();
                                    const pct = (e.clientX - r.left) / r.width;
                                    setIntensity(Math.max(0, Math.min(3, Math.round(pct * 3))));
                                }}
                            >
                                <div className="bar" />
                                <div className="fill" style={{ width: `${(intensity / 3) * 100}%` }} />
                                <div className="knob" style={{ left: `${(intensity / 3) * 100}%` }} />
                            </div>
                            <div className="intensity-ticks">
                                {INTENSITY_LABELS.map((l, i) => (
                                    <span key={l} className={i === intensity ? "active" : ""}>
                                        {l}
                                    </span>
                                ))}
                            </div>
                            <div className="rp-field-hint">
                                <Info size={11} /> Woven into the reply where it genuinely fits the answer.
                            </div>
                        </div>
                    </div>

                    {/* Draft / placeholder */}
                    {hasDraft ? (
                        <div className="rp-step">
                            <div className="rp-step-header">
                                <span
                                    className="rp-step-num"
                                    style={{ background: "var(--primary)", color: "var(--black)" }}
                                >
                                    <Check size={11} />
                                </span>
                                <span className="rp-step-title">AI Draft</span>
                                <span className="rp-step-hint">{draft.length} chars</span>
                            </div>
                            <div className="rp-draft">
                                <textarea
                                    value={draft}
                                    onChange={(e) => setDraft(e.target.value)}
                                />
                            </div>
                            <button type="button" className="gen-cta regen" onClick={generate}>
                                <RefreshCw size={12} /> Regenerate with current settings
                            </button>
                        </div>
                    ) : generating ? (
                        <div className="draft-placeholder generating">
                            <span className="gen-dot" />
                            <span className="gen-dot" />
                            <span className="gen-dot" />
                            <span style={{ marginLeft: 6 }}>Generating draft…</span>
                        </div>
                    ) : (
                        <div className="draft-placeholder">
                            <div className="ico">
                                <Edit3 size={16} />
                            </div>
                            <div>Pick a strategy, optionally guide the angle, set intensity — then generate.</div>
                        </div>
                    )}
                </>
            )}

            {outerStep === 2 && (
                <>
                    <div className="rp-step">
                        <div className="rp-step-header">
                            <span className="rp-step-num">·</span>
                            <span className="rp-step-title">Choose account</span>
                            <span className="rp-step-hint">Where to publish this reply</span>
                        </div>
                        <div className="rp-account-list">
                            {ACCOUNTS.map((a) => (
                                <button
                                    type="button"
                                    key={a.id}
                                    className={cn("rp-account-row", selectedAccount === a.id && "on")}
                                    onClick={() => setSelectedAccount(a.id)}
                                >
                                    <span
                                        className={cn("rp-radio", selectedAccount === a.id && "on")}
                                    >
                                        {selectedAccount === a.id && <span className="dot" />}
                                    </span>
                                    <span className="av">{a.handle[1].toUpperCase()}</span>
                                    <div className="info">
                                        <div className="handle">{a.handle}</div>
                                        <div className="role">
                                            {a.role} · {a.followers} followers
                                        </div>
                                    </div>
                                    <span className="plat">
                                        {post.platform === "x" ? <PlatformX size={11} /> : <PlatformR />}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rp-final-preview">
                        <div className="rp-final-label">Final reply</div>
                        <div className="rp-final-body">{draft}</div>
                    </div>
                </>
            )}

            {/* Bottom actions ───────────────────────────────────── */}
            <div className="rp-actions">
                {outerStep === 1 ? (
                    <>
                        <button type="button" className="btn-ghost" onClick={onClose}>
                            Skip
                        </button>
                        <div style={{ flex: 1 }} />
                        {!hasDraft ? (
                            <button
                                type="button"
                                className="btn-primary"
                                onClick={generate}
                                disabled={generating}
                            >
                                {generating ? (
                                    "Generating…"
                                ) : (
                                    <>
                                        <Zap size={13} /> Generate Draft
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="btn-primary"
                                onClick={() => setOuterStep(2)}
                            >
                                Continue <ArrowRight size={13} />
                            </button>
                        )}
                    </>
                ) : (
                    <>
                        <button type="button" className="btn-ghost" onClick={() => setOuterStep(1)}>
                            ← Back
                        </button>
                        <div style={{ flex: 1 }} />
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => setScheduling(true)}
                        >
                            <Calendar size={13} /> Schedule
                        </button>
                        <button type="button" className="btn-primary" onClick={send}>
                            {sent ? (
                                "Sent ✓"
                            ) : (
                                <>
                                    Send reply <Send size={13} />
                                </>
                            )}
                        </button>
                    </>
                )}
            </div>

            {scheduling && (
                <div
                    onClick={() => setScheduling(false)}
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(17,17,17,0.4)",
                        backdropFilter: "blur(2px)",
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        padding: 16,
                        zIndex: 10,
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: "100%",
                            background: "var(--white)",
                            border: "1px solid var(--border-modal)",
                            borderRadius: 12,
                            padding: 16,
                            boxShadow: "var(--shadow-modal)",
                        }}
                    >
                        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>
                            Schedule reply
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            {["In 30 min", "In 2 hours", "Tomorrow 9am", "Custom…"].map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    className="btn-secondary"
                                    style={{ justifyContent: "center" }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
