import type { HTMLAttributes, ReactNode } from 'react';
import { Card, CardGrid } from './Card';
import { FeatureList, type FeatureListProps } from './FeatureList';

export interface FeatureOverviewSection {
  id: string;
  title: string;
  icon?: ReactNode;
  badges?: ReactNode;
  description?: ReactNode;
  summary?: ReactNode;
  items: FeatureListProps['items'];
  tone?: FeatureListProps['tone'];
  footer?: ReactNode;
}
export interface FeatureOverviewProps extends HTMLAttributes<HTMLElement> {
  sections: FeatureOverviewSection[];
  columns?: 1 | 2 | 3 | 4;
}
/** Content-driven composition; no plan prices, billing state or purchase logic. */
export function FeatureOverview({ sections, columns = 2, className = '', ...props }: FeatureOverviewProps) {
  return <Card variant="divided" className={`aisee-feature-overview ${className}`.trim()} {...props}>
    <CardGrid divided columns={columns}>
      {sections.map(section => <Card key={section.id} className="aisee-feature-overview__section" description={section.description}
        title={<><span className="aisee-feature-overview__identity">{section.icon && <span className="aisee-feature-overview__icon" aria-hidden="true">{section.icon}</span>}<span>{section.title}</span></span>{section.badges && <span className="aisee-feature-overview__badges">{section.badges}</span>}</>}>
        {section.summary && <div className="aisee-feature-overview__summary">{section.summary}</div>}
        <FeatureList items={section.items} tone={section.tone} aria-label={`${section.title} features`} />
        {section.footer && <div className="aisee-feature-overview__footer">{section.footer}</div>}
      </Card>)}
    </CardGrid>
  </Card>;
}
