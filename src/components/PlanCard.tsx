import type { CSSProperties, ReactNode } from 'react';

export type PlanCardAction = 'current' | 'upgrade' | 'primary';

export interface PlanCardFeature {
  label: string;
  meta?: string;
  disabled?: boolean;
}

export interface PlanCardSection {
  title: string;
  tone?: 'analysis' | 'engage' | 'post' | 'support';
  items: PlanCardFeature[];
}

export interface PlanCardProps {
  name: string;
  audience: string;
  description: string;
  price: string;
  priceUnit?: string;
  credits: string;
  icon?: ReactNode;
  badge?: string;
  actionLabel: string;
  action?: PlanCardAction;
  sections: PlanCardSection[];
  onAction?: () => void;
  className?: string;
  style?: CSSProperties;
}

/** Current Figma v5.4 Upgrade Plan card. The former legacy PlanCard remains in components/PlanCard. */
export function PlanCard({
  name, audience, description, price, priceUnit = '/ Month', credits, icon,
  badge, actionLabel, action = 'upgrade', sections, onAction, className = '', style,
}: PlanCardProps) {
  return (
    <article className={`aisee-plan-card ${className}`.trim()} style={style}>
      {badge ? <span className="aisee-plan-card__badge">{badge}</span> : null}
      <div className="aisee-plan-card__top">
        <div className="aisee-plan-card__icon" aria-hidden="true">{icon}</div>
        <div className="aisee-plan-card__price"><strong>{price}</strong><span>{priceUnit}</span></div>
      </div>
      <div className="aisee-plan-card__identity">
        <div className="aisee-plan-card__name-row"><h3>{name}</h3><span>{audience}</span></div>
        <p>{description}</p>
      </div>
      <div className="aisee-plan-card__credits"><strong>{credits}</strong><span>credits / mo</span></div>
      <button type="button" className={`aisee-plan-card__action aisee-plan-card__action--${action}`} disabled={action === 'current'} onClick={action === 'current' ? undefined : onAction}>
        {actionLabel}{action !== 'current' ? <span aria-hidden="true"> →</span> : null}
      </button>
      <div className="aisee-plan-card__sections">
        {sections.map((section) => (
          <section className={`aisee-plan-card__section aisee-plan-card__section--${section.tone ?? 'support'}`} key={section.title}>
            <h4>{section.title}</h4>
            <ul>{section.items.map((item) => (
              <li className={item.disabled ? 'is-disabled' : ''} key={item.label}>
                <span className="aisee-plan-card__check" aria-hidden="true">{item.disabled ? '–' : '✓'}</span>
                <span>{item.label}</span>{item.meta ? <small>{item.meta}</small> : null}
              </li>
            ))}</ul>
          </section>
        ))}
      </div>
    </article>
  );
}
