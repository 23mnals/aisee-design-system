"use client";
// ─────────────────────────────────────────────────────────────
// Keywords & Accounts page — the configuration tab of Engage.
// Mirrors the Signal Feed flow but for managing the inputs to
// that feed. Contains:
//   • Top-level X Auto-reply toggle
//   • Workflow stepper hint
//   • 1 Keywords  /  2 Priority X accounts  /  3 Subreddits
// ─────────────────────────────────────────────────────────────
import * as React from "react";
import { ChevronDown, Plus, X } from "./local-stubs";

import { cn } from "./local-stubs";

import { PlatformR, PlatformX } from "./platform-icons";
import { AddAccountModal } from "./add-account-modal";
import { AddSubredditModal } from "./add-subreddit-modal";
import {
    MAX_WEEK,
    SEED_KEYWORDS,
    SEED_SUBREDDITS,
    SEED_X_ACCOUNTS,
} from "../_lib/mock-data";
import type { Keyword, KeywordType, PriorityAccount, Subreddit } from "../_lib/types";

const TYPE_LABEL: Record<KeywordType, string> = {
    core: "Core",
    brand: "Brand",
    competitor: "Competitor",
};
function progressClass(t: KeywordType) {
    if (t === "brand") return "brand";
    if (t === "competitor") return "competitor";
    return "";
}

// ── Workflow stepper ─────────────────────────────────────────
function Stepper({ active }: { active: 1 | 2 | 3 }) {
    const steps = [
        { n: 1, label: "Keywords" },
        { n: 2, label: "X accounts" },
        { n: 3, label: "Reddit subs" },
    ] as const;
    return (
        <div className="kwa-flow">
            {steps.map((s, i) => (
                <React.Fragment key={s.n}>
                    <span className={cn("step", active !== s.n && "muted")}>
                        <span className="n">{s.n}</span>
                        {s.label}
                    </span>
                    {i < steps.length - 1 && <span className="arrow">→</span>}
                </React.Fragment>
            ))}
        </div>
    );
}

// ── Keyword Row ──────────────────────────────────────────────
function KeywordRow({
    kw,
    onToggle,
    onView,
}: {
    kw: Keyword;
    onToggle: (id: string) => void;
    onView: () => void;
}) {
    const pct = Math.min(100, Math.round((kw.weekN / MAX_WEEK) * 100));
    return (
        <div className="kw-row-2">
            <div className="kw-info">
                <div className="kw-title-row">
                    <span className="kw-name">{kw.text}</span>
                    <span className={cn("tag", `type-${kw.type}`)}>{TYPE_LABEL[kw.type]}</span>
                </div>
                <div className="kw-meta-row">
                    <div className={cn("kw-progress-2", progressClass(kw.type))}>
                        <span style={{ width: `${pct}%` }} />
                    </div>
                    <span className="kw-count-2">
                        <b>{kw.weekN}</b> this week
                    </span>
                    {kw.posts > 0 && (
                        <button type="button" className="kw-posts-link" onClick={onView}>
                            {kw.posts} {kw.posts === 1 ? "post" : "posts"} <ChevronDown size={10} />
                        </button>
                    )}
                </div>
            </div>
            <div />
            <span
                className={cn("switch-lg", kw.on && "on")}
                onClick={() => onToggle(kw.id)}
                role="switch"
                aria-checked={kw.on}
            />
        </div>
    );
}

// ── Page ─────────────────────────────────────────────────────
export function KeywordsAccounts() {
    const [keywords, setKeywords] = React.useState<Keyword[]>(SEED_KEYWORDS);
    const [accounts, setAccounts] = React.useState<PriorityAccount[]>(SEED_X_ACCOUNTS);
    const [subs, setSubs] = React.useState<Subreddit[]>(SEED_SUBREDDITS);
    const [newKw, setNewKw] = React.useState("");
    const [autoReply, setAutoReply] = React.useState(false);
    const [addAccountOpen, setAddAccountOpen] = React.useState(false);
    const [addSubOpen, setAddSubOpen] = React.useState(false);
    const [freshId, setFreshId] = React.useState<string | null>(null);

    const kwActive = keywords.filter((k) => k.on).length;
    const accActive = accounts.filter((a) => a.on).length;
    const subActive = subs.filter((s) => s.on).length;

    const toggleKw = (id: string) =>
        setKeywords((arr) => arr.map((k) => (k.id === id ? { ...k, on: !k.on } : k)));
    const toggleAcc = (id: string) =>
        setAccounts((arr) => arr.map((a) => (a.id === id ? { ...a, on: !a.on } : a)));
    const toggleSub = (id: string) =>
        setSubs((arr) => arr.map((s) => (s.id === id ? { ...s, on: !s.on } : s)));
    const removeAcc = (id: string) =>
        setAccounts((arr) => arr.filter((a) => a.id !== id));

    const addKw = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && newKw.trim()) {
            setKeywords([
                ...keywords,
                {
                    id: "k" + Date.now(),
                    text: newKw.trim(),
                    type: "core",
                    on: true,
                    weekN: 0,
                    posts: 0,
                },
            ]);
            setNewKw("");
        }
    };

    return (
        <div className="kwa-wrap fade-in">
            {/* Top-level: X Auto-reply ───────────────────────────── */}
            <div className="kwa-toplevel">
                <div className="body">
                    <div className="ttl">
                        <span style={{ display: "inline-flex" }}>
                            <PlatformX size={13} />
                        </span>
                        X Auto-reply
                        <span className={cn("status-pill", autoReply && "on")}>
                            {autoReply ? "On" : "Off"}
                        </span>
                    </div>
                    <div className="desc">
                        {autoReply
                            ? "Auto-reply is active. Configure accounts and quiet hours below."
                            : "Turn on to let Engage reply automatically using your selected accounts."}
                    </div>
                </div>
                <span
                    className={cn("switch-lg", autoReply && "on")}
                    onClick={() => setAutoReply(!autoReply)}
                    role="switch"
                    aria-checked={autoReply}
                />
            </div>

            <Stepper active={1} />

            {/* 1. Keywords ───────────────────────────────────────── */}
            <div className="kwa-card">
                <div className="kwa-head">
                    <div className="ttl-block">
                        <h3>
                            <span className="kwa-step-pill">
                                <span className="num">1</span>Pick first
                            </span>
                            Keywords
                        </h3>
                        <div className="sub">
                            Scans <b>X</b> + <b>Reddit</b> every 24 hours · <b>{kwActive}</b> active · matches feed into Signal Feed
                        </div>
                    </div>
                    <button type="button" className="kwa-add-btn">
                        <Plus size={13} /> Add
                    </button>
                </div>

                <div className="kw-list-2">
                    {keywords.map((kw) => (
                        <KeywordRow key={kw.id} kw={kw} onToggle={toggleKw} onView={() => undefined} />
                    ))}
                </div>

                <div className="kw-add-row">
                    <span className="ico">
                        <Plus size={14} />
                    </span>
                    <input
                        placeholder="Add a keyword, press Enter to confirm"
                        value={newKw}
                        onChange={(e) => setNewKw(e.target.value)}
                        onKeyDown={addKw}
                    />
                    <span className="hint">Enter ⏎</span>
                </div>
            </div>

            {/* 2. X Priority Accounts ───────────────────────────── */}
            <div className="kwa-card">
                <div className="kwa-head">
                    <div className="ttl-block">
                        <h3>
                            <span className="kwa-step-pill">
                                <span className="num">2</span>X config
                            </span>
                            Priority Accounts
                        </h3>
                        <div className="sub">
                            When these accounts post, push to Signal Feed regardless of keyword match · <b>{accActive}</b> tracked
                        </div>
                    </div>
                    <button
                        type="button"
                        className="kwa-add-btn"
                        onClick={() => setAddAccountOpen(true)}
                    >
                        <Plus size={13} /> Add account
                    </button>
                </div>

                <div className="acc-list-2">
                    {accounts.map((a) => (
                        <div
                            key={a.id}
                            className={cn("acc-row-2", freshId === a.id && "fresh-flash")}
                        >
                            <div className="av-2">{a.initial}</div>
                            <div className="body">
                                <div className="who">
                                    {a.handle}
                                    <span className="platform-chip">
                                        <PlatformX size={9} />
                                    </span>
                                </div>
                                <div className="role">{a.role}</div>
                            </div>
                            <div className="controls">
                                <span
                                    className={cn("switch-lg", a.on && "on")}
                                    onClick={() => toggleAcc(a.id)}
                                    role="switch"
                                    aria-checked={a.on}
                                />
                                <button
                                    type="button"
                                    className="x-remove"
                                    onClick={() => removeAcc(a.id)}
                                    aria-label="Remove"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Reddit Subreddits ─────────────────────────────── */}
            <div className="kwa-card">
                <div className="kwa-head">
                    <div className="ttl-block">
                        <h3>
                            <span className="kwa-step-pill">
                                <span className="num">3</span>Reddit config
                            </span>
                            Subreddits
                        </h3>
                        <div className="sub">
                            Monitor keyword-matching posts in these communities · <b>{subActive}</b> active
                        </div>
                    </div>
                    <button
                        type="button"
                        className="kwa-add-btn ghost"
                        onClick={() => setAddSubOpen(true)}
                    >
                        <Plus size={13} /> Add subreddit
                    </button>
                </div>

                <div className="sub-grid-2">
                    {subs.map((s) => (
                        <div
                            key={s.id}
                            className={cn(
                                "sub-card-2",
                                s.on && "on",
                                freshId === s.id && "fresh-flash",
                            )}
                            onClick={() => toggleSub(s.id)}
                        >
                            <span className="r-ico-2">
                                <PlatformR />
                            </span>
                            <div className="info-2">
                                <div className="nm-2">{s.name}</div>
                                <div className="mem-2">{s.members} members</div>
                            </div>
                            <span
                                className={cn("switch-lg", s.on && "on")}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSub(s.id);
                                }}
                                role="switch"
                                aria-checked={s.on}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <AddAccountModal
                open={addAccountOpen}
                onClose={() => setAddAccountOpen(false)}
                onAdd={(acc) => {
                    setAccounts([acc, ...accounts]);
                    setFreshId(acc.id);
                    window.setTimeout(() => setFreshId(null), 2000);
                }}
            />
            <AddSubredditModal
                open={addSubOpen}
                onClose={() => setAddSubOpen(false)}
                onAdd={(sub) => {
                    setSubs([sub, ...subs]);
                    setFreshId(sub.id);
                    window.setTimeout(() => setFreshId(null), 2000);
                }}
            />
        </div>
    );
}
