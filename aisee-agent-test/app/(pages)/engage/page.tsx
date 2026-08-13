"use client";
// ─────────────────────────────────────────────────────────────
// Engage — entry page.
// First-run setup is shown until `engage:configured` is set in
// localStorage; after that the main banner + tabs view takes
// over. The "Reset to initial setup" handle in the corner is a
// demo affordance and can be removed for production.
// ─────────────────────────────────────────────────────────────
import * as React from "react";

import { EngageBanner } from "./_components/banner";
import { InitialConfig } from "./_components/initial-config";
import { KeywordsAccounts } from "./_components/keywords-accounts";
import { PageTabs, type EngageTab } from "./_components/page-tabs";
import { SentPage } from "./_components/sent";
import { SignalFeed } from "./_components/signal-feed";
import { FEED_DATA } from "./_lib/mock-data";

import "./_styles/engage.css";

const STORAGE_KEY = "engage:configured";

type ViewMode = "config" | "main";

export default function EngagePage() {
    // Hydrate from localStorage on mount to avoid SSR/CSR mismatch.
    const [viewMode, setViewMode] = React.useState<ViewMode>("config");
    const [hydrated, setHydrated] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState<EngageTab>("signal");

    React.useEffect(() => {
        setViewMode(window.localStorage.getItem(STORAGE_KEY) ? "main" : "config");
        setHydrated(true);
    }, []);

    const startTracking = () => {
        window.localStorage.setItem(STORAGE_KEY, "1");
        setViewMode("main");
    };

    const resetConfig = () => {
        window.localStorage.removeItem(STORAGE_KEY);
        setViewMode("config");
    };

    // Avoid flashing the config screen on first paint when the user has
    // already configured Engage in a prior session.
    if (!hydrated) return null;

    if (viewMode === "config") {
        return (
            <main className="main">
                <InitialConfig onStart={startTracking} />
            </main>
        );
    }

    const totals = {
        all: FEED_DATA.length,
        x: FEED_DATA.filter((p) => p.platform === "x").length,
        reddit: FEED_DATA.filter((p) => p.platform === "reddit").length,
    };

    return (
        <main className="main">
            <div className="fade-in">
                <EngageBanner
                    title="Engage"
                    subtitle="Monitor and reply to relevant conversations across X and Reddit."
                    stats={[
                        { label: "New", value: totals.all },
                        { label: "Keywords", value: 6 },
                        { label: "Accounts", value: 3 },
                        { label: "Sent", value: 3 },
                    ]}
                />

                <PageTabs
                    active={activeTab}
                    onChange={setActiveTab}
                    tabs={[
                        { id: "signal", label: "Signal Feed", count: totals.all },
                        { id: "keywords", label: "Keywords & Accounts" },
                        { id: "sent", label: "Sent", count: 3 },
                    ]}
                />

                {activeTab === "signal" && <SignalFeed />}
                {activeTab === "keywords" && <KeywordsAccounts />}
                {activeTab === "sent" && <SentPage />}

                <button
                    type="button"
                    className="reset-link"
                    onClick={resetConfig}
                    title="Reset to initial setup (demo)"
                >
                    ↺ Reset to initial setup (demo)
                </button>
            </div>
        </main>
    );
}
