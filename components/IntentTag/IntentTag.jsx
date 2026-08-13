/* global React */
/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// IntentTag — the Signal-Feed classification chip (Figma family "意图类型" /
// "keywords类型"). One small rounded pill that colour-codes a post by its
// detected INTENT (help-seeking, discussion, hot take…) or by the KEYWORD TYPE
// that surfaced it (brand, competitor, pain-point).
//
// Extracted verbatim from engage-aisee-v2/feed-card.jsx INTENT_BG / EXTRA_BG so
// the palette matches the live cards exactly. Colours are literal repo hex — no
// external stylesheet needed, so the chip renders in isolation.
//
// Usage:
//   <IntentTag variant="intent">Help-seeking</IntentTag>
//   <IntentTag variant="compare">Comparison</IntentTag>
//   <IntentTag kind="keyword" variant="competitor">competitor</IntentTag>
// ─────────────────────────────────────────────────────────────────────────────

// Intent variants (post classification)
export const INTENT_BG = {
  intent:  '#FAE2FE', // help-seeking — lavender
  opinion: '#DCEEFF', // hot take — soft blue
  discuss: '#F7F6E9', // discussion — pale yellow
  compare: '#FFFADD', // comparison — light yellow
  data:    '#F7F6E9', // data share — pale yellow
};

// Keyword-type variants (why the post surfaced)
export const KEYWORD_BG = {
  brand:      '#FFF2B3', // brand mention
  competitor: '#FFD0D0', // competitor mention
  painpoint:  '#FDEBE4', // pain-point / complaint
};

export function IntentTag({ children, label, variant = 'intent', kind = 'intent', style }) {
  const map = kind === 'keyword' ? KEYWORD_BG : INTENT_BG;
  const bg = map[variant] || 'rgba(17,17,17,0.05)';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 22,
        padding: '0 8px',
        borderRadius: 9999,
        fontFamily: "'Karla', sans-serif",
        fontSize: 11,
        fontWeight: 500,
        color: '#111111',
        whiteSpace: 'nowrap',
        background: bg,
        ...style,
      }}
    >
      {children || label}
    </span>
  );
}
