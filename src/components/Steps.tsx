import type { HTMLAttributes, ReactNode } from 'react';

export type StepStatus = 'pending' | 'active' | 'complete' | 'error';

export interface StepItem {
  id: string;
  label: ReactNode;
  status?: StepStatus;
  icon?: ReactNode;
  iconSrc?: string;
}

export interface ThinkingStepItem {
  id: string;
  content: ReactNode;
  status: StepStatus;
}

export interface StepsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  items: readonly StepItem[];
  thinkingSteps?: readonly ThinkingStepItem[];
  title?: ReactNode;
  description?: ReactNode;
  illustration?: ReactNode;
  /** Static shows the workflow only; progress adds task states. */
  mode?: 'static' | 'progress';
  animated?: boolean;
  stepsLabel?: string;
  thinkingLabel?: string;
  statusLabels?: Partial<Record<StepStatus, string>>;
}

const defaultStatusLabels: Record<StepStatus, string> = {
  pending: 'Waiting', active: 'In progress', complete: 'Completed', error: 'Failed',
};

/** Controlled progress display. The caller owns task order, transitions and retry logic. */
export function Steps({
  items,
  thinkingSteps,
  title,
  description,
  illustration,
  mode = 'progress',
  animated = true,
  stepsLabel = 'Progress',
  thinkingLabel = 'Thinking steps',
  statusLabels,
  className = '',
  ...props
}: StepsProps) {
  const labels = { ...defaultStatusLabels, ...statusLabels };
  const hasThinkingSteps = mode === 'progress' && Boolean(thinkingSteps?.length);
  return <div {...props} className={`aisee-steps ${className}`.trim()} data-mode={mode} data-animated={mode === 'progress' && animated} data-variant={hasThinkingSteps ? 'thinking' : 'basic'}>
    {(illustration || title || description) && <div className="aisee-steps__header">
      {illustration && <div className="aisee-steps__illustration">{illustration}</div>}
      {title && <div className="aisee-steps__title">{title}</div>}
      {description && <div className="aisee-steps__description">{description}</div>}
    </div>}
    {items.length > 0 && <div className="aisee-steps__viewport" role="region" aria-label={stepsLabel} tabIndex={0}>
      <ol className="aisee-steps__rail">
        {items.map((item, index) => <li className="aisee-steps__item" data-status={mode === 'progress' ? item.status ?? 'pending' : undefined} aria-current={mode === 'progress' && item.status === 'active' ? 'step' : undefined} key={item.id}>
          <span className="aisee-steps__pill">
            <span className="aisee-steps__icon" aria-hidden="true">
              {mode === 'progress' && (item.status === 'active' || item.status === 'complete' || item.status === 'error')
                ? <span className={`aisee-steps__glyph aisee-steps__glyph--${item.status}`} />
                : item.iconSrc ? <img src={item.iconSrc} alt="" /> : item.icon ?? <span>{index + 1}</span>}
            </span>
            <span className="aisee-steps__label">{item.label}</span>
            {mode === 'progress' && <span className="aisee-steps__sr-only"> — {labels[item.status ?? 'pending']}</span>}
          </span>
        </li>)}
      </ol>
    </div>}
    {hasThinkingSteps && <div className="aisee-steps__thinking">
      <ul className="aisee-steps__log" aria-label={thinkingLabel} aria-live="polite" aria-relevant="additions text">
        {thinkingSteps?.map((step) => <li className="aisee-steps__log-item" key={step.id} data-status={step.status} aria-current={step.status === 'active' ? 'step' : undefined}>
          <span className="aisee-steps__log-content">{step.content}</span>
          <span className="aisee-steps__log-status" aria-hidden="true"><span className={`aisee-steps__glyph aisee-steps__glyph--${step.status}`} /></span>
          <span className="aisee-steps__sr-only"> — {labels[step.status]}</span>
        </li>)}
      </ul>
    </div>}
  </div>;
}
