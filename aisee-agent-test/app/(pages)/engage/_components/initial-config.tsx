"use client";
// ─────────────────────────────────────────────────────────────
// Engage — Initial Configuration (first-run setup screen)
// Shown only when localStorage.engage:configured is not set.
// ─────────────────────────────────────────────────────────────
import * as React from "react";
import { Image } from "./local-stubs";
import { Check, Plus, Rocket } from "./local-stubs";

import { cn } from "./local-stubs";
import {
    INITIAL_ACCOUNTS,
    INITIAL_KEYWORDS,
    INITIAL_SUBREDDITS,
} from "../_lib/mock-data";
import type {
    InitialAccount,
    InitialKeyword,
    InitialSubreddit,
} from "../_lib/types";

interface InitialConfigProps {
    onStart: () => void;
}

export function InitialConfig({ onStart }: InitialConfigProps) {
    const [keywords, setKeywords] = React.useState<InitialKeyword[]>(INITIAL_KEYWORDS);
    const [newKw, setNewKw] = React.useState("");
    const [accounts, setAccounts] = React.useState<InitialAccount[]>(INITIAL_ACCOUNTS);
    const [subs, setSubs] = React.useState<InitialSubreddit[]>(INITIAL_SUBREDDITS);

    const kwActive = keywords.filter((k) => k.checked).length;
    const subActive = subs.filter((s) => s.on).length;
    const accActive = accounts.filter((a) => a.on).length;

    const toggleKw = (id: string) =>
        setKeywords((arr) => arr.map((k) => (k.id === id ? { ...k, checked: !k.checked } : k)));
    const toggleSub = (id: string) =>
        setSubs((arr) => arr.map((s) => (s.id === id ? { ...s, on: !s.on } : s)));
    const toggleAcc = (id: string) =>
        setAccounts((arr) => arr.map((a) => (a.id === id ? { ...a, on: !a.on } : a)));
    const removeAcc = (id: string) =>
        setAccounts((arr) => arr.filter((a) => a.id !== id));

    const addKw = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && newKw.trim()) {
            setKeywords([
                ...keywords,
                { id: "k" + Date.now(), text: newKw.trim(), checked: true, tag: null },
            ]);
            setNewKw("");
        }
    };

    return (
        <div className="fade-in">
            {/* Lime banner ─────────────────────────────────────────────── */}
            <div
                className="engage-banner config-banner"
                style={{
                    backgroundColor: "rgb(243, 231, 244)",
                    borderWidth: 4,
                    borderStyle: "solid",
                    color: "rgb(255,255,255)",
                    borderRadius: 16,
                }}
            >
                <div className="engage-banner-top">
                    <div className="icon-bubble">
                        <Image
                            src="/images/engage/engage-icon.svg"
                            alt=""
                            width={46}
                            height={46}
                            unoptimized
                        />
                    </div>
                    <div className="titles">
                        <h1>Engage — Initial Setup</h1>
                        <div className="sub">
                            Configure keywords and accounts. We&apos;ll scan X &amp; Reddit every 24 hours for relevant conversations.
                        </div>
                    </div>
                    <div className="banner-stats">
                        <div className="banner-stat">
                            <span className="lbl">Keywords</span>
                            <span className="num">{kwActive}</span>
                        </div>
                        <div className="banner-stat">
                            <span className="lbl">Subreddits</span>
                            <span className="num">{subActive}</span>
                        </div>
                        <div className="banner-stat">
                            <span className="lbl">Accounts</span>
                            <span className="num">{accActive}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="config-wrap" style={{ padding: "16px 24px 32px" }}>
                {/* Keywords ────────────────────────────────────────────── */}
                <div className="cfg-card" style={{ padding: 16 }}>
                    <div className="cfg-head">
                        <div className="ttl-block">
                            <h3>Keywords</h3>
                            <div className="sub">We&apos;ll continuously track these terms on X and Reddit.</div>
                        </div>
                        <span
                            className="count-pill"
                            style={{ backgroundColor: "rgb(230,240,205)", color: "rgb(89,115,0)" }}
                        >
                            {kwActive} active
                        </span>
                    </div>

                    <div className="kw-list">
                        {keywords.map((k) => (
                            <div key={k.id} className="kw-row" onClick={() => toggleKw(k.id)}>
                                <span
                                    className={cn("cb", k.checked && "checked")}
                                    style={{ borderRadius: 6, borderWidth: 1 }}
                                >
                                    <Check size={12} strokeWidth={2} />
                                </span>
                                <span className="name">{k.text}</span>
                                {k.tag === "brand" && (
                                    <span className="tag" style={{ background: "var(--primary-bg)" }}>Brand</span>
                                )}
                                {k.tag === "competitor" && (
                                    <span className="tag competitor">Competitor</span>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="kw-input">
                        <span style={{ color: "var(--faint)" }}>
                            <Plus size={14} />
                        </span>
                        <input
                            placeholder="Add custom keyword, press Enter"
                            value={newKw}
                            onChange={(e) => setNewKw(e.target.value)}
                            onKeyDown={addKw}
                        />
                        <span className="hint">Enter ⏎</span>
                    </div>
                </div>

                {/* Right column ────────────────────────────────────────── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {/* Tracked accounts */}
                    <div className="cfg-card" style={{ padding: 16 }}>
                        <div className="cfg-head">
                            <div className="ttl-block">
                                <h3>Tracked Accounts</h3>
                                <div className="sub">When these accounts post relevant content, push to feed.</div>
                            </div>
                            <button type="button" className="add-btn">
                                <Plus size={12} /> Add
                            </button>
                        </div>
                        <div>
                            {accounts.map((a) => (
                                <div key={a.id} className="acc-row">
                                    <div className="av">{a.handle[1].toUpperCase()}</div>
                                    <div className="body">
                                        <div className="who">{a.handle}</div>
                                        <div className="role">{a.role}</div>
                                    </div>
                                    <button
                                        type="button"
                                        className="x-btn"
                                        onClick={() => removeAcc(a.id)}
                                        aria-label="Remove"
                                    >
                                        <Plus size={12} style={{ transform: "rotate(45deg)" }} />
                                    </button>
                                    <span
                                        className={cn("switch", a.on && "on")}
                                        onClick={() => toggleAcc(a.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Subreddits */}
                    <div className="cfg-card" style={{ padding: 16 }}>
                        <div className="cfg-head">
                            <div className="ttl-block">
                                <h3>Reddit Subreddits</h3>
                                <div className="sub">Monitor keyword-matching posts in these communities.</div>
                            </div>
                            <span
                                className="count-pill alert"
                                style={{ color: "rgb(89,115,0)", backgroundColor: "rgb(230,240,205)" }}
                            >
                                {subActive} active
                            </span>
                        </div>
                        <div className="sub-grid">
                            {subs.map((s) => (
                                <div
                                    key={s.id}
                                    className={cn("sub-card", s.on && "on")}
                                    onClick={() => toggleSub(s.id)}
                                >
                                    <span className={cn("cb", s.on && "checked")}>
                                        <Check size={12} strokeWidth={3} />
                                    </span>
                                    <span className="r-ico">r/</span>
                                    <div className="info">
                                        <div className="nm">{s.name}</div>
                                        <div className="mem">{s.members} members</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button type="button" className="add-sub">
                            <Plus size={12} /> Add subreddit
                        </button>
                    </div>
                </div>
            </div>

            <div className="config-foot">
                <div className="summary">
                    <span className="ok">
                        <Check size={14} /> Setup complete
                    </span>
                    <span>·</span>
                    <span>
                        <b>{kwActive}</b> keywords
                    </span>
                    <span>·</span>
                    <span>
                        <b>{subActive}</b> subreddits
                    </span>
                    <span>·</span>
                    <span>
                        <b>{accActive}</b> accounts
                    </span>
                    <span>·</span>
                    <span>
                        scans every <b>24 hours</b>
                    </span>
                </div>
                <button type="button" className="start-btn" onClick={onStart}>
                    <Rocket size={16} /> Start tracking posts
                </button>
            </div>
        </div>
    );
}
