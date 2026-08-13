"use client";
// ─────────────────────────────────────────────────────────────
// Signal Feed — the main view inside the Engage feature.
// Lays out the FilterBar + paginated feed list + ReplyPanel
// sticky column.
// ─────────────────────────────────────────────────────────────
import * as React from "react";
import { RotateCw } from "./local-stubs";

import { cn } from "./local-stubs";

import { FilterBar } from "./filter-bar";
import { FeedCard } from "./feed-card";
import { ReplyPanel } from "./reply-panel";
import { FEED_DATA } from "../_lib/mock-data";
import type {
    FeedPost,
    PlatformSource,
    RefineFilters,
    SortMode,
} from "../_lib/types";

const DEFAULT_REFINE: RefineFilters = {
    keywordQuality: "all",
    platformHeat: "all",
    accountInfluence: "all",
    recency: "all",
    priority: "all",
};

export function SignalFeed() {
    const [source, setSource] = React.useState<PlatformSource>("all");
    const [refine, setRefine] = React.useState<RefineFilters>(DEFAULT_REFINE);
    const [sort] = React.useState<SortMode>("relevance");
    const [selectedId, setSelectedId] = React.useState<string | null>("p1");

    const filtered = React.useMemo<FeedPost[]>(() => {
        return FEED_DATA.filter((p) => {
            if (source === "x" && p.platform !== "x") return false;
            if (source === "reddit" && p.platform !== "reddit") return false;
            if (refine.keywordQuality !== "all" && p.keywordQuality !== refine.keywordQuality) return false;
            if (refine.platformHeat !== "all" && p.platformHeat !== refine.platformHeat) return false;
            if (refine.accountInfluence !== "all" && p.accountInfluence !== refine.accountInfluence)
                return false;
            if (refine.recency !== "all" && p.recency !== refine.recency) return false;
            if (refine.priority === "on" && !p.isPriority) return false;
            return true;
        });
    }, [source, refine]);

    const sorted = React.useMemo<FeedPost[]>(() => {
        const arr = [...filtered];
        if (sort === "newest") {
            arr.sort((a, b) => parseInt(a.time, 10) - parseInt(b.time, 10));
        } else if (sort === "engagement") {
            arr.sort((a, b) => {
                const aE = (a.stats.likes ?? a.stats.upvotes ?? 0) + (a.stats.replies ?? a.stats.comments ?? 0);
                const bE = (b.stats.likes ?? b.stats.upvotes ?? 0) + (b.stats.replies ?? b.stats.comments ?? 0);
                return bE - aE;
            });
        } else {
            arr.sort((a, b) => b.score - a.score);
        }
        return arr;
    }, [filtered, sort]);

    const totals = React.useMemo(
        () => ({
            all: FEED_DATA.length,
            x: FEED_DATA.filter((p) => p.platform === "x").length,
            reddit: FEED_DATA.filter((p) => p.platform === "reddit").length,
        }),
        [],
    );

    const selectedPost =
        sorted.find((p) => p.id === selectedId) ??
        FEED_DATA.find((p) => p.id === selectedId) ??
        null;
    const showPanel = !!selectedPost;

    const resetRefine = () => setRefine(DEFAULT_REFINE);

    return (
        <>
            <FilterBar
                source={source}
                setSource={setSource}
                refine={refine}
                setRefine={setRefine}
                onReset={resetRefine}
                totals={totals}
            />

            <div style={{ padding: "10px 32px 0", fontSize: 12, color: "var(--muted)" }}>
                Showing <b style={{ color: "var(--black)" }}>{sorted.length}</b> of {totals.all} opportunities
                {sort !== "relevance" && (
                    <>
                        {" "}
                        · sorted by <b style={{ color: "var(--black)" }}>{sort}</b>
                    </>
                )}
            </div>

            <div className={cn("feed-shell", !showPanel && "no-panel")}>
                <div className="feed-list">
                    {sorted.length === 0 ? (
                        <div
                            style={{
                                padding: "56px 24px",
                                textAlign: "center",
                                background: "var(--white)",
                                borderRadius: 12,
                                border: "1px solid var(--border)",
                            }}
                        >
                            <div style={{ fontSize: 14, color: "var(--muted)" }}>
                                No matches for these filters.
                            </div>
                            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                                Try clearing a refine option or switching source.
                            </div>
                            <button
                                type="button"
                                className="btn-secondary"
                                style={{ marginTop: 16 }}
                                onClick={resetRefine}
                            >
                                <RotateCw size={12} /> Clear refine filters
                            </button>
                        </div>
                    ) : (
                        sorted.map((post) => (
                            <FeedCard
                                key={post.id}
                                post={post}
                                selected={selectedId === post.id}
                                onSelect={setSelectedId}
                                onGenerate={setSelectedId}
                            />
                        ))
                    )}
                </div>

                {showPanel && selectedPost && (
                    <ReplyPanel post={selectedPost} onClose={() => setSelectedId(null)} />
                )}
            </div>
        </>
    );
}
