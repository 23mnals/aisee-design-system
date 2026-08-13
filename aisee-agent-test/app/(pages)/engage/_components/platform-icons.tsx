// ─────────────────────────────────────────────────────────────
// Platform glyphs (X + Reddit) — used inline in pills, avatars
// and metadata rows across the Engage feature.
// ─────────────────────────────────────────────────────────────
import * as React from "react";

interface PlatformIconProps {
    size?: number;
    className?: string;
}

export function PlatformX({ size = 11, className }: PlatformIconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            aria-hidden="true"
        >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

export function PlatformR({ size }: PlatformIconProps = {}) {
    // The Reddit glyph in the original design is a typographic "r/" wordmark,
    // not an SVG — keeps it crisp at any font weight.
    return (
        <span
            aria-hidden="true"
            style={{
                fontWeight: 800,
                fontStyle: "italic",
                letterSpacing: "-0.04em",
                fontFamily: "var(--font-karla, Karla)",
                fontSize: size ? `${size}px` : undefined,
                lineHeight: 1,
            }}
        >
            r/
        </span>
    );
}
