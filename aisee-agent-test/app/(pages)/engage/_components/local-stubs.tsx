/* eslint-disable @typescript-eslint/no-explicit-any */
// ─────────────────────────────────────────────────────────────────────────────
// _local-stubs.tsx
//
// In the real Next.js app, components reach for `@/lib/cn`, `lucide-react`,
// and `next/image`. The in-browser bundler can't resolve npm packages or
// TS path-aliases, so this file re-implements them as local exports.
// All source files in this directory import from "./_local-stubs" instead.
// ─────────────────────────────────────────────────────────────────────────────

import * as React from "react";

// ── cn ──────────────────────────────────────────────────────────────────────
export function cn(...args: any[]): string {
    const out: string[] = [];
    const walk = (v: any) => {
        if (!v) return;
        if (typeof v === "string" || typeof v === "number") {
            out.push(String(v));
        } else if (Array.isArray(v)) {
            v.forEach(walk);
        } else if (typeof v === "object") {
            for (const k of Object.keys(v)) if (v[k]) out.push(k);
        }
    };
    args.forEach(walk);
    return out.join(" ");
}

// ── next/image shim ─────────────────────────────────────────────────────────
export const Image: React.FC<any> = (props) => {
    const { src, alt = "", width, height, className, style, ...rest } = props;
    return (
        <img
            src={typeof src === "string" ? src : (src && src.src) || ""}
            alt={alt}
            width={width}
            height={height}
            className={className}
            style={style}
            {...rest}
        />
    );
};

// ── lucide-react icon shims ─────────────────────────────────────────────────
// Stroke width / viewBox match lucide-react@^0.562. All icons take className,
// size (px), and standard SVG props.
interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
}
const mk = (
    paths: React.ReactNode,
    opts: { fill?: string; stroke?: number } = {},
): React.FC<IconProps> =>
    function Icon({ className = "", size, ...rest }: IconProps) {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill={opts.fill || "none"}
                stroke="currentColor"
                strokeWidth={opts.stroke ?? 2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
                {...rest}
            >
                {paths}
            </svg>
        );
    };

export const ArrowRight = mk(<><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>);
export const ArrowUp = mk(<><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></>);
export const Bell = mk(<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>);
export const Bolt = mk(<><path d="M14 17a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/><path d="M11.4 13.3 2 4a14 14 0 0 0 14 0l-9.4 9.3"/></>);
export const Bookmark = mk(<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>);
export const Calendar = mk(<><path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/></>);
export const Check = mk(<path d="M20 6 9 17l-5-5"/>);
export const ChevronDown = mk(<path d="m6 9 6 6 6-6"/>);
export const ChevronUp = mk(<path d="m18 15-6-6-6 6"/>);
export const ExternalLink = mk(<><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></>);
export const Filter = mk(<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />);
export const Heart = mk(<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>);
export const Info = mk(<><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></>);
export const Link2 = mk(<><path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" y1="12" x2="16" y2="12"/></>);
export const MessageCircle = mk(<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>);
export const MessageSquare = mk(<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>);
export const MoreHorizontal = mk(<><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></>);
export const Pencil = mk(<><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497Z"/><path d="m15 5 4 4"/></>);
export const Plus = mk(<><path d="M5 12h14"/><path d="M12 5v14"/></>);
export const RefreshCcw = mk(<><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></>);
export const RefreshCw = mk(<><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></>);
export const Rocket = mk(<><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></>);
export const RotateCcw = mk(<><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></>);
export const RotateCw = mk(<><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></>);
export const Search = mk(<><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>);
export const Send = mk(<><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></>);
export const Sparkles = mk(<><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></>);
export const Star = mk(<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>);
export const X = mk(<><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>);
export const Zap = mk(<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>);
