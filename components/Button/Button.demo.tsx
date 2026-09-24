import { useState, type CSSProperties } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from '../../src/components/Button';
import { Toggle } from '../../src/components/Toggle';
import generateIcon from '../../assets/button/generate.svg';
import executeIcon from '../../assets/button/go-execute.svg';
import viewIcon from '../../assets/button/view-post.svg';
import scheduleIcon from '../../assets/button/bulk-schedule.svg';
import plusIcon from '../../assets/stemui/action-plus.svg';
import searchIcon from '../../assets/dropdown/search.svg';
import '../../src/tokens/tokens.css';
import '../../src/styles/base.css';
import '../../src/styles/components.css';
import './Button.demo.css';

function DemoIcon({ source, kind = '' }: { source: string; kind?: string }) {
  return <span className={`button-demo-icon button-demo-icon--${kind}`} style={{ '--button-icon': `url("${source}")` } as CSSProperties} />;
}

function App() {
  const [showIcon, setShowIcon] = useState(true);
  const [iconPosition, setIconPosition] = useState<'left' | 'right'>('left');
  const examples = [
    { label: 'Generate Post', icon: generateIcon, variant: 'dark', kind: 'generate' },
    { label: 'Go execute', icon: executeIcon, variant: 'dark', kind: 'forward' },
    { label: 'View replies', icon: executeIcon, variant: 'dark', kind: 'forward' },
    { label: 'View Post', icon: viewIcon, variant: 'secondary', kind: 'view' },
    { label: 'Bulk schedule', icon: scheduleIcon, variant: 'secondary', kind: 'schedule' },
  ] as const;
  return <main data-aisee-config={JSON.stringify([{scope:'Icon variants',component:'Button',props:{showIcon,...(showIcon?{iconPosition}:{})}}])}>
    <h1>Button</h1>
    <p className="intro">Current action variants with the shared two-sided hover and keyboard-focus motion.</p>
    <h2>Recommended · primary actions</h2>
    <section className="button-demo-panel button-demo-row" aria-label="Primary Button examples">
      <Button>Run analysis</Button>
      <span data-aisee-theme="post-agent"><Button>Publish post</Button></span>
      <Button variant="dark">Dark · Analysis</Button>
      <Button variant="dark" data-aisee-theme="post-agent">Dark · Post</Button>
    </section>
    <p className="button-demo-note">Primary uses the current module fill and moves to black. Dark moves to Analysis lime, or Publishing yellow inside a Post context.</p>
    <h2>Other current variants</h2>
    <section className="button-demo-panel button-demo-row" aria-label="Other Button examples">
      <Button variant="secondary">Secondary</Button><Button variant="ghost">Ghost</Button><Button variant="danger">Delete</Button>
    </section>
    <p className="button-demo-note">Secondary uses a 4% #111 hover overlay and keeps its existing border. Ghost and filled borderless variants do not reveal a border. Danger adds a 4% #111 overlay to its red fill.</p>
    <div className="button-demo-section-heading">
      <h2 id="icon-variants-title">Icon variants <span className="aisee-content-new" data-updated-at="2026-09-17">NEW</span></h2>
      <div className="button-demo-controls">
        <Toggle label="Show icon" checked={showIcon} onChange={event => setShowIcon(event.target.checked)} />
        <fieldset className="button-demo-position" aria-label="Icon position" disabled={!showIcon}>
          {(['left', 'right'] as const).map(position => <label className="aisee-checkbox" key={position}>
            <input className="aisee-sr-only" type="radio" name="icon-position" value={position} checked={iconPosition === position} onChange={() => setIconPosition(position)} />
            <span className="aisee-checkbox__control" aria-hidden="true" />
            <span>{position === 'left' ? 'Left' : 'Right'}</span>
          </label>)}
        </fieldset>
      </div>
    </div>
    <section className="button-demo-panel button-demo-row" aria-labelledby="icon-variants-title" data-aisee-theme="post-agent">
      {examples.map(example => <Button key={example.label} variant={example.variant} showIcon={showIcon} iconPosition={iconPosition} icon={example.kind === 'schedule' ? <img src={example.icon} alt="" /> : <DemoIcon source={example.icon} kind={example.kind} />}>{example.label}</Button>)}
    </section>
    <h2>States</h2>
    <section className="button-demo-panel button-demo-row" aria-label="Button sizes">
      <Button size="sm">Small</Button>
      <Button variant="secondary">Default</Button>
      <Button size="lg">Large</Button>
    </section>
    <h2>With icon</h2>
    <section className="button-demo-panel button-demo-row" aria-label="With icon examples">
      <Button icon={<DemoIcon source={plusIcon} />}>Create</Button>
      <Button variant="dark" icon={<DemoIcon source={executeIcon} kind="forward" />} iconPosition="right">Next</Button>
      <Button variant="secondary" leadingIcon={<DemoIcon source={searchIcon} />} trailingIcon={<DemoIcon source={executeIcon} kind="forward" />}>Search</Button>
    </section>
    <h2>Disabled</h2>
    <section className="button-demo-panel button-demo-row" aria-label="Disabled button variants">
      <Button disabled>Analysis</Button>
      <Button disabled data-aisee-theme="post-agent">Post</Button>
      <Button variant="dark" disabled>Dark</Button>
      <Button variant="secondary" disabled>Secondary</Button>
      <Button variant="ghost" disabled>Ghost</Button>
      <Button variant="danger" disabled>Delete</Button>
    </section>
    <h2>Usage</h2>
    <section className="button-demo-usage"><p>Import <code>Button</code> and the package stylesheet. The component supplies its structure, states and animation; product code supplies the label, handler, variant and module context.</p><pre><code>{`import { Button } from '@aisee/design-system';
import '@aisee/design-system/styles.css';

<Button variant="dark" icon={<GenerateIcon />} iconPosition="right"
  showIcon={showIcon}>Generate Post</Button>
<Button variant="secondary" icon={<ViewIcon />}>View Post</Button>
<Button leadingIcon={<SearchIcon />} trailingIcon={<ArrowIcon />}>Search</Button>
<Button showIcon={false}>Run analysis</Button>`}</code></pre><p>Pass a decorative SVG using currentColor, or a CSS mask, so the icon follows the button's hover and focus colors. Actions lead; forward arrows and AI-generation sparkles trail by convention. Use leadingIcon and trailingIcon together when both an action and a direction are needed. The single icon prop takes precedence over those slots; showIcon hides all icons without leaving space.</p></section>
  </main>;
}

createRoot(document.getElementById('button-demo')!).render(<App />);
