"use client";
// ─────────────────────────────────────────────────────────────
// Platform Picker — combined "All Platform / X / Reddit"
// dropdown that sits at the left of the FilterBar.
// ─────────────────────────────────────────────────────────────
import * as React from "react";
import { ChevronDown } from "./local-stubs";

import { cn } from "./local-stubs";

import { PlatformR, PlatformX } from "./platform-icons";
import type { PlatformSource } from "../_lib/types";

interface PlatformPickerProps {
    source: PlatformSource;
    setSource: (next: PlatformSource) => void;
    totals: { all: number; x: number; reddit: number };
}

const LABEL_MAP: Record<PlatformSource, string> = {
    all: "All Platform",
    x: "X",
    reddit: "Reddit",
};

export function PlatformPicker({ source, setSource, totals }: PlatformPickerProps) {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    const count = source === "x" ? totals.x : source === "reddit" ? totals.reddit : totals.all;

    return (
        <div className="platform-picker" ref={ref}>
            <button
                type="button"
                className={cn("pp-trigger", open && "open")}
                onClick={() => setOpen((o) => !o)}
            >
                <span className="pp-label">{LABEL_MAP[source]}</span>
                <span className="pp-badge">{count}</span>
                <span className="pp-caret">
                    <ChevronDown size={12} />
                </span>
            </button>
            {open && (
                <div className="fdd-menu" style={{ minWidth: 180 }}>
                    <button
                        type="button"
                        className={cn("fdd-item", source === "all" && "on")}
                        onClick={() => {
                            setSource("all");
                            setOpen(false);
                        }}
                    >
                        <span>All Platform</span>
                        <span className="desc">{totals.all}</span>
                    </button>
                    <button
                        type="button"
                        className={cn("fdd-item", source === "x" && "on")}
                        onClick={() => {
                            setSource("x");
                            setOpen(false);
                        }}
                    >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                            <PlatformX size={11} /> X
                        </span>
                        <span className="desc">{totals.x}</span>
                    </button>
                    <button
                        type="button"
                        className={cn("fdd-item", source === "reddit" && "on")}
                        onClick={() => {
                            setSource("reddit");
                            setOpen(false);
                        }}
                    >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                            <PlatformR /> Reddit
                        </span>
                        <span className="desc">{totals.reddit}</span>
                    </button>
                </div>
            )}
        </div>
    );
}
