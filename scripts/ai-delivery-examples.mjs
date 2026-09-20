// The Notification pilot is intentionally the only source-delivery example.
export const notificationUsage = `'use client';
import { useEffect, useRef, useState } from 'react';
import { NotificationBell, NotificationPanel, type NotificationRecord, type NotificationTab } from './components/aisee/notificationbell';
import './components/aisee/notificationbell/styles.css';

export default function NotificationExample() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<NotificationTab>('all');
  const [items, setItems] = useState<NotificationRecord[]>([
    {id:'1', title:'Report ready', description:'Your analysis report is available.', time:'Just now', unread:true, tone:'analysis', status:'success'},
  ]);
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !host.current?.contains(event.target)) setOpen(false);
    };
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); host.current?.querySelector('button')?.focus(); }
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeEscape);
    };
  }, [open]);
  const markRead = (id: string) => setItems(current => current.map(item => item.id === id ? {...item, unread:false} : item));
  return (
    <div ref={host} className="aisee-root" style={{position:'relative', width:'fit-content', background:'transparent'}}>
      <NotificationBell count={items.filter(item => item.unread).length} dot={false}
        aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen(current => !current)} />
      {open && <div style={{position:'absolute', top:'calc(100% + 8px)', left:0, zIndex:50}}>
        <NotificationPanel items={items} activeTab={tab} onTabChange={setTab}
          onRead={markRead} onMarkAllRead={() => setItems(current => current.map(item => ({...item, unread:false})))} />
      </div>}
    </div>
  );
}
`;
