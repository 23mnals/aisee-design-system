"use client";
// ─────────────────────────────────────────────────────────────
// Engage page tabs — Signal Feed / Keywords & Accounts / Sent.
// Lives between the banner and the active page content.
// ─────────────────────────────────────────────────────────────
import * as React from "react";
import { cn } from "./local-stubs";

export type EngageTab = "signal" | "keywords" | "sent";

interface PageTab {
    id: EngageTab;
    label: string;
    count?: number;
}

interface PageTabsProps {
    active: EngageTab;
    onChange: (next: EngageTab) => void;
    tabs: PageTab[];
}

export function PageTabs({ active, onChange, tabs }: PageTabsProps) {
    return (
        <div className="page-tabs" role="tablist">
            {tabs.map((t) => (
                <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={active === t.id}
                    className={cn("page-tab", active === t.id && "on")}
                    onClick={() => onChange(t.id)}
                >
                    {t.label}
                    {typeof t.count === "number" && (
                        <span className="count">{t.count}</span>
                    )}
                </button>
            ))}
        </div>
    );
}
