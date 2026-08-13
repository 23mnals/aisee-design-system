/* global React */
/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// StatusBadge — reply-lifecycle status pill (Figma family "status-v5.3" /
// "status-v5.3-table"). Small pill with a leading dot that colour-codes a reply
// record by where it is in the lifecycle: Awaiting review → Sent → Dismissed /
// Failed, plus the inverted "Author replied" highlight.
//
// Colours extracted verbatim from the .rep-status rules in
// "Engage Replies (History).html" / engage-replies-page.jsx so table + card
// views stay identical. Fully self-contained (literal hex/rgba).
//
// Usage:
//   <StatusBadge status="awaiting" />                    // → "Awaiting review"
//   <StatusBadge status="sent" />                        // → "Sent"
//   <StatusBadge status="failed" label="Rate limited" /> // override label
//   <StatusBadge status="authorReplied" />               // inverted highlight
// ─────────────────────────────────────────────────────────────────────────────

export const STATUS_STYLES = {
  awaiting:      { bg: '#FFFADD',                 fg: '#7a5d00', border: '1px solid rgba(255,226,83,0.6)' },
  sent:          { bg: 'rgba(165,213,0,0.18)',    fg: '#4a5c00', border: 'none' },
  dismissed:     { bg: 'rgba(17,17,17,0.06)',     fg: 'rgba(17,17,17,0.5)', border: 'none' },
  failed:        { bg: '#FFE3D5',                 fg: '#a23a0c', border: 'none' },
  authorReplied: { bg: '#111111',                 fg: '#ffffff', border: 'none' },
};

export const STATUS_LABELS = {
  awaiting: 'Awaiting review',
  sent: 'Sent',
  dismissed: 'Dismissed',
  failed: 'Failed',
  authorReplied: 'Author replied',
};

// Small check glyph used by the "authorReplied" variant instead of a dot.
function Check({ size = 11 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.5 6.2l2.4 2.4 4.6-5.2" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StatusBadge({ status = 'awaiting', label, style }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.awaiting;
  const text = label || STATUS_LABELS[status] || status;
  const isAuthorReplied = status === 'authorReplied';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 22,
        padding: '0 9px',
        borderRadius: 9999,
        fontFamily: "'Karla', sans-serif",
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        background: s.bg,
        color: s.fg,
        border: s.border,
        ...style,
      }}
    >
      {isAuthorReplied
        ? <Check />
        : <span style={{ width: 6, height: 6, borderRadius: 999, background: 'currentColor' }} />}
      {text}
    </span>
  );
}
