import * as React from 'react';

export type PlanCtaKind = 'current' | 'upgrade' | 'primary';
export type PlanMetaKind = 'max' | 'trial' | 'unlimited';

export interface PlanFeatureItem {
  /** Feature text. May contain inline HTML (<b>, <br>, <span>). */
  label: string;
  /** Right-aligned meta pill text, e.g. "MAX", "Unlimited". */
  meta?: string;
  /** Colour treatment for the meta pill. */
  metaKind?: PlanMetaKind;
  /** Render a dash instead of a check tick (feature not included). */
  dash?: boolean;
}

export interface PlanFeatureSection {
  title: string;
  items: Array<PlanFeatureItem | string>;
}

export interface Plan {
  id: string;
  name: string;
  /** "For Individuals" / "For Startups" tag. */
  tag?: string;
  price: string;
  /** Defaults to "/ Month". */
  priceUnit?: string;
  desc?: string;
  /** e.g. "1,000" — rendered as "N credits / mo". */
  credits?: string;
  /** Ribbon badge above the card, e.g. "Full Engage". */
  badge?: string;
  featured?: boolean;
  /** Package icon — a React node or an SVG/HTML string. */
  icon?: React.ReactNode | string;
  cta: { label: string; kind: PlanCtaKind };
  sections: PlanFeatureSection[];
}

export interface PlanCardProps {
  plan: Plan;
  /** Fired when the CTA is clicked (except `current`, which is inert). */
  onCta?: () => void;
  style?: React.CSSProperties;
}

/**
 * PlanCard — pricing / subscription tier card (Figma "套餐_mo_starter/dev/pro").
 * Icon + price, name + tag, credits, CTA, then grouped feature sections with
 * lime check ticks and MAX / trial / unlimited meta pills.
 */
export declare function PlanCard(props: PlanCardProps): React.ReactElement | null;
