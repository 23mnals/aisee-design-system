"use client";
// ─────────────────────────────────────────────────────────────
// Sent — history of replies the Engage agent already shipped.
// Layout: platform filter pills + date range tabs + KPI grid
// + per-reply history cards.
// ─────────────────────────────────────────────────────────────
import * as React from "react";
import {
    Bookmark,
    Check,
    ExternalLink,
    Heart,
    MessageSquare,
    RefreshCcw,
    Zap,
} from "./local-stubs";

import { cn } from "./local-stubs";

import { PlatformR, PlatformX } from "./platform-icons";
import { SENT_DATA } from "../_lib/mock-data";
import type { Platform, SentPost } from "../_lib/types";

type SentSource = Platform | "all";
type Range = "today" | "week" | "month";

function SentStatCard({ value, suffix, label }: { value: string; suffix?: string; label: string }) {
    return (
        <div className="sent-stat">
            <div className="sent-stat-num">
                <span className="big">{value}</span>
                {suffix && <span className="suf">{suffix}</span>}
            </div>
            <div className="sent-stat-lbl">{label}</div>
        </div>
    );
}

function SentCard({ post }: { post: SentPost }) {
    const isX = post.platform === "x";
    const traffic = post.trafficIdx;

    return (
        <article className="sent-card">
            <div className="sent-card-head">
                <span className="sent-av">{post.user.avatar}</span>
                <span className="sent-name">{post.user.name}</span>
                <span className="sent-handle">{post.user.handle}</span>
                <span className={cn("platform-pill", !isX && "r")}>
                    {isX ? <PlatformX size={11} /> : <PlatformR />}
                </span>
                <div style={{ flex: 1 }} />
                {post.replied && (
                    <span className="replied-pill">
                        <Check size={11} /> Author replied
                    </span>
                )}
                <span className="sent-time">{post.time}</span>
            </div>

            <div className="sent-body">{post.body}</div>

            <div className="sent-stats">
                <span className="sent-stat-cell">
                    <span className="sc-ico">
                        <Zap size={13} />
                    </span>
                    <span className="sc-num">{post.stats.impressions}</span>
                    <span className="sc-lbl">Impressions</span>
                </span>
                <span className="sent-stat-cell">
                    <span className="sc-ico" style={{ color: "#EC5212" }}>
                        <Heart size={13} />
                    </span>
                    <span className="sc-num" style={{ color: "#EC5212" }}>
                        {post.stats.likes}
                    </span>
                    <span className="sc-lbl">Likes</span>
                </span>
                <span className="sent-stat-cell">
                    <span className="sc-ico">
                        <RefreshCcw size={13} />
                    </span>
                    <span className="sc-num">{post.stats.retweets}</span>
                    <span className="sc-lbl">Retweets</span>
                </span>
                <span className="sent-stat-cell">
                    <span className="sc-ico">
                        <MessageSquare size={13} />
                    </span>
                    <span className="sc-num">{post.stats.replies}</span>
                    <span className="sc-lbl">Replies</span>
                </span>
                <span className="sent-stat-cell">
                    <span className="sc-ico">
                        <Bookmark size={13} />
                    </span>
                    <span className="sc-num">{post.stats.bookmarks}</span>
                    <span className="sc-lbl">Bookmarks</span>
                </span>
            </div>

            <div className="sent-foot">
                <div className="traffic-idx">
                    <span className="lbl">{isX ? "X" : "Reddit"} Traffic Index</span>
                    <span className="val">{traffic}</span>
                    <span className="bar">
                        <span style={{ width: `${Math.min(100, traffic / 10)}%` }} />
                    </span>
                </div>
                <span className="strategy-pill">{post.strategy}</span>
                <a className="view-post" href="#" onClick={(e) => e.preventDefault()}>
                    View Post <ExternalLink size={12} />
                </a>
            </div>
        </article>
    );
}

export function SentPage() {
    const [plat, setPlat] = React.useState<SentSource>("all");
    const [range, setRange] = React.useState<Range>("week");

    const xCount = SENT_DATA.filter((p) => p.platform === "x").length;
    const rCount = SENT_DATA.filter((p) => p.platform === "reddit").length;

    const filtered = SENT_DATA.filter((p) => {
        if (plat === "x" && p.platform !== "x") return false;
        if (plat === "reddit" && p.platform !== "reddit") return false;
        return true;
    });

    return (
        <div className="sent-page">
            <div className="sent-filter-row">
                <div className="sent-filter-left">
                    <button
                        type="button"
                        className={cn("sent-plat-pill", plat === "x" && "on")}
                        onClick={() => setPlat(plat === "x" ? "all" : "x")}
                    >
                        <span className="sent-plat-ico">
                            <PlatformX size={11} />
                        </span>
                        <span>X</span>
                        <span className="sent-plat-ct">{xCount}</span>
                    </button>
                    <button
                        type="button"
                        className={cn("sent-plat-pill r", plat === "reddit" && "on")}
                        onClick={() => setPlat(plat === "reddit" ? "all" : "reddit")}
                    >
                        <span className="sent-plat-ico">
                            <PlatformR />
                        </span>
                        <span>Reddit</span>
                        <span className="sent-plat-ct">{rCount}</span>
                    </button>
                </div>
                <div className="sent-range">
                    {(["today", "week", "month"] as const).map((r) => (
                        <button
                            key={r}
                            type="button"
                            className={cn("sent-range-tab", range === r && "on")}
                            onClick={() => setRange(r)}
                        >
                            {r === "today" ? "Today" : r === "week" ? "This week" : "Month"}
                        </button>
                    ))}
                </div>
            </div>

            <div className="sent-stats-grid">
                <SentStatCard value="2" label="X replies sent" />
                <SentStatCard value="100" suffix="%" label="Author replied" />
                <SentStatCard value="18.9" suffix="K" label="Total impressions" />
                <SentStatCard value="118" label="Avg. likes" />
            </div>

            <div className="sent-history-head">
                <span className="sent-history-lbl">HISTORY</span>
                <span className="sent-history-ct">{filtered.length} replies</span>
            </div>

            <div className="sent-list">
                {filtered.map((p) => (
                    <SentCard key={p.id} post={p} />
                ))}
            </div>
        </div>
    );
}
