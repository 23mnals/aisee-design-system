import { Children, useId, type HTMLAttributes, type ReactNode } from 'react';
import { EmptyStateIllustration, type EmptyStateIllustrationName } from './EmptyStateIllustration';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  illustration?: ReactNode;
  illustrationName?: EmptyStateIllustrationName;
  illustrationAlt?: string;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  size?: 'default' | 'compact';
  variant?: 'plain' | 'inset';
  titleAs?: 'h2' | 'h3' | 'h4' | 'p';
}

function hasContent(content: ReactNode) {
  return Children.toArray(content).some(child => typeof child !== 'string' || child.trim().length > 0);
}

/** Optional slots collapse cleanly. Actions and business state belong to the caller. */
export function EmptyState({
  illustration, illustrationName, illustrationAlt = '', title, description, action,
  size = 'default', variant = 'plain', titleAs: Title = 'h2', className = '', ...props
}: EmptyStateProps) {
  const id = useId();
  const resolvedIllustration = illustration !== undefined ? illustration : illustrationName ? <EmptyStateIllustration name={illustrationName} alt={illustrationAlt} /> : undefined;
  const hasIllustration = hasContent(resolvedIllustration);
  const hasTitle = hasContent(title);
  const hasDescription = hasContent(description);
  const hasAction = hasContent(action);
  if (!hasIllustration && !hasTitle && !hasDescription && !hasAction) return null;

  return <div
    aria-labelledby={hasTitle && !props['aria-label'] ? `${id}-title` : undefined}
    aria-describedby={hasDescription ? `${id}-description` : undefined}
    {...props}
    className={`aisee-empty-state aisee-empty-state--${size} aisee-empty-state--${variant} ${className}`.trim()}
  >
    {hasIllustration && <div className="aisee-empty-state__illustration">{resolvedIllustration}</div>}
    {(hasTitle || hasDescription) && <div className="aisee-empty-state__copy">
      {hasTitle && <Title className="aisee-empty-state__title" id={`${id}-title`}>{title}</Title>}
      {hasDescription && <div className="aisee-empty-state__description" id={`${id}-description`}>{description}</div>}
    </div>}
    {hasAction && <div className="aisee-empty-state__action">{action}</div>}
  </div>;
}
