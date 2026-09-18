import { useId, type CSSProperties, type ReactNode } from 'react';
import { Badge } from './Badge';
import { Button } from './Button';
import { DialogDetails, DialogDetailRow } from './Dialog';
import analysisLock from '../../assets/empty-state/library/unlock.svg';
import accessIcon from '../../assets/plan-card/subscription/access.svg';
import creditsIcon from '../../assets/plan-card/subscription/credits.svg';

export interface SubscriptionPlanCardProps {
  variant: 'subscription';
  name: string;
  title: string;
  description: string;
  price: string;
  priceUnit?: string;
  credits: string;
  creditsUnit?: string;
  creditsDescription?: string;
  accessTitle?: string;
  accessDescription?: string;
  companyName: string;
  website: string;
  companyIcon?: ReactNode;
  illustration?: ReactNode;
  actionLabel?: string;
  dismissLabel?: string;
  onAction: () => void;
  onDismiss: () => void;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function SubscriptionPlanCard({name,title,description,price,priceUnit='/month',credits,creditsUnit='cr /mo',
  creditsDescription='Use credits across the full platform.',accessTitle='Full access to all features',
  accessDescription='Analysis, Growth, Engage, Publish, and Verify included',companyName,website,companyIcon,
  illustration,actionLabel='Subscribe & Start Analysis',dismissLabel='Maybe later',onAction,onDismiss,
  disabled=false,className='',style}:SubscriptionPlanCardProps) {
  const titleId=useId();
  return <article className={`aisee-subscription-plan ${className}`.trim()} style={style} aria-labelledby={titleId}>
    <div className="aisee-subscription-plan__body">
      <div className="aisee-subscription-plan__illustration" aria-hidden="true">{illustration ?? <img src={analysisLock} alt=""/>}</div>
      <header className="aisee-subscription-plan__header">
        <Badge variant="colour" color="lime" className="aisee-subscription-plan__badge">{name}</Badge>
        <div className="aisee-subscription-plan__price"><strong>{price}</strong><span>{priceUnit}</span></div>
        <div className="aisee-subscription-plan__intro"><h3 id={titleId}>{title}</h3><p>{description}</p></div>
      </header>
      <div className="aisee-subscription-plan__benefits">
        <div className="aisee-subscription-plan__benefit"><span className="aisee-subscription-plan__benefit-icon" aria-hidden="true"><img src={accessIcon} alt=""/></span><div><strong>{accessTitle}</strong><p>{accessDescription}</p></div></div>
        <div className="aisee-subscription-plan__benefit"><span className="aisee-subscription-plan__benefit-icon" aria-hidden="true"><img src={creditsIcon} alt=""/></span><div><div className="aisee-subscription-plan__credit-value"><strong>{credits}</strong><span>{creditsUnit}</span></div><p>{creditsDescription}</p></div></div>
      </div>
      <DialogDetails className="aisee-subscription-plan__details">
        <DialogDetailRow label="Company Name" value={<span className="aisee-subscription-plan__company">{companyIcon && <span aria-hidden="true">{companyIcon}</span>}{companyName}</span>} />
        <DialogDetailRow label="Brand website" value={website}/>
      </DialogDetails>
    </div>
    <footer className="aisee-subscription-plan__footer">
      <Button variant="secondary" onClick={onDismiss}>{dismissLabel}</Button>
      <Button variant="dark" disabled={disabled} onClick={onAction}>{actionLabel}</Button>
    </footer>
  </article>;
}
