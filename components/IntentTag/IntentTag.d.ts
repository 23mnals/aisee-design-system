import * as React from 'react';

/** Post-intent classification variants (colour-coded). */
export type IntentVariant = 'intent' | 'opinion' | 'discuss' | 'compare' | 'data';

/** Keyword-type variants — why a post surfaced. */
export type KeywordVariant = 'brand' | 'competitor' | 'painpoint';

export interface IntentTagProps {
  /** Chip label. Prefer children; `label` is an alias. */
  children?: React.ReactNode;
  label?: string;
  /**
   * Which colour set to use.
   * - `intent` (default): post classification (INTENT_BG)
   * - `keyword`: keyword-type that surfaced the post (KEYWORD_BG)
   */
  kind?: 'intent' | 'keyword';
  /** Colour variant within the chosen `kind`. */
  variant?: IntentVariant | KeywordVariant;
  style?: React.CSSProperties;
}

/**
 * IntentTag — Signal-Feed classification chip (Figma "意图类型" / "keywords类型").
 * Small rounded pill that colour-codes a post by detected intent or keyword type.
 */
export declare function IntentTag(props: IntentTagProps): React.ReactElement;

export declare const INTENT_BG: Record<IntentVariant, string>;
export declare const KEYWORD_BG: Record<KeywordVariant, string>;
