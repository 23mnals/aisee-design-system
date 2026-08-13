"use client";
// ─────────────────────────────────────────────────────────────
// FilterBar — single-row filter strip that sits between the
// page tabs and the feed grid. Owns:
//   • Source platform picker (All / X / Reddit)
//   • Last-sync indicator
//   • Inline refine pills (keyword quality, account reach,
//     platform heat, recency, tracked accounts)
//   • Reset button (when any refine is set)
// ─────────────────────────────────────────────────────────────
import * as React from "react";
import { RotateCw } from "./local-stubs";

import { PlatformPicker } from "./platform-picker";
import { FilterDropdown, type FilterOption } from "./filter-dropdown";
import type { PlatformSource, RefineFilters } from "../_lib/types";

export const REFINE_OPTIONS: Record<keyof RefineFilters, FilterOption[]> = {
    keywordQuality: [
        { id: "all", label: "Any" },
        { id: "high", label: "High", desc: "exact / brand" },
        { id: "medium", label: "Medium", desc: "topical match" },
        { id: "low", label: "Low", desc: "broad" },
    ],
    platformHeat: [
        { id: "all", label: "Any" },
        { id: "high", label: "Hot", desc: "500+ engagement" },
        { id: "medium", label: "Warm", desc: "100+ engagement" },
        { id: "low", label: "Cool", desc: "low engagement" },
    ],
    accountInfluence: [
        { id: "all", label: "Any" },
        { id: "high", label: "Big", desc: "10K+ followers" },
        { id: "medium", label: "Mid", desc: "1K–10K" },
        { id: "low", label: "Small", desc: "<1K" },
    ],
    recency: [
        { id: "all", label: "Any time" },
        { id: "fresh", label: "< 3h" },
        { id: "recent", label: "< 12h" },
        { id: "older", label: "12h+" },
    ],
    priority: [
        { id: "all", label: "All accounts" },
        { id: "on", label: "Priority only" },
    ],
};

interface FilterBarProps {
    source: PlatformSource;
    setSource: (next: PlatformSource) => void;
    refine: RefineFilters;
    setRefine: (next: RefineFilters) => void;
    onReset: () => void;
    totals: { all: number; x: number; reddit: number };
}

export function FilterBar({
    source,
    setSource,
    refine,
    setRefine,
    onReset,
    totals,
}: FilterBarProps) {
    const refineActive = Object.values(refine).filter((v) => v && v !== "all").length;

    return (
        <div className="filter-bar">
            <div className="filter-row">
                <PlatformPicker source={source} setSource={setSource} totals={totals} />

                <span className="sync-pulse" aria-hidden="true">
                    <span className="sync-dot" />
                </span>
                <span className="sync-text">
                    Last sync <b>2m ago</b> <span className="sep">·</span> Next in <b>23h 58m</b>
                </span>

                <div className="filter-spacer" />

                <span className="filters-label">Filters:</span>

                <FilterDropdown
                    label="Keywords"
                    inline
                    value={refine.keywordQuality}
                    options={REFINE_OPTIONS.keywordQuality}
                    onChange={(v) => setRefine({ ...refine, keywordQuality: v as RefineFilters["keywordQuality"] })}
                />
                <FilterDropdown
                    label="Account reach"
                    inline
                    value={refine.accountInfluence}
                    options={REFINE_OPTIONS.accountInfluence}
                    onChange={(v) =>
                        setRefine({ ...refine, accountInfluence: v as RefineFilters["accountInfluence"] })
                    }
                />
                <FilterDropdown
                    label="Platform heat"
                    inline
                    value={refine.platformHeat}
                    options={REFINE_OPTIONS.platformHeat}
                    onChange={(v) => setRefine({ ...refine, platformHeat: v as RefineFilters["platformHeat"] })}
                />
                <FilterDropdown
                    label="Recency"
                    inline
                    value={refine.recency}
                    options={REFINE_OPTIONS.recency}
                    onChange={(v) => setRefine({ ...refine, recency: v as RefineFilters["recency"] })}
                />
                <FilterDropdown
                    label="Tracked accounts"
                    inline
                    value={refine.priority}
                    options={REFINE_OPTIONS.priority}
                    onChange={(v) => setRefine({ ...refine, priority: v as RefineFilters["priority"] })}
                />

                {refineActive > 0 && (
                    <button type="button" className="fdd-reset" onClick={onReset}>
                        <RotateCw size={11} /> Clear {refineActive}
                    </button>
                )}
            </div>
        </div>
    );
}
