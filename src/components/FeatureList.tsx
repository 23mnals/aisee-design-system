import type { HTMLAttributes, ReactNode } from 'react';
import analysis from '../../assets/feature-overview/check-analysis.svg';
import growth from '../../assets/feature-overview/check-growth.svg';
import engage from '../../assets/feature-overview/check-engage.svg';
import publish from '../../assets/feature-overview/check-publish.svg';
const checks = { analysis, growth, engage, publish, neutral: growth };

export interface FeatureListItem {
  id: string;
  content: ReactNode;
  /** Optional supporting text or media; never treated as a selectable control. */
  supporting?: ReactNode;
  trailing?: ReactNode;
  icon?: ReactNode;
}
export interface FeatureListProps extends HTMLAttributes<HTMLUListElement> {
  items: FeatureListItem[];
  tone?: 'analysis' | 'growth' | 'engage' | 'publish' | 'neutral';
}
/** Read-only capabilities. Use Checkbox for user-selectable options instead. */
export function FeatureList({ items, tone = 'neutral', className = '', ...props }: FeatureListProps) {
  return <ul {...props} className={`aisee-feature-list aisee-feature-list--${tone} ${className}`.trim()}>
    {items.map(item => <li className="aisee-feature-list__item" key={item.id}>
      <span className="aisee-feature-list__icon" aria-hidden="true">{item.icon ?? <img src={checks[tone]} alt="" />}</span>
      <div className="aisee-feature-list__body"><div className="aisee-feature-list__line"><span>{item.content}</span>{item.trailing && <span className="aisee-feature-list__trailing">{item.trailing}</span>}</div>
        {item.supporting && <div className="aisee-feature-list__supporting">{item.supporting}</div>}
      </div>
    </li>)}
  </ul>;
}
