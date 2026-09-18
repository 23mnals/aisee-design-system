import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SidebarLayout, SidebarNavigation, type SidebarNavigationGroup, type SidebarNavigationItem, type SidebarVariant, type SidebarTogglePosition, type SidebarReveal } from '../../src/components/SidebarNavigation';
import { Dropdown } from '../../src/components/Dropdown';
import { Avatar } from '../../src/components/Avatar';
import '../../src/tokens/tokens.css';
import '../../src/styles/base.css';
import '../../src/styles/components.css';
import './SidebarNavigation.demo.css';

const leaf = (label: string): SidebarNavigationItem => ({ id: label.toLowerCase().replace(/[^a-z0-9]+/g, '-'), label });
const icon = (name: string, stemui = false) => `../../assets/${stemui ? 'stemui/nav-' : 'sidebar-v6/'}${name}.svg`;
const groups: SidebarNavigationGroup[] = [
  { id: 'project', label: 'Project', items: [{ id: 'overview', label: 'Overview', iconSrc: icon('dashboard') }] },
  { id: 'growth-loop', label: 'Growth Loop', items: [
    { id: 'analysis', label: 'Analysis', iconSrc: icon('analysis'), children: ['Summary', 'Full Report'].map(leaf) },
    { id: 'growth', label: 'Growth', iconSrc: icon('growth'), children: ['Opportunities', 'Recommendations', 'Tasks'].map(leaf) },
    { id: 'engage', label: 'Engage', iconSrc: icon('engage', true), children: ['Signal Feed', 'Keywords & Accounts', 'Replies'].map(leaf) },
    { id: 'post', label: 'Post', iconSrc: icon('post'), children: ['Calendar', 'Table', 'Media'].map(leaf) },
    { id: 'campaigns', label: 'Campaigns', iconSrc: icon('campaign'), badge: <span className="sidebar-demo-new">NEW</span> },
    { id: 'verify', label: 'Verify', iconSrc: icon('verify', true), children: [
      { ...leaf('Compare'), iconSrc: icon('compare') },
      { ...leaf('Google Search Data'), iconSrc: icon('google'), iconTone: 'brand' },
      { ...leaf('Bing Webmaster Data'), iconSrc: icon('bing'), iconTone: 'brand' },
    ] },
  ] },
  { id: 'workflows', label: 'Workflows', items: [{ id: 'automation', label: 'Automation', iconSrc: icon('dashboard'), status: <span className="sidebar-demo-dot" aria-label="Available" /> }] },
  { id: 'connect-channels', label: 'Connect Channels', items: [{ id: 'connections', label: 'Connections', iconSrc: icon('connection', true) }] },
];
const destinations = groups.flatMap(group => group.items.flatMap(item => [item, ...(item.children ?? [])]));
const layoutOptions = [{ id: 'sidebar', label: 'Full height' }, { id: 'muted', label: 'Full height · gray' }, { id: 'floating', label: 'Floating card' }, { id: 'inset', label: 'Inset content' }, { id: 'topbar', label: 'Top navigation' }];
const revealOptions = [{ id: 'hover', label: 'Reveal on hover' }, { id: 'click', label: 'Reveal on click' }];
const positionOptions = [{ id: 'inside', label: 'Toggle inside' }, { id: 'outside', label: 'Toggle outside' }];
const descriptions = {
  sidebar: 'A full-height white sidebar with a shared edge beside the content.',
  muted: 'A full-height gray sidebar beside a white content region.',
  floating: 'A separate white card with 16px outer spacing and a subtle border.',
  topbar: 'The toggle stays in the top navigation. Collapsing hides the entire sidebar and gives the content the full width.',
  inset: 'A quiet sidebar beside an inset white content card.',
};

function Demo() {
  const [variant, setVariant] = useState<SidebarVariant>('sidebar');
  const [togglePosition, setTogglePosition] = useState<SidebarTogglePosition>('inside');
  const [reveal, setReveal] = useState<SidebarReveal>('hover');
  const [value, setValue] = useState('summary');
  const title = destinations.find(item => item.id === value)?.label;
  return <main className="sidebar-demo aisee-root" data-aisee-config={JSON.stringify([{scope:'Interactive preview',component:'SidebarLayout',props:{variant,...(variant==='topbar'?{reveal}:{togglePosition})}}])}>
    <h1>Sidebar Navigation</h1>
    <p className="intro">AISEE grouped navigation with full-height, floating-card, inset and top-navigation layouts. Keep selection and nested navigation while changing the layout.</p>
    <div className="sidebar-demo-heading">
      <h2 className="aisee-content-heading">Interactive preview <span className="aisee-content-new">NEW</span></h2>
      <div className="sidebar-demo-controls">
        <Dropdown ariaLabel="Sidebar layout" items={layoutOptions} value={variant} onValueChange={value => setVariant(value as SidebarVariant)} />
        {variant === 'topbar'
          ? <Dropdown ariaLabel="Sidebar reveal" items={revealOptions} value={reveal} onValueChange={value => setReveal(value as SidebarReveal)} />
          : <Dropdown ariaLabel="Toggle position" items={positionOptions} value={togglePosition} onValueChange={value => setTogglePosition(value as SidebarTogglePosition)} />}
      </div>
    </div>
    <div className="sidebar-demo-viewport" role="region" aria-label="Sidebar layout preview" tabIndex={0}>
      <SidebarLayout variant={variant} togglePosition={togglePosition} reveal={reveal}
        header={<><strong>{title}</strong><span><i className="sidebar-demo-dot" />Content area</span></>} sidebar={<SidebarNavigation
        groups={groups} value={value} onValueChange={setValue} defaultOpenItemIds={['analysis', 'post', 'verify']}
        ariaLabel="AISEE product navigation"
        header={<div className="sidebar-demo-header"><div className="sidebar-demo-project"><img src="../../assets/aisee-logo-mark.png" alt="" /><span>aisee</span></div><small>Last Updated: Sep 18, 2026</small></div>}
        footer={<div className="sidebar-demo-account"><Avatar kind="account" seed="name@example.com" size={32} label="Account avatar" /><div className="sidebar-demo-account-copy"><strong>name@example.com</strong><span>Growth Loop Plan</span></div></div>}
      />}>
        <section className="sidebar-demo-workspace" aria-label="Example content area">
          <div className="sidebar-demo-body"><article><h3>Page content</h3><p>This neutral placeholder keeps the sidebar in a real application shell while teams replace it with their own product content.</p></article></div>
        </section>
      </SidebarLayout>
    </div>
    <p className="sidebar-demo-caption">{descriptions[variant]} {variant === 'topbar' ? (reveal === 'hover' ? 'Hover over the top toggle to preview the sidebar without moving content. Click to keep it open.' : 'Click the top toggle to restore the sidebar; hovering does not reveal it.') : togglePosition === 'outside' ? 'The toggle sits at the top left of the content header, before the title, and remains reachable when collapsed.' : 'The toggle stays inside the sidebar header.'}</p>
    <h2>Layout variables</h2>
    <div className="sidebar-demo-notes"><ul><li>Full height defaults to a white sidebar. Full height · gray pairs a gray sidebar with a white content area.</li><li>Floating card keeps space above and below. Inset content gives the main region its own white card.</li><li>Inside / outside is independent of layout. The four side-by-side layouts keep the same AISEE typography, icons and hover states.</li><li>Top navigation adds a full-width header. Collapse hides the sidebar completely; choose hover preview or click to restore it. Escape, outside click or leaving the preview closes the hover panel.</li><li>Changing a layout preserves the selected destination, expanded groups and collapsed state.</li><li>On narrow screens this preview scrolls horizontally to keep the full application layout inspectable.</li></ul></div>
    <h2>Interaction</h2>
    <div className="sidebar-demo-notes"><ul><li>Overview remains a leaf destination. Analysis, Growth, Engage, Post and Verify each preserve their nested destinations.</li><li>Expanded mode composes the standalone Tree Nav component. The shell owns groups, the account footer and collapsed flyouts.</li><li>Collapsed icons open child menus. Click blank rail space to expand; Escape or clicking outside closes a flyout.</li><li>Navigation selection and the content title share the same state. Collapse / expand icons darken to button/usual on hover or keyboard focus.</li></ul></div>
    <h2>Usage</h2>
    <div className="sidebar-demo-notes"><p>Use SidebarLayout for the sidebar / content pairing. SidebarNavigation also accepts variant and togglePosition directly for existing shells.</p><pre>{`<SidebarLayout variant="floating" togglePosition="outside" header={pageHeader}
  sidebar={<SidebarNavigation groups={groups} value={page}
    onValueChange={setPage} header={project} footer={account} />}>
  {pageContent}
</SidebarLayout>`}</pre></div>
  </main>;
}
createRoot(document.getElementById('sidebar-navigation-demo')!).render(<Demo />);
