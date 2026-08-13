import * as React from 'react';

/** Reply-lifecycle status. `authorReplied` is the inverted highlight variant. */
export type ReplyStatus = 'awaiting' | 'sent' | 'dismissed' | 'failed' | 'authorReplied';

export interface StatusBadgeProps {
  /** Lifecycle stage. Drives colour + default label. */
  status?: ReplyStatus;
  /** Override the default label text for the status. */
  label?: string;
  style?: React.CSSProperties;
}

/**
 * StatusBadge — reply-lifecycle pill (Figma "status-v5.3" / "status-v5.3-table").
 * Leading dot + label, colour-coded per lifecycle stage. `authorReplied` renders
 * an inverted dark pill with a check glyph instead of a dot.
 */
export declare function StatusBadge(props: StatusBadgeProps): React.ReactElement;

export declare const STATUS_STYLES: Record<ReplyStatus, { bg: string; fg: string; border: string }>;
export declare const STATUS_LABELS: Record<ReplyStatus, string>;
