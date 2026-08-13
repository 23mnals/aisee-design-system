"use client";
// ─────────────────────────────────────────────────────────────
// Feed Card — a single signal in the Signal Feed list.
// Clicking the card selects it (opens the Reply Panel).
// Clicking "Generate Reply" both selects + opens the panel.
// ─────────────────────────────────────────────────────────────
import * as React from "react";
import {
    ArrowRight,
    ArrowUp,
    ExternalLink,
    Heart,
    MessageSquare,
} from "./local-stubs";

import { cn } from "./local-stubs";

import { PlatformR, PlatformX } from "./platform-icons";
import type { FeedPost } from "../_lib/types";

function intentClass(v: FeedPost["intentVariant"]) {
    return v;
}

interface FeedCardProps {
    post: FeedPost;
    selected: boolean;
    onSelect: (id: string) => void;
    onGenerate: (id: string) => void;
}

export function FeedCard({ post, selected, onSelect, onGenerate }: FeedCardProps) {
    return (
        <article
            className={cn("feed-card", selected && "selected")}
            onClick={() => onSelect(post.id)}
        >
            <div className="fc-top">
                <span className={cn("platform-pill", post.platform === "reddit" && "r")}>
                    {post.platform === "x" ? <PlatformX size={11} /> : <PlatformR />}
                </span>
                <span className={cn("tag", intentClass(post.intentVariant))}>{post.intent}</span>
                {post.subreddit && <span className="tag subreddit">{post.subreddit}</span>}
                {post.actionTag && <span className="tag action">{post.actionTag}</span>}
                <span className="right">
                    <span>{post.time} ago</span>
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        <ExternalLink size={13} /> Source
                    </a>
                    <span className="score">{post.score}</span>
                </span>
            </div>

            <div className="fc-user">
                <span className="av">{post.user.avatar}</span>
                <span className="handle">{post.user.handle}</span>
                {post.user.followers && (
                    <>
                        <span className="meta">·</span>
                        <span className="meta">{post.user.followers}</span>
                    </>
                )}
            </div>

            <div className="fc-body">{post.body}</div>

            <div className="fc-bot">
                {post.tags.map((t, i) => {
                    const cls = i === 1 && post.extraTagClass ? post.extraTagClass : "";
                    return (
                        <span key={t} className={cn("tag", cls)}>
                            {t}
                        </span>
                    );
                })}
                <div className="spacer" />
                <div className="stats">
                    {post.platform === "x" ? (
                        <>
                            <span>
                                <Heart size={13} /> {post.stats.likes}
                            </span>
                            <span>
                                <MessageSquare size={13} /> {post.stats.replies}
                            </span>
                        </>
                    ) : (
                        <>
                            <span>
                                <ArrowUp size={13} /> {post.stats.upvotes}
                            </span>
                            <span>
                                <MessageSquare size={13} /> {post.stats.comments}
                            </span>
                        </>
                    )}
                </div>
                <button
                    type="button"
                    className="gen-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onGenerate(post.id);
                    }}
                >
                    Generate Reply <ArrowRight size={13} />
                </button>
            </div>
        </article>
    );
}
