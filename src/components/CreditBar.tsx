import type { HTMLAttributes, ReactNode } from 'react';
import sparkleIcon from '../../assets/credit-bar/sparkles.svg';

export interface CreditBarProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode;
  remaining?: ReactNode;
  unit?: ReactNode;
  subscriptionCredits: number;
  subscriptionLimit?: number;
  topUpCredits: number;
  subscriptionLabel?: ReactNode;
  topUpLabel?: ReactNode;
  purchaseLabel?: ReactNode;
  onPurchase?: () => void;
  illustration?: ReactNode;
}

const safeValue = (value: number) => Number.isFinite(value) ? Math.max(0, value) : 0;

/** Two-source credit balance: plan subscription credits and purchased top-ups. */
export function CreditBar({
  title = 'Remaining Credits',
  remaining,
  unit = 'Credits',
  subscriptionCredits,
  subscriptionLimit,
  topUpCredits,
  subscriptionLabel = 'Subscription',
  topUpLabel = 'Top-up',
  purchaseLabel = 'Purchase',
  onPurchase,
  illustration,
  className = '',
  ...props
}: CreditBarProps) {
  const subscription = safeValue(subscriptionCredits);
  const topUp = safeValue(topUpCredits);
  const total = subscription + topUp;
  const subscriptionPercent = total > 0 ? subscription / total * 100 : 0;
  const topUpPercent = total > 0 ? topUp / total * 100 : 0;
  const shownRemaining = remaining ?? total;
  const subscriptionValue = subscriptionLimit === undefined ? subscription : `${subscription}/${safeValue(subscriptionLimit)}`;
  const breakdown = `${String(subscriptionLabel)} ${subscriptionValue}, ${String(topUpLabel)} ${topUp}`;

  return <section {...props} className={`aisee-credit-bar ${className}`.trim()}>
    <div className="aisee-credit-bar__header">
      <span className="aisee-credit-bar__title">{title}</span>
      {onPurchase && <button className="aisee-credit-bar__purchase" type="button" onClick={onPurchase}>{purchaseLabel}</button>}
    </div>
    <div className="aisee-credit-bar__summary">
      <div className="aisee-credit-bar__balance">
        <span className="aisee-credit-bar__illustration" aria-hidden="true">{illustration ?? <img src={sparkleIcon} alt="" />}</span>
        <strong>{shownRemaining}</strong>
        {unit && <span className="aisee-credit-bar__unit">{unit}</span>}
      </div>
      <div className="aisee-credit-bar__legend" aria-label={breakdown}>
        <span className="aisee-credit-bar__legend-item" data-kind="subscription">
          <i aria-hidden="true" /><span>{subscriptionLabel}</span><strong>{subscriptionValue}</strong>
        </span>
        <span className="aisee-credit-bar__legend-item" data-kind="top-up">
          <i aria-hidden="true" /><span>{topUpLabel}</span><strong>{topUp}</strong>
        </span>
      </div>
    </div>
    <div className="aisee-credit-bar__track" role="img" aria-label={breakdown}>
      <span data-kind="subscription" style={{ width: `${subscriptionPercent}%` }} />
      <span data-kind="top-up" style={{ width: `${topUpPercent}%` }} />
    </div>
  </section>;
}
