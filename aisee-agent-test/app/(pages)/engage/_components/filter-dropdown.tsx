"use client";
// ─────────────────────────────────────────────────────────────
// Filter Dropdown — single-select pill / dropdown used by the
// Signal Feed FilterBar. In `inline` mode it cycles values on
// click (no menu); the verbose mode shows a dropdown with
// label / desc pairs.
// ─────────────────────────────────────────────────────────────
import * as React from "react";
import { ChevronDown, X } from "./local-stubs";

import { cn } from "./local-stubs";

export interface FilterOption {
    id: string;
    label: string;
    desc?: string;
}

interface FilterDropdownProps {
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (id: string) => void;
    /** When true, click cycles values instead of opening a menu. */
    inline?: boolean;
}

export function FilterDropdown({
    label,
    value,
    options,
    onChange,
    inline,
}: FilterDropdownProps) {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    const current = options.find((o) => o.id === value);
    const isSet = value && value !== "all";

    if (inline) {
        return (
            <div className="fdd inline">
                <button
                    type="button"
                    className={cn("pill-trigger", isSet && "set")}
                    onClick={(e) => {
                        e.stopPropagation();
                        const idx = options.findIndex((o) => o.id === value);
                        const next = options[(idx + 1) % options.length];
                        onChange(next.id);
                    }}
                >
                    <span className="pill-label">{label}</span>
                    {isSet && (
                        <>
                            <span className="pill-divider">·</span>
                            <span className="pill-val">{current?.label}</span>
                            <span
                                className="pill-clear"
                                role="button"
                                aria-label="Clear"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange("all");
                                }}
                            >
                                <X size={9} />
                            </span>
                        </>
                    )}
                </button>
            </div>
        );
    }

    return (
        <div className="fdd" ref={ref}>
            <button
                type="button"
                className={cn("fdd-trigger", isSet && "set", open && "open")}
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen((o) => !o);
                }}
            >
                <span className="lbl-text">{label}</span>
                <span className="val">{current?.label || "All"}</span>
                {isSet && (
                    <span
                        className="fdd-clear"
                        role="button"
                        aria-label="Clear"
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange("all");
                        }}
                    >
                        <X size={10} />
                    </span>
                )}
                <span className="caret">
                    <ChevronDown size={11} />
                </span>
            </button>
            {open && (
                <div className="fdd-menu">
                    {options.map((o) => (
                        <button
                            type="button"
                            key={o.id}
                            className={cn("fdd-item", value === o.id && "on")}
                            onClick={() => {
                                onChange(o.id);
                                setOpen(false);
                            }}
                        >
                            <span>{o.label}</span>
                            {o.desc && <span className="desc">{o.desc}</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
