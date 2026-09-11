import type { HTMLAttributes, ReactNode } from 'react';

export interface TutorialStepItem {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  iconSrc?: string;
  action?: ReactNode;
}

export interface TutorialStepsProps extends Omit<HTMLAttributes<HTMLOListElement>, 'children'> {
  items: readonly TutorialStepItem[];
  /** Auto switches to a vertical flow inside narrow containers. */
  orientation?: 'auto' | 'horizontal' | 'vertical';
}

/** An explanatory feature tutorial. Navigation/actions are supplied by the caller. */
export function TutorialSteps({ items, orientation = 'auto', className = '', ...props }: TutorialStepsProps) {
  if (!items.length) return null;
  return <div className="aisee-tutorial-steps" data-orientation={orientation}>
    <ol aria-label="How it works" {...props} className={`aisee-tutorial-steps__list ${className}`.trim()}>
      {items.map((item, index) => <li className="aisee-tutorial-steps__item" key={item.id}>
        <div className="aisee-tutorial-steps__content">
          <span className="aisee-tutorial-steps__icon" aria-hidden="true">
            {item.iconSrc ? <img src={item.iconSrc} alt="" /> : item.icon ?? index + 1}
          </span>
          <div className="aisee-tutorial-steps__copy">
            <div className="aisee-tutorial-steps__title">{item.title}</div>
            {item.description && <div className="aisee-tutorial-steps__description">{item.description}</div>}
            {item.action && <div className="aisee-tutorial-steps__action">{item.action}</div>}
          </div>
        </div>
      </li>)}
    </ol>
  </div>;
}
