import type { ReactNode } from 'react';
import notificationAnalysisIcon from '../../assets/notification/analysis.svg';
import notificationGrowthIcon from '../../assets/notification/growth.svg';
import notificationPostIcon from '../../assets/notification/post.svg';
import notificationSuccessIcon from '../../assets/notification/status-success.svg';
import notificationErrorIcon from '../../assets/notification/status-error.svg';
import notificationArrowIcon from '../../assets/notification/arrow-view.svg';
import notificationRetryIcon from '../../assets/notification/arrow-retry.svg';
import notificationEmptyIcon from '../../assets/empty-state/library/no-event.svg';

export type NotificationTone = 'analysis' | 'growth' | 'engage' | 'post' | 'billing' | 'neutral';
export type NotificationStatus = 'success' | 'error' | 'none';
export type NotificationPanelState = 'ready' | 'empty' | 'loading' | 'error';
export type NotificationTab = 'all' | 'unread';

export interface NotificationRecord {
  id: string;
  title: string;
  description: string;
  time: string;
  unread?: boolean;
  tone?: NotificationTone;
  status?: NotificationStatus;
  icon?: ReactNode;
  actionLabel?: string;
  errorMessage?: string;
}

export interface NotificationItemProps {
  notification: NotificationRecord;
  showIcon?: boolean;
  showStatus?: boolean;
  showAction?: boolean;
  onRead?: (id: string) => void;
  onAction?: (notification: NotificationRecord) => void;
}

const toneIcons: Partial<Record<NotificationTone, string>> = {
  analysis: notificationAnalysisIcon,
  growth: notificationGrowthIcon,
  engage: notificationAnalysisIcon,
  post: notificationPostIcon,
  billing: notificationAnalysisIcon,
};

export function NotificationItem({ notification, showIcon = true, showStatus = true, showAction = true, onRead, onAction }: NotificationItemProps) {
  const tone = notification.tone ?? 'neutral';
  const status = notification.status ?? 'none';
  const activate = () => onRead?.(notification.id);
  const activateAction = () => {
    onRead?.(notification.id);
    onAction?.(notification);
  };
  const statusIcon = status === 'success' ? notificationSuccessIcon : status === 'error' ? notificationErrorIcon : undefined;

  return (
    <article className="aisee-notification-item" data-unread={notification.unread ? 'true' : undefined} data-tone={tone}>
      <button className="aisee-notification-item__body" type="button" onClick={activate}>
        {showIcon && <span className="aisee-notification-item__icon" aria-hidden="true">{notification.icon ?? (toneIcons[tone] && <img src={toneIcons[tone]} alt="" />)}</span>}
        <span className="aisee-notification-item__content">
          <span className="aisee-notification-item__topline">
            <span className="aisee-notification-item__title">{notification.title}{showStatus && statusIcon && <img src={statusIcon} alt="" />}</span>
            <span className="aisee-notification-item__time">{notification.time}{notification.unread && <span className="aisee-notification-item__unread" aria-label="Unread" />}</span>
          </span>
          <span className="aisee-notification-item__description">{notification.description}</span>
          {notification.errorMessage && <span className="aisee-notification-item__error">{notification.errorMessage}</span>}
        </span>
      </button>
      {showAction && notification.actionLabel && <button className="aisee-notification-item__action" type="button" onClick={activateAction}>{notification.actionLabel}<img src={status === 'error' ? notificationRetryIcon : notificationArrowIcon} alt="" /></button>}
    </article>
  );
}

export interface NotificationPanelProps {
  items: NotificationRecord[];
  activeTab?: NotificationTab;
  state?: NotificationPanelState;
  errorMessage?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  showIcons?: boolean;
  showStatus?: boolean;
  showActions?: boolean;
  onTabChange?: (tab: NotificationTab) => void;
  onMarkAllRead?: () => void;
  onRead?: (id: string) => void;
  onAction?: (notification: NotificationRecord) => void;
}

export function NotificationPanel({ items, activeTab = 'all', state = 'ready', errorMessage = 'Notifications could not be loaded.', emptyTitle = 'All caught up', emptyMessage = "You don't have any unread notifications.", showIcons = true, showStatus = true, showActions = true, onTabChange, onMarkAllRead, onRead, onAction }: NotificationPanelProps) {
  const unreadCount = items.filter(item => item.unread).length;
  const displayedTab = state === 'empty' ? 'unread' : activeTab;
  const visibleItems = displayedTab === 'unread' ? items.filter(item => item.unread) : items;
  const showEmptyState = state === 'empty' || (state === 'ready' && visibleItems.length === 0);
  return (
    <section className="aisee-notification-panel" role="dialog" aria-label="Notifications">
      <header className="aisee-notification-panel__header"><h2>Notifications</h2></header>
      <div className="aisee-notification-panel__tabs">
        <div role="tablist" aria-label="Notification filter">
          <button type="button" role="tab" aria-selected={displayedTab === 'all'} onClick={() => onTabChange?.('all')}>All</button>
          <button type="button" role="tab" aria-selected={displayedTab === 'unread'} onClick={() => onTabChange?.('unread')}>Unread {!showEmptyState && <span>{unreadCount}</span>}</button>
        </div>
        {!showEmptyState && <button className="aisee-notification-panel__mark-all" type="button" disabled={unreadCount === 0} onClick={onMarkAllRead}>Mark all as read</button>}
      </div>
      <div className="aisee-notification-panel__content" aria-live="polite" aria-busy={state === 'loading'}>
        {state === 'loading' && <div className="aisee-notification-panel__state">Loading notifications…</div>}
        {state === 'error' && <div className="aisee-notification-panel__state" data-tone="error">{errorMessage}</div>}
        {showEmptyState && <div className="aisee-notification-panel__empty"><img src={notificationEmptyIcon} alt="" /><div><strong>{emptyTitle}</strong><span>{emptyMessage}</span></div></div>}
        {state === 'ready' && visibleItems.map(item => <NotificationItem key={item.id} notification={item} showIcon={showIcons} showStatus={showStatus} showAction={showActions} onRead={onRead} onAction={onAction} />)}
      </div>
    </section>
  );
}
