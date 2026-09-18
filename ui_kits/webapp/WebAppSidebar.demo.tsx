import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SidebarNavigation, type SidebarNavigationGroup, type SidebarNavigationItem } from '../../src/components/SidebarNavigation';
import { Avatar } from '../../src/components/Avatar';
import '../../src/tokens/tokens.css';
import '../../src/styles/base.css';
import '../../src/styles/components.css';
import './WebAppSidebar.demo.css';

const asset = (name: string) => `../../assets/stemui/${name}.svg`;
const sidebarAsset = (name: string) => `../../assets/sidebar-v6/${name}.svg`;
const item = (id: string, label: string, icon: string) => ({ id, label, iconSrc: asset(icon) });
const sidebarItem = (id: string, label: string, icon: string, iconTone?: 'monochrome' | 'brand'): SidebarNavigationItem => ({ id, label, iconSrc: sidebarAsset(icon), iconTone });
const groups: SidebarNavigationGroup[] = [
  { id: 'project', label: 'Project', items: [item('Overview', 'Overview', 'nav-overview')] },
  { id: 'growth-loop', label: 'Growth Loop', items: [
    { ...item('Analysis', 'Analysis', 'nav-analysis'), children: [item('Summary', 'Summary', 'nav-overview'), item('Full Report', 'Full Report', 'nav-post')] },
    item('Growth', 'Growth', 'nav-growth'),
    item('Engage', 'Engage', 'nav-engage'),
    { ...item('Post', 'Post', 'nav-post'), children: [item('Calendar', 'Calendar', 'nav-calendar'), item('Table', 'Table', 'nav-overview'), item('Media', 'Media', 'nav-media')], actionLabel: 'Create post', actionIcon: <img src={asset('action-plus')} alt="" /> },
    { ...sidebarItem('Campaigns', 'Campaigns', 'campaign'), badge: 'NEW' },
    { ...item('Verify', 'Verify', 'nav-verify'), children: [
      sidebarItem('Compare', 'Compare', 'compare'),
      sidebarItem('Google Search Data', 'Google Search Data', 'google', 'brand'),
      sidebarItem('Bing Webmaster Data', 'Bing Webmaster Data', 'bing', 'brand'),
    ] },
  ] },
  { id: 'workflows', label: 'Workflows', items: [sidebarItem('Automation', 'Automation', 'dashboard')] },
  { id: 'connect-channels', label: 'Connect Channels', items: [item('Connections', 'Connections', 'nav-connection')] },
];

function Sidebar() {
  const initial = decodeURIComponent(location.hash.slice(1)) || 'Overview';
  const [value, setValue] = useState(initial);
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem('aisee-sidebar-collapsed') === '1'; } catch { return false; }
  });

  useEffect(() => {
    const sync = (event: Event) => setValue((event as CustomEvent<string>).detail);
    window.addEventListener('aisee:screen-opened', sync);
    return () => window.removeEventListener('aisee:screen-opened', sync);
  }, []);
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('aisee:sidebar-collapsed', { detail: collapsed }));
  }, [collapsed]);

  return <SidebarNavigation
    groups={groups}
    value={value}
    collapsed={collapsed}
    defaultOpenItemIds={['Analysis', 'Post', 'Verify']}
    ariaLabel="AISEE product navigation"
    onValueChange={next => { setValue(next); window.dispatchEvent(new CustomEvent('aisee:navigate', { detail: next })); }}
    onCollapsedChange={next => {
      setCollapsed(next);
      try { localStorage.setItem('aisee-sidebar-collapsed', next ? '1' : '0'); } catch { /* optional */ }
    }}
    header={<div className="webapp-project"><img src="../../assets/aisee-logo-mark.png" alt="" /><span><strong>aisee</strong><small>Last Updated: Sep 15, 2026</small></span></div>}
    footer={<div className="webapp-account"><div className="webapp-account__identity"><Avatar kind="account" seed="projects5@gmail.com" size={30} label="User avatar" /><span><strong>projects5@gmail.com</strong><small>Growth Loop Plan</small></span></div><div className="webapp-account__credits"><strong>6840 Credits</strong><i><span /></i></div><button type="button"><img src={asset('action-logout')} alt="" /><span>Log out</span></button></div>}
  />;
}

createRoot(document.getElementById('webapp-sidebar')!).render(<Sidebar />);
