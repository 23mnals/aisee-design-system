import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import { FeatureOverview, type FeatureOverviewSection } from '../../src/components/FeatureOverview';
import { FeatureList } from '../../src/components/FeatureList';
import { Card, CardGrid } from '../../src/components/Card';
import { StatCard, StatCardGroup } from '../../src/components/StatCard';
import { Badge } from '../../src/components/Badge';
import { Tooltip } from '../../src/components/Tooltip';
import { Dropdown } from '../../src/components/Dropdown';
import '../../src/tokens/tokens.css';
import '../../src/styles/base.css';
import '../../src/styles/components.css';
import './FeatureOverview.demo.css';

const assets = import.meta.glob('../../assets/feature-overview/*', { eager:true, query:'?url', import:'default' }) as Record<string,string>;
const asset = (name:string) => assets[`../../assets/feature-overview/${name}`];
const icon = (name:string, label = '') => <img src={asset(`${name}.svg`)} alt={label} />;
const badges = (category:string) => <><Badge variant="colour" color="neutral" className="feature-demo-category">{category}</Badge><Badge variant="colour" color="yellow" className="feature-demo-credit" icon={icon('credits')}>Uses Credits</Badge></>;
const engineNames = ['openai','claude','gemini','grok','perplexity'];
const engines = <span className="feature-demo-engines" aria-label="OpenAI, Claude, Gemini, Grok and Perplexity">{engineNames.map(name=><span key={name} className="feature-demo-engine" aria-hidden="true">{name==='gemini'?<span className="feature-demo-gemini" style={{maskImage:`url(${asset('gemini-mask.svg')})`,WebkitMaskImage:`url(${asset('gemini-mask.svg')})`,backgroundImage:`url(${asset('gemini-gradient.png')})`}} />:icon(name)}</span>)}</span>;
const platforms = ['x','reddit','linkedin','dev','hackernews','quora','medium'];
function PlatformFooter({publish = false}:{publish?:boolean}) {
  return <div className={`feature-demo-platforms ${publish?'feature-demo-platforms--publish':''}`}>
    <span>{publish?'Publishing channels':'Platforms monitored'} · <strong>19</strong></span>
    <span className="feature-demo-platform-icons" aria-label="X, Reddit, LinkedIn, DEV, Hacker News, Quora and Medium">{platforms.map(name=><span key={name}>{icon(name)}</span>)}</span><span className="feature-demo-more">+12</span>
  </div>;
}
const sections:FeatureOverviewSection[] = [
  {id:'analysis',title:'Analysis',icon:icon('analysis'),badges:badges('AI Visibility'),description:'Understand how AI sees your brand',tone:'analysis',items:[
    {id:'engines',content:<>AI visibility across <strong>5 AI engines</strong></>,trailing:engines},
    {id:'reports',content:<>Brand, ranking &amp; sentiment reports</>},
    {id:'tracking',content:<><strong>Competitor &amp; keyword</strong> tracking</>},
    {id:'audit',content:<><strong>Website GEO</strong> audit &amp; recommendations</>},
  ]},
  {id:'growth',title:'Growth plan',icon:icon('growth'),badges:badges('Plan & Optimize'),description:'Turn insights into action',tone:'growth',items:[
    {id:'plan',content:<><strong>AI-generated</strong> Growth Plan</>},
    {id:'tasks',content:<>Prioritized Task Center (<strong>score &amp; influence tasks</strong>)</>},
    {id:'calendar',content:<><strong>30-day</strong> publishing calendar</>},
    {id:'verify',content:<><strong>Verify</strong> your improvements</>},
  ]},
  {id:'engage',title:'Engage',icon:icon('engage'),badges:badges('AI Discovery & Reply'),description:'Never miss a conversation',tone:'engage',
    summary:<StatCardGroup variant="compact" aria-label="Engage limits"><StatCard value="30" label="Tracked keywords"/><StatCard value="20" label={<>Accounts per platform <Tooltip content="Up to 20 accounts for each connected platform." triggerTabIndex={0}><img className="feature-demo-info" src={asset('info.svg')} alt="About account limits"/></Tooltip></>}/><StatCard value={<>{icon('frequency')}24h</>} label="Scan frequency"/></StatCardGroup>,
    items:[
      {id:'find',content:<>Find <strong>high-value conversations</strong> across all major platforms</>},
      {id:'reply',content:<><strong>AI generates</strong> platform-specific replies</>},
      {id:'auto',content:<><strong>One-click</strong> or auto reply with <strong>Browser Extension</strong></>},
      {id:'track',content:<><strong>Track</strong> engagement performance</>},
    ],footer:<PlatformFooter/>},
  {id:'publish',title:'Publish',icon:icon('publish'),badges:badges('Content & automation'),description:'Publish everywhere with AI',tone:'publish',
    summary:<StatCardGroup variant="compact" aria-label="Publishing modes"><StatCard value={icon('auto-publish')} label="Auto Publish"/><StatCard value={icon('schedule')} label="Schedule 30-day"/><StatCard value={icon('manual-publish')} label="Manual Publish"/></StatCardGroup>,
    items:[
      {id:'generate',content:<>AI generates platform-ready posts from your analysis</>},
      {id:'schedule',content:<><strong>Auto &amp; scheduled</strong> publishing with browser extension</>},
      {id:'batch',content:<><strong>Batch publish</strong> across all connected channels</>},
      {id:'manual',content:<>Manual publish via <strong>Browser Extension</strong></>},
    ],footer:<PlatformFooter publish/>},
];
function App(){
  const [columns,setColumns]=useState('2');
  const [summaryMode,setSummaryMode]=useState('text');
  return <main className="feature-demo aisee-root" data-aisee-config={JSON.stringify([
    {scope:'Divided container',component:'CardGrid',props:{divided:true,columns:Number(columns)},composition:{outerCardVariant:'divided'}},
    {scope:'Compact information strip',component:'StatCardGroup',props:{variant:'compact'},composition:{valueDisplay:summaryMode}}
  ])}>
    <h1>Feature Overview</h1><p className="intro">One continuous card for capabilities, plan benefits and service summaries.</p>
    <h2>Four-section overview <span className="aisee-content-new">NEW</span></h2>
    <FeatureOverview sections={sections} aria-label="AISEE capabilities"/>
    <div className="feature-demo-heading"><h2>Divided container</h2><Dropdown ariaLabel="Columns" value={columns} onValueChange={v=>setColumns(String(v))} items={['1','2','3','4'].map(value=>({id:value,label:`${value} ${value==='1'?'column':'columns'}`}))}/></div>
    <Card variant="divided" aria-label="Reusable divided container"><CardGrid divided columns={Number(columns) as 1|2|3|4}>{['Overview','Requirements','Availability','Support'].map(title=><Card key={title} title={title} description="An independent content section."><p className="feature-demo-sample">Use any content here. The outer card owns the frame; sections share separators.</p></Card>)}</CardGrid></Card>
    <h2>Feature list</h2><div className="feature-demo-example"><FeatureList tone="analysis" aria-label="Included services" items={[{id:'audit',content:<>Includes a <strong>website audit</strong></>,supporting:'Supporting copy can wrap onto another line.'},{id:'platforms',content:'Compatible AI engines',trailing:engines},{id:'report',content:'Reports and recommendations'}]}/></div>
    <div className="feature-demo-heading"><h2>Compact information strip</h2><Dropdown ariaLabel="Value display" value={summaryMode} onValueChange={v=>setSummaryMode(String(v))} items={[{id:'text',label:'Text only'},{id:'icon',label:'Icon only'}]}/></div>
    <div className="feature-demo-example"><StatCardGroup variant="compact" aria-label="Workspace summary">{(summaryMode==='text' ? [{id:'keywords',value:'30',label:'Tracked keywords'},{id:'accounts',value:'20',label:'Accounts per platform'},{id:'frequency',value:'24h',label:'Scan frequency'}] : [{id:'auto',value:icon('auto-publish'),label:'Auto Publish'},{id:'schedule',value:icon('schedule'),label:'Schedule 30-day'},{id:'manual',value:icon('manual-publish'),label:'Manual Publish'}]).map(item=><StatCard key={item.id} value={item.value} label={item.label}/>)}</StatCardGroup></div>
    <h2>Usage</h2><div className="feature-demo-usage"><p>Compose Card + divided CardGrid, FeatureList and compact StatCardGroup. Titles, badges, summaries and footers remain optional content slots.</p><p>These are read-only features and capabilities. Keep billing choices and purchase actions in the surrounding product flow. Platform icons are demo content, not a new shared component.</p><pre>{`<Card variant="divided">\n  <CardGrid divided columns={2}>\n    <Card title="Overview">…</Card>\n    <Card title="Requirements">…</Card>\n  </CardGrid>\n</Card>\n\n<StatCardGroup variant="compact">\n  <StatCard value="30" label="Tracked keywords" />\n  <StatCard value="24h" label="Scan frequency" />\n</StatCardGroup>`}</pre></div>
  </main>;
}
createRoot(document.getElementById('feature-overview-demo')!).render(<App/>);
