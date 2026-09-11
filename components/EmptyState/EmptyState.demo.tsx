import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { EmptyState } from '../../src/components/EmptyState';
import { EmptyStateIllustration, emptyStateIllustrations, type EmptyStateIllustrationName } from '../../src/components/EmptyStateIllustration';
import { Button } from '../../src/components/Button';
import { Dropdown } from '../../src/components/Dropdown';
import { Checkbox } from '../../src/components/Checkbox';
import '../../src/tokens/tokens.css';
import '../../src/styles/base.css';
import '../../src/styles/components.css';
import '../Steps/Steps.demo.css';
import './EmptyState.demo.css';
import { emptyStateExampleCopy } from './EmptyState.demo-data';

const illustrationChoices = (Object.keys(emptyStateIllustrations) as EmptyStateIllustrationName[]).map(id => ({ id, label: emptyStateIllustrations[id].label }));
function ExampleActions({ name, onAction }: { name: EmptyStateIllustrationName; onAction: (label: string) => void }) {
  const copy = emptyStateExampleCopy[name];
  return <>{copy.secondaryAction && <Button variant="secondary" onClick={() => onAction(copy.secondaryAction!)}>{copy.secondaryAction}</Button>}<Button onClick={() => onAction(copy.primaryAction)}>{copy.primaryAction}</Button></>;
}

function App() {
  const [slots, setSlots] = useState({ illustration: true, title: true, description: true, action: true });
  const [size, setSize] = useState<'default' | 'compact'>('default');
  const [variant, setVariant] = useState<'plain' | 'inset'>('plain');
  const [illustrationName, setIllustrationName] = useState<EmptyStateIllustrationName>('no-event');
  const [fullIllustration, setFullIllustration] = useState<EmptyStateIllustrationName>('no-event');
  const [compactIllustration, setCompactIllustration] = useState<EmptyStateIllustrationName>('no-account');
  const fullCopy = emptyStateExampleCopy[fullIllustration];
  const compactCopy = emptyStateExampleCopy[compactIllustration];
  const compositionCopy = emptyStateExampleCopy[illustrationName];
  const [compositionNotice, setCompositionNotice] = useState('');
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('unmatched-keyword');

  return <main>
    <h1>Empty State</h1>
    <p className="intro">Compose illustration, title, description and actions to fit the space and the next useful step.</p>
    <div className="empty-example-heading"><h2 className="aisee-content-heading">Full composition <span className="aisee-content-new">NEW</span></h2><Dropdown ariaLabel="Full composition illustration" items={illustrationChoices} value={fullIllustration} onValueChange={value => { setFullIllustration(value as EmptyStateIllustrationName); setNotice(''); }} /></div>
    <section className="empty-specimen" data-aisee-theme="post-agent" aria-label="Full empty state example">
      <EmptyState illustrationName={fullIllustration} title={fullCopy.title} description={fullCopy.description} action={<ExampleActions name={fullIllustration} onAction={label => setNotice(`Demo: ${label} selected.`)} />} />
      <p className="demo-notice" role="status">{notice}</p>
    </section>

    <div className="empty-example-heading"><h2>No action</h2><Dropdown ariaLabel="No action illustration" items={illustrationChoices} value={compactIllustration} onValueChange={value => setCompactIllustration(value as EmptyStateIllustrationName)} /></div>
    <section aria-label="Compact empty state example">
      <EmptyState size="compact" illustrationName={compactIllustration} title={compactCopy.title} description={compactCopy.description} />
    </section>

    <h2>Illustration + description</h2>
    <section aria-label="Description only empty state example">
      <EmptyState variant="inset" illustrationName="no-event" description="Pick a strategy, optionally guide the angle, set intensity — then generate." />
    </section>

    <h2>Compose your state</h2>
    <section aria-label="Empty state composition playground">
      <div className="composition-controls">
        <div className="composition-slots">{(Object.keys(slots) as Array<keyof typeof slots>).map(slot => <Checkbox key={slot} label={slot} checked={slots[slot]} onChange={event => setSlots(current => ({ ...current, [slot]: event.target.checked }))} />)}</div>
        <div className="composition-selects">
          <div className="composition-select"><span>Size</span><Dropdown ariaLabel="Size" items={[{ id: 'default', label: 'Default' }, { id: 'compact', label: 'Compact' }]} value={size} onValueChange={value => setSize(value as typeof size)} /></div>
          <div className="composition-select"><span>Surface</span><Dropdown ariaLabel="Surface" items={[{ id: 'plain', label: 'Plain' }, { id: 'inset', label: 'Inset' }]} value={variant} onValueChange={value => setVariant(value as typeof variant)} /></div>
        </div>
      </div>
      <div className="composition-preview" data-aisee-theme="post-agent">
        <EmptyState size={size} variant={variant} illustrationName={slots.illustration ? illustrationName : undefined} title={slots.title ? compositionCopy.title : undefined} description={slots.description ? compositionCopy.description : undefined} action={slots.action ? <ExampleActions name={illustrationName} onAction={label => setCompositionNotice(`Demo: ${label} selected.`)} /> : undefined} />
      </div>
      <p className="demo-notice" role="status">{compositionNotice}</p>
      <p className="note">Omitted slots render no wrapper or extra gap. With all four slots off, the component renders nothing.</p>
    </section>

    <h2>No search results</h2>
    <section aria-label="Filtered results example">
      <label className="search-control">Filter posts<input value={query} onChange={event => setQuery(event.target.value)} /></label>
      {query ? <EmptyState size="compact" title="No results found" description={<>No demo posts match “{query}”. Try a different term or clear your filter.</>} action={<Button variant="secondary" onClick={() => setQuery('')}>Clear filter</Button>} /> : <p role="status">Filter cleared. The results area can show its content again.</p>}
    </section>

    <h2 className="aisee-content-heading">Illustration library <span className="aisee-content-new">NEW</span></h2>
    <section aria-label="Empty state illustration library">
      <div className="illustration-grid">{(Object.keys(emptyStateIllustrations) as EmptyStateIllustrationName[]).map(name => <button className="illustration-choice" type="button" key={name} aria-pressed={name === illustrationName} aria-label={`Use ${emptyStateIllustrations[name].label} illustration`} onClick={() => { setIllustrationName(name); setCompositionNotice(''); setSlots(current => ({ ...current, illustration: true })); }}>
        <EmptyStateIllustration name={name} size={64} />
        <span>{emptyStateIllustrations[name].label}</span>
      </button>)}</div>
      <p className="note" role="status">Selected: {emptyStateIllustrations[illustrationName].label}. Applied to the composition preview above.</p>
      <p className="note">14 unique Figma SVG illustrations. Choosing an illustration also updates its example title, description and action labels.</p>
    </section>

    <h2>Usage &amp; situations</h2>
    <div className="usage">
      <p className="aisee-usage-note"><strong>First use:</strong> explain what is missing and offer an action the user can take. <strong>No results:</strong> describe the filter and offer to clear it. <strong>Waiting for data:</strong> explain the wait; omit the action if there is nothing useful to do. <strong>Limited permissions:</strong> explain access without showing an unusable action.</p>
      <p className="aisee-usage-note">A small panel can use illustration + description, or description alone. Titles are optional where the surrounding section already provides context. Keep loading and request failures in their own status components instead of presenting them as empty data.</p>
      <pre><code>{`<EmptyState
  illustrationName="no-event"
  title="No posts yet"
  description="Create a post to get started."
  action={<Button onClick={onCreate}>Create post</Button>}
/>

<EmptyState description="No activity yet." />`}</code></pre>
      <p><code>illustration</code>, <code>title</code>, <code>description</code> and <code>action</code> accept React content independently. <code>size</code> sets default or compact typography; <code>variant</code> sets plain or inset surfaces. <code>titleAs</code> controls heading level. Parent layouts own page centering and height.</p>
      <p>Use <code>illustrationName</code> for built-in artwork, or pass <code>illustration</code> for custom content. An explicit custom slot takes priority; <code>illustration=null</code> hides even a selected built-in illustration. <code>EmptyStateIllustration</code> also works independently with configurable size and alt text.</p>
      <p>Use existing Button components for actions, including their disabled state. Empty State never invents an action or triggers one itself. Decorative illustrations use empty alt text; meaningful illustrations should provide descriptive alt text.</p>
      <p>Default: 48px illustration, 18px / 600 title, 14px / 22px description. Compact: 14px title, 12px / 18px description. Inset: 42.5px illustration, 40px vertical padding, dashed outline and warm surface.</p>
    </div>
  </main>;
}

createRoot(document.getElementById('empty-state-demo')!).render(<App />);
