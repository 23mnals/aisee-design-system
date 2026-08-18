import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, Card, Checkbox, Dialog, Dropdown, Input, LineChart, ModuleToggle, ScoreGauge, StatCard, TabItem, Table, Tabs, Tag, Toast, Toggle, Tooltip, type AiseeTheme } from '../src';
import './site.css';

const tabItems: TabItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'signal', label: 'Signal Feed' },
  { id: 'replies', label: 'Replies' },
];

const swatches = [
  ['Analysis', '#CFFF29'], ['Post Agent', '#FFE253'], ['Engage banner', '#F3E7F4'],
  ['Page', '#FAFAFA'], ['Card', '#FFFFFF'], ['Orange', '#EC5212'], ['Success', '#A5D500'], ['Cream', '#F7F6E9'],
];

const tableRows = [
  { id: 'chatgpt', source: 'ChatGPT', mentions: 1284, visibility: '68.4%' },
  { id: 'perplexity', source: 'Perplexity', mentions: 832, visibility: '54.2%' },
  { id: 'gemini', source: 'Gemini', mentions: 604, visibility: '41.8%' },
];

const tableColumns = [
  { id: 'source', header: 'Source', accessor: 'source' as const },
  { id: 'mentions', header: 'Mentions', accessor: 'mentions' as const, align: 'right' as const, numeric: true },
  { id: 'visibility', header: 'Visibility', accessor: 'visibility' as const, align: 'right' as const, numeric: true },
];

function App() {
  const [theme, setTheme] = useState<AiseeTheme>('analysis');
  const [tab, setTab] = useState('overview');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [period, setPeriod] = useState('weekly');
  const [toastOpen, setToastOpen] = useState(false);
  return <div className="aisee-root docs-shell" data-aisee-theme={theme}>
    <aside className="docs-sidebar">
      <img src="./assets/aisee-logo-wordmark.svg" alt="aisee" className="docs-logo" />
      <nav aria-label="文档目录">
        <a href="#foundations">Foundations</a><a href="#themes">Module themes</a><a href="#components">Components</a><a href="#patterns">Patterns</a><a href="#migration">Migration</a>
      </nav>
      <div className="docs-version"><span>v1.0.0</span><small>Spec v6 · 2026-08-13</small></div>
    </aside>
    <main className="docs-main">
      <header className="docs-hero">
        <div><p className="docs-eyebrow">AISEE DAPP DESIGN SYSTEM</p><h1>功能优先，数据驱动，品牌克制。</h1><p>最新 v6 规范的可维护实现：设计令牌、React 组件、交互模式与团队协作约定。</p></div>
        <ModuleToggle value={theme} onValueChange={setTheme} />
      </header>

      <section id="foundations" className="docs-section"><div className="docs-section-head"><div><p>01</p><h2>Foundations</h2></div><span>单一令牌源 · Karla 100% · 8px rhythm</span></div>
        <div className="swatches">{swatches.map(([name, color]) => <article key={name} className="swatch"><div style={{ background: color }} /><strong>{name}</strong><code>{color}</code></article>)}</div>
        <div className="type-grid"><article><span>Page title · 20/600</span><h3>Account Profile</h3></article><article><span>Section · 18/600</span><h4>Signal performance</h4></article><article><span>Body · 14/400</span><p>Track visibility, create posts, and reply to relevant conversations.</p></article><article><span>Caption · 12/400</span><small>Updated 2 minutes ago</small></article></div>
      </section>

      <section id="themes" className="docs-section"><div className="docs-section-head"><div><p>02</p><h2>Module themes</h2></div><span>当前预览：{theme}</span></div>
        <div className="theme-demo"><div><Tag variant="latest">Latest</Tag><h3>同一套组件，不同的任务主色</h3><p>切换 Analysis、Post Agent 或 Engage，所有主 CTA、活跃状态和进度反馈自动同步。Engage 沿用 yellow，但有独立 banner 身份色。</p><Button onClick={() => setDialogOpen(true)}>Open dialog</Button></div><div className="progress-demo"><span style={{ width: theme === 'analysis' ? '72%' : '88%' }} /></div></div>
      </section>

      <section id="components" className="docs-section"><div className="docs-section-head"><div><p>03</p><h2>Components</h2></div><span>Accessible React + CSS</span></div>
        <div className="component-grid">
          <Card title="Buttons"><div className="component-row"><Button>Primary</Button><Button variant="secondary">Secondary</Button><Button variant="ghost">Ghost</Button><Button variant="danger">Danger</Button></div></Card>
          <Card title="Form controls"><div className="form-stack"><Input label="Website URL" placeholder="Enter the website url" hint="We will analyze the public site." /><Checkbox label="Include competitor mentions" description="Add matching posts to this report." /><Dropdown label="Reporting period" items={[{ id: 'daily', label: 'Daily' }, { id: 'weekly', label: 'Weekly' }, { id: 'monthly', label: 'Monthly' }]} value={period} onValueChange={setPeriod} /><Toggle checked={enabled} onChange={(event) => setEnabled(event.target.checked)} label={enabled ? 'Monitoring on' : 'Monitoring off'} /></div></Card>
          <Card title="Tags"><div className="component-row"><Tag variant="latest">Latest</Tag><Tag variant="baseline">Baseline</Tag><Tag variant="target">Target</Tag><Tag variant="help">Help-seeking</Tag><Tag variant="opinion">Hot take</Tag></div></Card>
          <Card title="Page tabs"><Tabs items={tabItems} value={tab} onValueChange={setTab} /><p className="tab-result">Current view: {tab}</p></Card>
          <Card title="Feedback"><div className="component-row"><Tooltip content="Set as baseline"><Button variant="secondary">Hover or focus</Button></Tooltip><Button onClick={() => setToastOpen(true)}>Show toast</Button></div><Toast open={toastOpen} onDismiss={() => setToastOpen(false)}>Link copied to clipboard</Toast></Card>
          <StatCard label="AI VISIBILITY" value="68.4" unit="/ 100" delta="+12.4%" deltaTone="positive" helper="vs last week" />
          <Table columns={tableColumns} rows={tableRows} rowKey="id" caption="Visibility sources" />
          <LineChart title="AI visibility" description="Last six months" data={[{ label: 'Mar', value: 31 }, { label: 'Apr', value: 38 }, { label: 'May', value: 47 }, { label: 'Jun', value: 52 }, { label: 'Jul', value: 60 }, { label: 'Aug', value: 68 }]} />
          <ScoreGauge value={45} description="+8.4 points this month" />
        </div>
      </section>

      <section id="patterns" className="docs-section"><div className="docs-section-head"><div><p>04</p><h2>Patterns</h2></div><span>Header 70 · Sidebar 224 · Content 24–32</span></div>
        <div className="app-frame"><header><img src="./assets/aisee-logo-wordmark.svg" alt="aisee" /><div className="frame-actions"><span>Notifications</span><Button size="sm">+ New</Button><i>CB</i></div></header><aside><ModuleToggle value={theme} onValueChange={setTheme} /><nav><b>Dashboard</b><span>Signal Feed</span><span>Keywords & Accounts</span><span>Replies</span></nav></aside><section><div className="frame-title"><h3 className="aisee-page-title">Dashboard</h3><Tag variant="latest">Live</Tag></div><div className="stats"><article><small>AI VISIBILITY</small><strong>68.4</strong><em>+12.4%</em></article><article><small>CITATIONS</small><strong>246</strong><em>+8.1%</em></article><article><small>MENTIONS</small><strong>1,825</strong><em>+4.3%</em></article></div></section></div>
      </section>

      <section id="migration" className="docs-section docs-migration"><div className="docs-section-head"><div><p>05</p><h2>Migration from legacy</h2></div><span>v6 is authoritative</span></div>
        <div className="migration-grid"><article><s>Gotu in dApp</s><strong>Karla everywhere</strong></article><article><s>211px sidebar</s><strong>224px sidebar</strong></article><article><s>One global accent</s><strong>Module-aware primary</strong></article><article><s>12% static borders</s><strong>5% static borders</strong></article><article><s>Loose modal spacing</s><strong>24px hard rule</strong></article><article><s>Engage as submodule</s><strong>Independent third tab</strong></article></div>
      </section>

      <Dialog open={dialogOpen} title="Create analysis" description="Add the website you want aisee to analyze." onClose={() => setDialogOpen(false)} footer={<><Button variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button><Button onClick={() => setDialogOpen(false)}>Confirm</Button></>}><Input label="Website URL" placeholder="https://example.com" /></Dialog>
    </main>
  </div>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
