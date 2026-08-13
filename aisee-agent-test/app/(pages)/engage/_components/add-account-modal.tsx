"use client";
// ─────────────────────────────────────────────────────────────
// Modal: Add a tracked X account.
// Built on Radix Dialog (via components/ui/dialog.tsx) but
// styled to match the bespoke Engage modal — we override the
// default Dialog padding/chrome with the engage.css classes.
// ─────────────────────────────────────────────────────────────
import * as React from "react";
import { Bolt, Check, Plus, X } from "./local-stubs";

import { cn } from "./local-stubs";

import type { PriorityAccount } from "../_lib/types";

type Phase = "idle" | "verifying" | "verified" | "error";

interface VerifiedAccount {
    handle: string;
    name: string;
    initial: string;
    followers: string;
    postsPerWeek: number;
}

interface AddAccountModalProps {
    open: boolean;
    onClose: () => void;
    onAdd: (account: PriorityAccount) => void;
}

const KEYWORD_OPTIONS = ["GEO", "SEO media", "Technical SEO", "Growth", "AI search"];

export function AddAccountModal({ open, onClose, onAdd }: AddAccountModalProps) {
    const [handle, setHandle] = React.useState("");
    const [phase, setPhase] = React.useState<Phase>("idle");
    const [verified, setVerified] = React.useState<VerifiedAccount | null>(null);
    const [keywords, setKeywords] = React.useState<Set<string>>(new Set(["GEO"]));
    const [tracking, setTracking] = React.useState(true);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (open) {
            setHandle("");
            setPhase("idle");
            setVerified(null);
            setKeywords(new Set(["GEO"]));
            setTracking(true);
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

    const trimmed = handle.trim().replace(/^@/, "");
    const canVerify = trimmed.length >= 2 && phase !== "verifying";

    const runVerify = () => {
        if (!canVerify) return;
        setPhase("verifying");
        setVerified(null);
        window.setTimeout(() => {
            const display =
                trimmed.charAt(0).toUpperCase() + trimmed.slice(1).replace(/_/g, " ");
            setVerified({
                handle: "@" + trimmed,
                name: display,
                initial: trimmed.charAt(0).toUpperCase(),
                followers: "39K",
                postsPerWeek: 16,
            });
            setPhase("verified");
        }, 1100);
    };

    const toggleKw = (k: string) => {
        const next = new Set(keywords);
        if (next.has(k)) next.delete(k);
        else next.add(k);
        setKeywords(next);
    };

    const submit = () => {
        if (phase !== "verified" || !verified) return;
        onAdd({
            id: "a" + Date.now(),
            handle: verified.handle,
            role: [...keywords].join(", ") || "Tracked",
            on: tracking,
            initial: verified.initial,
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
                    <h2>Add a tracked account</h2>
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
                        <label className="modal-field-label">X handle</label>
                        <div className="modal-handle-row">
                            <div className="modal-handle-input">
                                <span className="pfx">@</span>
                                <input
                                    ref={inputRef}
                                    placeholder="seo-practitioner"
                                    value={handle}
                                    onChange={(e) => {
                                        setHandle(e.target.value);
                                        setPhase("idle");
                                        setVerified(null);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") runVerify();
                                    }}
                                />
                            </div>
                            <button
                                type="button"
                                className="modal-verify"
                                onClick={runVerify}
                                disabled={!canVerify}
                            >
                                Verify
                            </button>
                        </div>
                    </div>

                    {phase === "verifying" && (
                        <div className="vr-loading">
                            <span className="vr-spinner" />
                            Verifying @{trimmed} on X…
                        </div>
                    )}

                    {phase === "verified" && verified && (
                        <>
                            <div className="vr-success">
                                <div className="vr-row">
                                    <div className="vr-avatar">{verified.initial}</div>
                                    <div className="vr-body">
                                        <div className="vr-name">
                                            {verified.name}{" "}
                                            <span className="vr-verified-ico">
                                                <Check size={11} />
                                            </span>
                                        </div>
                                        <div className="vr-handle">{verified.handle} · X</div>
                                    </div>
                                    <span className="vr-ok">
                                        <Check size={13} />
                                    </span>
                                </div>
                                <div className="vr-stats">
                                    <span>
                                        <b>{verified.followers}</b> followers
                                    </span>
                                    <span className="dot">·</span>
                                    <span>
                                        ~<b>{verified.postsPerWeek}</b> posts / week
                                    </span>
                                    <span className="dot">·</span>
                                    <span>Public account</span>
                                </div>
                            </div>

                            <div className="modal-field">
                                <label className="modal-field-label">Keyword</label>
                                <div className="modal-chips">
                                    {KEYWORD_OPTIONS.map((k) => (
                                        <button
                                            type="button"
                                            key={k}
                                            className={cn("modal-chip", keywords.has(k) && "on")}
                                            onClick={() => toggleKw(k)}
                                        >
                                            {k}
                                        </button>
                                    ))}
                                    <button type="button" className="modal-chip custom">
                                        + Custom
                                    </button>
                                </div>
                            </div>

                            <div className="modal-toggle-row">
                                <span className="mtr-icon">
                                    <Bolt size={16} />
                                </span>
                                <div className="mtr-body">
                                    <div className="mtr-ttl">Start tracking on add</div>
                                    <div className="mtr-desc">
                                        New posts push to Signal Feed, checked every 3 hours.
                                    </div>
                                </div>
                                <span
                                    className={cn("switch-lg", tracking && "on")}
                                    onClick={() => setTracking(!tracking)}
                                    role="switch"
                                    aria-checked={tracking}
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
                        <Plus size={13} /> Add account
                    </button>
                </div>
            </div>
        </div>
    );
}
