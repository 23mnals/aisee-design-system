/* global React */
/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// icons.jsx
//
// In the real Next.js app these are imported from `lucide-react`:
//
//   import { Bell, Plus, X, Check, Star, ExternalLink, Sparkles, ArrowRight,
//            RefreshCw, Send, Filter, Calendar, Rocket, Search, Heart,
//            MessageCircle, ArrowUp, ChevronDown, Pencil, RotateCcw, Info,
//            Zap, Bookmark, Link2, MoreHorizontal } from "lucide-react";
//
// This file inlines the same icon set as SVG components so the standalone
// preview works without npm. Strokes & viewBox match lucide-react@^0.562.
// ─────────────────────────────────────────────────────────────────────────────

const mk = (paths, opts = {}) => (props = {}) => {
  const { className = "w-4 h-4", size, ...rest } = props;
  const w = size || 16;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size ? w : undefined}
      height={size ? w : undefined}
      viewBox="0 0 24 24"
      fill={opts.fill || "none"}
      stroke="currentColor"
      strokeWidth={opts.stroke || 1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      {paths}
    </svg>
  );
};

window.Icons = {
  Bell: mk(<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>),
  Plus: mk(<><path d="M12 5v14"/><path d="M5 12h14"/></>),
  X: mk(<><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>),
  Check: mk(<path d="m20 6-11 11-5-5"/>, { stroke: 2 }),
  Star: mk(<path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/>),
  StarFilled: mk(<path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/>, { fill: "currentColor", stroke: 1 }),
  ExternalLink: mk(<><path d="M7 17 17 7"/><path d="M9 7h8v8"/></>),
  RefreshCw: mk(<><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></>),
  Send: mk(<path d="m22 2-7 20-4-9-9-4 20-7z"/>),
  Filter: mk(<path d="M22 3H2l8 9.5V19l4 2v-8.5L22 3z"/>),
  Calendar: mk(<><path d="M8 2v4"/><path d="M16 2v4"/><path d="M3 10h18"/><rect x="3" y="6" width="18" height="16" rx="2"/></>),
  Rocket: mk(<><path d="M4.5 16.5c-1.5 1-2 5-2 5s4-.5 5-2c.55-.8.5-2.06-.16-2.83a2 2 0 0 0-2.84.83z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><circle cx="15" cy="9" r="1.5"/></>),
  Search: mk(<><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></>),
  Heart: mk(<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>),
  MessageCircle: mk(<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>),
  ArrowUp: mk(<><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></>),
  ArrowRight: mk(<><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></>),
  ChevronDown: mk(<path d="m6 9 6 6 6-6"/>),
  ChevronUp: mk(<path d="m18 15-6-6-6 6"/>),
  Pencil: mk(<><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></>),
  RotateCcw: mk(<><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></>),
  Info: mk(<><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></>),
  Zap: mk(<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>),
  Bookmark: mk(<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>),
  Sparkles: mk(<><path d="M12 3l1.8 4.5L18 9l-4.2 1.5L12 15l-1.8-4.5L6 9l4.2-1.5z"/><path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9z"/><path d="M5 14l.6 1.4L7 16l-1.4.6L5 18l-.6-1.4L3 16l1.4-.6z"/></>),
  Trash: mk(<><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>),
  Copy: mk(<><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>),
  Link2: mk(<><path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><path d="M8 12h8"/></>),
  ShareUp: mk(<><path d="M12 17V3"/><path d="m6 9 6-6 6 6"/><path d="M5 21h14"/></>),
  MoreHorizontal: mk(<><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></>),
  // Platform glyphs (no lucide equivalents)
  PlatformX: ({ size = 14, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  PlatformR: ({ className = "" }) => (
    <span
      className={className}
      style={{ fontWeight: 800, fontStyle: "italic", letterSpacing: "-0.04em", fontFamily: "var(--font-karla)", lineHeight: 1 }}
    >
      r/
    </span>
  ),
};
