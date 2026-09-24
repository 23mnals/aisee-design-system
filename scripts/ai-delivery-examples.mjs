// Product usage only: no preview state, simulated data or notification panel.
export const notificationUsage = `'use client';
import { NotificationBell } from './components/aisee/notification-bell';

export default function HeaderBell({ unreadCount, onOpen }: {
  unreadCount: number;
  onOpen: () => void;
}) {
  return <NotificationBell count={unreadCount} onClick={onOpen} />;
}
`;
