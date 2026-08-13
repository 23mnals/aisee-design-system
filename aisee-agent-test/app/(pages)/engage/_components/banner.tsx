"use client";
// ─────────────────────────────────────────────────────────────
// Engage banner — sits at the top of the page (both the
// initial-config "lime" variant and the main "lavender" variant).
// ─────────────────────────────────────────────────────────────
import * as React from "react";
import { Image } from "./local-stubs";
import { cn } from "./local-stubs";

export interface BannerStat {
    label: string;
    value: number | string;
}

interface EngageBannerProps {
    title: string;
    subtitle: string;
    stats: BannerStat[];
    /** "lime" = first-run config banner. "lavender" = main banner. */
    variant?: "lavender" | "lime";
}

export function EngageBanner({
    title,
    subtitle,
    stats,
    variant = "lavender",
}: EngageBannerProps) {
    return (
        <div
            className={cn("engage-banner", variant === "lime" && "config-banner")}
            style={{
                borderRadius: 16,
                borderWidth: 4,
                borderStyle: "solid",
                color: "rgb(255,255,255)",
                padding: "12px 16px",
            }}
        >
            <div className="engage-banner-top">
                <div className="icon-bubble">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <Image
                        src="/images/engage/engage-icon.svg"
                        alt=""
                        width={46}
                        height={46}
                        unoptimized
                    />
                </div>
                <div className="titles">
                    <h1>{title}</h1>
                    <div className="sub">{subtitle}</div>
                </div>
                <div className="banner-stats">
                    {stats.map((s) => (
                        <div key={s.label} className="banner-stat">
                            <span className="lbl">{s.label}</span>
                            <span className="num">{s.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
