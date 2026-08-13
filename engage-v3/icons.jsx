/* global React */
// Lucide-style SVG icons (1.5px stroke, rounded linecap)

const Icon = ({ d, fill, size = 16, stroke = 1.5, sw, sh }) => (
  <svg width={size} height={size} viewBox={`0 0 ${sw || 24} ${sh || 24}`}
       fill={fill || "none"} stroke="currentColor"
       strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {typeof d === "string" ? <path d={d} /> : d}
  </svg>
);

window.icons = {
  bell:     (s=16) => <Icon size={s} d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />,
  plus:     (s=16) => <Icon size={s} d="M12 5v14M5 12h14" />,
  x:        (s=16) => <Icon size={s} d="M18 6 6 18M6 6l12 12" />,
  check:    (s=12) => <Icon size={s} d="m20 6-11 11-5-5" stroke={2.5} />,
  star:     (s=16, filled=false) => <Icon size={s} fill={filled ? "currentColor" : "none"}
                                          d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />,
  starFav:  (s=16) => <Icon size={s} fill="currentColor" stroke={1}
                            d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />,
  ext:      (s=14) => <Icon size={s} d="M7 17 17 7M9 7h8v8" />,
  refresh:  (s=14) => <Icon size={s} d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5" />,
  send:     (s=14) => <Icon size={s} d="m22 2-7 20-4-9-9-4 20-7z" />,
  filter:   (s=14) => <Icon size={s} d="M22 3H2l8 9.5V19l4 2v-8.5L22 3z" />,
  schedule: (s=14) => <Icon size={s} d="M8 2v4M16 2v4M3 10h18M5 6h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />,
  rocket:   (s=16) => <Icon size={s} d="M4.5 16.5c-1.5 1-2 5-2 5s4-.5 5-2c.55-.8.5-2.06-.16-2.83a2 2 0 0 0-2.84.83zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2zM9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M15 9a1.5 1.5 0 1 0-1.5-1.5" />,
  refreshSync: (s=14) => <Icon size={s} d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5" />,
  message:  (s=22) => <Icon size={s} d="M3 11a8 8 0 1 1 16 0v9l-3-3H11a8 8 0 0 1-8-6z" />,
  search:   (s=14) => <Icon size={s} d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16zM21 21l-4.3-4.3" />,
  heart:    (s=14) => <Icon size={s} d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />,
  msgCount: (s=14) => <Icon size={s} d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
  bookmark: (s=14) => <Icon size={s} d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />,
  arrowUp:  (s=14) => <Icon size={s} d="M12 19V5M5 12l7-7 7 7" />,
  bubble:   (s=16) => (
    <svg width={s} height={s} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3.65517C2 2.74105 2.74105 2 3.65517 2H12.3448C13.259 2 14 2.74105 14 3.65517V9.86207C14 10.7762 13.259 11.5172 12.3448 11.5172H10.1724L8 14L5.82759 11.5172H3.65517C2.74105 11.5172 2 10.7762 2 9.86207V3.65517Z"/>
      <circle cx="5.5" cy="7.17" r="0.45" fill="currentColor"/>
      <circle cx="8"   cy="7.17" r="0.45" fill="currentColor"/>
      <circle cx="10.5" cy="7.17" r="0.45" fill="currentColor"/>
    </svg>
  ),
  chevron:  (s=14) => <Icon size={s} sw={16} sh={16} d="M6.12 11.76L9.88 8L6.12 4.24" />,
  chevronDown:  (s=12) => <Icon size={s} sw={16} sh={16} d="M4.24 6.12L8 9.88L11.76 6.12" />,
  link:     (s=14) => <Icon size={s} d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />,
  arrowR:   (s=14) => <Icon size={s} d="M5 12h14M12 5l7 7-7 7" />,
  sparkle:  (s=14) => <Icon size={s} d="M12 3l1.8 4.5L18 9l-4.2 1.5L12 15l-1.8-4.5L6 9l4.2-1.5zM19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9zM5 14l.6 1.4L7 16l-1.4.6L5 18l-.6-1.4L3 16l1.4-.6z" />,
  bolt:     (s=14) => <Icon size={s} d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
  edit:     (s=14) => <Icon size={s} d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" />,
  reset:    (s=12) => <Icon size={s} d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />,
  info:     (s=12) => <Icon size={s} d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 8h.01M11 12h1v4h1" />,
};

// Platform glyphs
window.PlatformX = ({ size = 11 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
window.PlatformR = ({ size = 11 }) => (
  <span style={{fontWeight:800, fontStyle:"italic", letterSpacing:"-0.04em", fontFamily:"Karla"}}>r/</span>
);
