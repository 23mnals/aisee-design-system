import { useId, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Card, CardGrid } from '../../src/components/Card';
import { TagInput } from '../../src/components/TagInput';
import { Input, Textarea } from '../../src/components/Input';
import { SegmentedChoice } from '../../src/components/SegmentedChoice';
import { Dropdown } from '../../src/components/Dropdown';
import { Checkbox } from '../../src/components/Checkbox';
import { Toggle } from '../../src/components/Toggle';
import { Button } from '../../src/components/Button';
import { Badge } from '../../src/components/Badge';
import { StatCard } from '../../src/components/StatCard';
import { SocialAccountAvatar } from '../../src/components/Avatar';
import { Dialog } from '../../src/components/Dialog';
import xIcon from '../../assets/stemui/platform-x.svg';
import linkedinIcon from '../../assets/stemui/platform-linkedin.svg';
import '../../src/tokens/tokens.css';
import '../../src/styles/base.css';
import '../../src/styles/components.css';
import './Card.demo.css';

const patterns = [
  { id: 'input', label: 'Title + input' },
  { id: 'group', label: 'Title + input group' },
  { id: 'choice', label: 'Title + options' },
  { id: 'textarea', label: 'Title + long-form content' },
  { id: 'mixed', label: 'Mixed form' },
  { id: 'metrics', label: 'Data overview' },
  { id: 'accounts', label: 'Account selection list' },
  { id: 'settings', label: 'Collapsible settings + toggle' },
  { id: 'preview', label: 'Content preview' },
];

function SelectField({ label, options }: { label: string; options: string[] }) {
  const [value, setValue] = useState(options[0]);
  return <Dropdown label={label} ariaLabel={label} items={options.map(text => ({ id: text, label: text }))} value={value} onValueChange={setValue} />;
}

function ChoiceField({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (value: string) => void }) {
  const name = useId();
  return <fieldset className="card-demo-choices"><legend>{label}</legend><div>
    {options.map(option => <label className="card-demo-choice" key={option}>
      <input type="radio" className="aisee-sr-only" name={name} value={option} checked={value === option} onChange={() => onChange(option)} />
      <span>{option}</span>
    </label>)}
  </div></fieldset>;
}

function BasicInformation() {
  const [audience, setAudience] = useState('Primarily online');
  return <Card variant="section" title="Basic Information">
    <CardGrid>
      <Input label="Company Name *" required defaultValue="aicell" />
      <Input label="Website URL" type="url" defaultValue="https://aicell.world" disabled />
      <SelectField label="Industry" options={['Technology & Software', 'Education', 'Retail']} />
      <SelectField label="Primary Market" options={['United States', 'United Kingdom', 'Global']} />
    </CardGrid>
    <ChoiceField label="Where do you meet your customers?" options={['Primarily online', 'Primarily local', 'Both']} value={audience} onChange={setAudience} />
  </Card>;
}

function Descriptions() {
  return <Card variant="section" title="Brand Descriptions"><CardGrid>
    <Textarea label="Short Description" placeholder="Brief description of your brand (1–2 sentences)" />
    <Textarea label="Long Description" placeholder="Detailed description of your brand, products, and services" />
  </CardGrid></Card>;
}

function Metrics() {
  return <Card variant="section" title="Overview"><CardGrid columns={4}>
    <StatCard value="66.2" badge="— baseline" label="AI visibility" />
    <StatCard value="4 / 20" label="Score tasks completed" />
    <StatCard value="1 / 32" label="Brand influence tasks completed" />
    <StatCard value="1600" label="Available credits" />
  </CardGrid></Card>;
}

const accounts = [
  { id: 'yeying', name: 'yeying', handle: '@yeying', platform: 'X', icon: xIcon },
  { id: 'ginasllas', name: 'ginasllas', handle: '@ginasllas', platform: 'LinkedIn', icon: linkedinIcon },
  { id: 'dskdalsa', name: 'dskdalsa', handle: 'Not connected', platform: 'X', icon: xIcon, disabled: true },
];

function AccountCard({ selected, onChange }: { selected: string[]; onChange: (ids: string[]) => void }) {
  const selectable = accounts.filter(account => !account.disabled);
  const allSelected = selectable.every(account => selected.includes(account.id));
  return <Card variant="section" title="Step 1: Select accounts" footer={<>
    <Button size="sm" variant="secondary" onClick={() => onChange(allSelected ? [] : selectable.map(account => account.id))}>{allSelected ? 'Clear selection' : 'Select all'}</Button>
    <p className="card-demo-notice">Account details are synced from the AIsee extension. To switch accounts, update them in the extension.</p>
  </>}><div className="card-demo-account-list">
    {accounts.map(account => <div className="card-demo-account" key={account.id} data-disabled={account.disabled || undefined}>
      <Checkbox checked={selected.includes(account.id)} disabled={account.disabled} onChange={event => onChange(event.target.checked ? [...selected, account.id] : selected.filter(id => id !== account.id))} label={<span className="card-demo-account-info">
        <SocialAccountAvatar postOrigin="manual" seed={account.id} size={32} platformIconSrc={account.icon} platformLabel={account.platform} />
        <span><strong>{account.name}</strong><small>{account.handle}</small></span>
      </span>} />
    </div>)}
  </div></Card>;
}

function Settings() {
  const [format, setFormat] = useState('Single post');
  const [media, setMedia] = useState(false);
  return <Card variant="section" title="Post setup" headerAction={<Badge variant="colour" color="lime">Recommended</Badge>} collapsible>
    <SegmentedChoice label="Post format" tone="yellow" value={format} onValueChange={setFormat} options={[
      { id: 'Single post', label: 'Single post', requirement: 'Up to ~280 chars', description: 'One standalone post · Up to 280 characters' },
      { id: 'Thread', label: 'Thread', requirement: 'Connected X posts', description: 'A connected sequence of X posts for a longer story.' },
    ]} />
    <CardGrid columns={3}>
      <SelectField label="Post Strategy" options={['Expert take', 'Tips', 'Question']} />
      <SelectField label="Length" options={['Short', 'Medium', 'Long']} />
      <SelectField label="Source Adaptation" options={['Reframe', 'Summarize', 'Expand']} />
    </CardGrid>
    <Card title="Brand Mention" collapsible defaultExpanded={false} className="card-demo-nested" headerAction={<Badge variant="colour">Optional</Badge>}>
      <TagInput label="What to mention" placeholder="Enter a brand or topic" />
    </Card>
    <Card title="Use original image/video" className="card-demo-nested" headerAction={<Toggle label={media ? 'Included' : 'Not included'} checked={media} onChange={event => setMedia(event.target.checked)} />} footer={<p className="card-demo-note">Only reuse media you have permission to use. You can remove or replace it later in Post.</p>}>
      <p className="card-demo-note">{media ? 'Your post will include the original media.' : 'Your post will not include the original media.'}</p>
    </Card>
  </Card>;
}

function ContentPreview({ content = 'Your post content appears here.', selected = ['yeying'] }: { content?: string; selected?: string[] }) {
  const account = accounts.find(item => item.id === selected[0]);
  return <Card variant="section" title="Step 3: Preview & Post"><div className="card-demo-preview">
    {account ? <div className="card-demo-account-info"><SocialAccountAvatar postOrigin="manual" seed={account.id} size={32} platformIconSrc={account.icon} platformLabel={account.platform} /><span><strong>{account.name}</strong><small>Today · Preview</small></span></div> : <p className="card-demo-note">Select an account to preview your post.</p>}
    <p className="card-demo-post-content">{content || 'Write your content to see a preview.'}</p>
  </div></Card>;
}

function Pattern({ pattern }: { pattern: string }) {
  const [selected, setSelected] = useState(['yeying']);
  if (pattern === 'group') return <Card variant="section" title="Contact Information"><CardGrid><Input label="First name" placeholder="First name" /><Input label="Last name" placeholder="Last name" /><Input label="Email" type="email" placeholder="you@company.com" /></CardGrid></Card>;
  if (pattern === 'choice') return <Card variant="section" title="Publishing Preferences"><SelectField label="Default platform" options={['X', 'LinkedIn', 'Reddit']} /><div className="card-demo-checks"><Checkbox label="Include a link" defaultChecked /><Checkbox label="Include media" /></div></Card>;
  if (pattern === 'textarea') return <Descriptions />;
  if (pattern === 'mixed') return <BasicInformation />;
  if (pattern === 'metrics') return <Metrics />;
  if (pattern === 'accounts') return <AccountCard selected={selected} onChange={setSelected} />;
  if (pattern === 'settings') return <div data-aisee-theme="post-agent"><Settings /></div>;
  if (pattern === 'preview') return <ContentPreview />;
  return <Card variant="section" title="Project Information"><Input label="Project name" placeholder="Enter project name" /></Card>;
}

function App() {
  const [pattern, setPattern] = useState('mixed');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(['yeying']);
  const [content, setContent] = useState('');
  return <main className="aisee-root card-demo" data-aisee-config={JSON.stringify([{scope:'Content variants',component:'Card',composition:{id:pattern,label:patterns.find(item=>item.id===pattern)?.label},rules:['Use the selected composition from this page; its ID is a demo recipe, not a Card prop.','Use complex framing only on outer cards; nested cards use simple surfaces.']}])}>
    <h1>Card</h1>
    <p className="intro">A shared section surface for forms, selections, overview data and content previews.</p>
    <div className="card-demo-heading"><h2>Content variants <span className="aisee-content-new" data-updated-at="2026-09-17">NEW</span></h2><Dropdown ariaLabel="Card composition" value={pattern} onValueChange={setPattern} items={patterns} /></div>
    <div className="card-demo-stage"><Pattern key={pattern} pattern={pattern} /></div>
    <h2>Brand descriptions</h2><Descriptions />
    <h2>Data overview</h2><Metrics />
    <div className="card-demo-heading"><h2>Create Post composition</h2><Button variant="secondary" onClick={() => setOpen(true)}>Open dialog</Button></div>
    <div data-aisee-theme="post-agent"><Settings /></div>
    <p className="card-demo-note">Use the framed Card only for outer sections. Nested cards use a simple white surface with a light border; this rule applies in pages and dialogs.</p>
    <h2>Field states</h2>
    <Card variant="section" title="Editing states"><CardGrid><Input label="Required name" required error="Enter a name to continue." placeholder="Company name" /><Input label="Read-only URL" readOnly defaultValue="https://aicell.world" /><Textarea label="Disabled description" disabled defaultValue="This description is managed by your workspace." /><Textarea label="Description with help" hint="Describe your product in one or two sentences." placeholder="Type a description…" /></CardGrid></Card>
    <h2>Default / Elevated</h2><div className="card-demo-neutral"><Card title="Default card"><p>Use the shared 5% black border on white.</p></Card><Card title="Elevated card" shadow><p>Use the minimal card shadow only when separation needs reinforcement.</p></Card></div>
    <h2>Divided container</h2>
    <Card variant="divided" aria-label="Divided card example"><CardGrid divided columns={2}><Card title="Overview"><p>One shared outer frame.</p></Card><Card title="Requirements"><p>Simple inner separators.</p></Card></CardGrid></Card>
    <p className="card-demo-note"><a href="../FeatureOverview/FeatureOverview.html">Explore the four-section Feature Overview →</a></p>
    <h2>Usage</h2><div className="card-demo-usage"><p>Use one Card shell and compose the actual controls inside it. Card does not own form values, validation, account selection, publishing or data fetching.</p><pre>{`<Card variant="section" title="Basic Information"
  headerAction={<HelpButton />} footer={<SaveButton />}>
  <CardGrid columns={2}>
    <Input label="Company Name" />
    <Textarea label="Description" />
  </CardGrid>
</Card>`}</pre><p>Section: 16px radius and padding, a 5px white inset frame, a subtle outer border, 16px / 500 heading, and 8px column gaps. Dropdowns remain overlays and are not clipped. Use collapsible / defaultExpanded or expanded / onExpandedChange for optional sections; collapsing preserves field values. CardGrid supports 1–4 columns and stacks within narrow containers.</p></div>
    <Dialog open={open} onClose={() => setOpen(false)} title="Create Post" size="lg" className="card-demo-dialog" footer={<Button variant="secondary" onClick={() => setOpen(false)}>Close preview</Button>}>
      <div className="card-demo-create-post" data-aisee-theme="post-agent">
        <AccountCard selected={selected} onChange={setSelected} />
        <Card variant="section" title="Step 2: Write"><Textarea label="Post content" placeholder="Write your post…" value={content} onChange={event => setContent(event.target.value)} /><div className="card-demo-write-settings"><Settings /></div></Card>
        <ContentPreview content={content} selected={selected} />
      </div>
    </Dialog>
  </main>;
}

createRoot(document.getElementById('card-demo')!).render(<App />);
