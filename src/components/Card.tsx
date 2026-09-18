import { Children, useId, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import chevron from '../../assets/stemui/line_chevron-up.svg';

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode;
  shadow?: boolean;
  /** Default keeps the existing neutral card. Section adds the Figma white inset frame. */
  variant?: 'default' | 'section' | 'divided';
  description?: ReactNode;
  headerAction?: ReactNode;
  footer?: ReactNode;
  collapsible?: boolean;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** Supply for non-text titles when collapsible. */
  collapseLabel?: string;
}
export function Card({ title, shadow = false, variant = 'default', description, headerAction, footer,
  collapsible = false, expanded, defaultExpanded = true, onExpandedChange, collapseLabel,
  className = '', children, ...props }: CardProps) {
  const id = useId();
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isExpanded = !collapsible || (expanded ?? internalExpanded);
  const toggle = () => {
    if (expanded === undefined) setInternalExpanded(!isExpanded);
    onExpandedChange?.(!isExpanded);
  };
  return <section aria-labelledby={title ? `${id}-title` : undefined} className={`aisee-card${variant !== 'default' ? ` aisee-card--${variant}` : ''}${shadow ? ' aisee-card--shadow' : ''} ${className}`.trim()} {...props}>
    {(title || description || headerAction || collapsible) && <div className="aisee-card__header">
      <div className="aisee-card__heading">
        {title && <h3 id={`${id}-title`} className="aisee-card__title">{title}</h3>}
        {description && <div className="aisee-card__description">{description}</div>}
      </div>
      {headerAction && <div className="aisee-card__header-action">{headerAction}</div>}
      {collapsible && <button type="button" className="aisee-card__collapse" aria-label={collapseLabel ?? (typeof title === 'string' ? title : 'Card content')} aria-expanded={isExpanded} aria-controls={`${id}-content`} onClick={toggle}>
        <img src={chevron} alt="" />
      </button>}
    </div>}
    <div id={`${id}-content`} className="aisee-card__content" hidden={!isExpanded}>
      <div className="aisee-card__body">{children}</div>
      {footer && <div className="aisee-card__footer">{footer}</div>}
    </div>
  </section>;
}

export interface CardGridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4;
  /** Continuous sections with shared separators; use inside Card variant="divided". */
  divided?: boolean;
}
/** Responsive content layout; controls keep their own labels, values and validation. */
export function CardGrid({ columns = 2, divided = false, className = '', style, children, ...props }: CardGridProps) {
  return <div className={`aisee-card-grid${divided ? ' aisee-card-grid--divided' : ''} ${className}`.trim()} data-columns={columns} style={{ '--aisee-card-columns': columns, ...style } as CSSProperties} {...props}>
    {divided ? Children.toArray(children).map((child, index) => <div className="aisee-card-grid__cell" key={typeof child === 'object' && 'key' in child ? child.key ?? index : index}>{child}</div>) : children}
  </div>;
}
