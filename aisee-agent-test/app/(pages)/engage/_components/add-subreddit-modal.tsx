"use client";
// ─────────────────────────────────────────────────────────────
// Modal: Add a Reddit subreddit. Same shape as AddAccountModal —
// kept as a separate file because the two flows diverge fast
// (verification copy, follower vs. members, no keyword chips).
// ─────────────────────────────────────────────────────────────
import * as React from "react";
import { Bolt, Check, Plus, X } from "./local-stubs";

import { cn } from "./local-stubs";

import { PlatformR } from "./platform-icons";
import type { Subreddit } from "../_lib/types";

type Phase = "idle" | "verifying" | "verified" | "error";

interface FoundSubreddit {
    name: string;
    members: string;
    postsPerDay: number;
    type: string;
}

interface AddSubredditModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: (sub: Subreddit) => void;
}

export function AddSubredditModal({ open, onClose, onAdd }: AddSubredditModalProps) {
    const [name, setName] = React.useState("");
    const [phase, setPhase] = React.useState<Phase>("idle");
    const [found, setFound] = React.useState<FoundSubreddit | null>(null);
    const [monitoring, setMonitoring] = React.useState(true);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (open) {
            setName("");
            setPhase("idle");
            setFound(null);
            setMonitoring(true);
            window.setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open]);

    React.useEffect(() => {
        const esc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) onClose();
        };
        document.addEventListener("keydown", esc);
        return () => document.removeEventListener("keydown", esc);
    }, [open, onClose]);

    if (!open) return null;

    const trimmed = name.trim().replace(/^@/, "").replace(/^r\//, "");
    const canFind = trimmed.length >= 2 && phase !== "verifying";

    const runFind = () => {
        if (!canFind) return;
        setPhase("verifying");
        setFound(null);
        window.setTimeout(() => {
            setFound({
                name: "r/" + trimmed + "geo",
                members: "1.1M",
                postsPerDay: 28,
                type: "Reddit community",
            });
            setPhase("verified");
        }, 1100);
    };

    const submit = () => {
        if (phase !== "verified" || !found) return;
        onAdd({
            id: "s" + Date.now(),
            name: found.name.replace(/^r\//, ""),
            members: found.members,
            on: monitoring,
        });
        onClose();
    };

    return (
        <div
            className="modal-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="modal" role="dialog" aria-modal="true">
                <div className="modal-head">
                    <h2>Add a subreddit</h2>
                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="modal-field">
                        <label className="modal-field-label">Subreddit</label>
                        <div className="modal-handle-row">
                            <div className="modal-handle-input">
                                <span className="pfx">/</span>
                                <input
                                    ref={inputRef}
                                    placeholder="growthhacking"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setPhase("idle");
                                        setFound(null);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") runFind();
                                    }}
                                />
                            </div>
                            <button
                                type="button"
                                className="modal-verify"
                                onClick={runFind}
                                disabled={!canFind}
                            >
                                Find
                            </button>
                        </div>
                    </div>

                    {phase === "verifying" && (
                        <div className="vr-loading">
                            <span className="vr-spinner" />
                            Looking up r/{trimmed} on Reddit…
                        </div>
                    )}

                    {phase === "verified" && found && (
                        <>
                            <div className="vr-success">
                                <div className="vr-row">
                                    <div className="vr-avatar reddit">
                                        <PlatformR />
                                    </div>
                                    <div className="vr-body">
                                        <div className="vr-name">
                                            {found.name}{" "}
                                            <span className="vr-verified-ico">
                                                <Check size={11} />
                                            </span>
                                        </div>
                                        <div className="vr-handle">
                                            {found.members} members · {found.type}
                                        </div>
                                    </div>
                                    <span className="vr-ok">
                                        <Check size={13} />
                                    </span>
                                </div>
                                <div className="vr-stats">
                                    <span>
                                        <b>{found.postsPerDay}</b> posts / day
                                    </span>
                                    <span className="dot">·</span>
                                    <span style={{ color: "#5BA300", fontWeight: 600 }}>
                                        Active community
                                    </span>
                                    <span className="dot">·</span>
                                    <span>Public</span>
                                </div>
                            </div>

                            <div className="modal-toggle-row">
                                <span className="mtr-icon">
                                    <Bolt size={16} />
                                </span>
                                <div className="mtr-body">
                                    <div className="mtr-ttl">Start monitoring on add</div>
                                    <div className="mtr-desc">
                                        New matching threads push to Signal Feed.
                                    </div>
                                </div>
                                <span
                                    className={cn("switch-lg", monitoring && "on")}
                                    onClick={() => setMonitoring(!monitoring)}
                                    role="switch"
                                    aria-checked={monitoring}
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="modal-foot">
                    <button type="button" className="modal-cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="modal-submit"
                        onClick={submit}
                        disabled={phase !== "verified"}
                    >
                        <Plus size={13} /> Add subreddit
                    </button>
                </div>
            </div>
        </div>
    );
}
