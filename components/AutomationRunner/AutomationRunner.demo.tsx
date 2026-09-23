import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AutomationRunner, type AutomationRunnerPlacement, type AutomationRunnerView } from '../../src/components/AutomationRunner';
import { Dropdown } from '../../src/components/Dropdown';
import { Toggle } from '../../src/components/Toggle';
import '../../src/tokens/tokens.css';
import '../../src/styles/base.css';
import '../../src/styles/components.css';
import './AutomationRunner.demo.css';

const details = [
  { id: 'publishing', label: 'Scheduled publishing', value: 'On' },
  { id: 'replies', label: 'Managed replies', value: 'Off', muted: true },
  { id: 'last-action', label: 'Last action', value: 'Just now' },
  { id: 'keep-open', label: 'Keep-open', value: '1 AISEE tab required' },
];
const pages = ['Overview', 'Schedule', 'Replies'];

function App() {
  const [open, setOpen] = useState(true);
  const [view, setView] = useState<AutomationRunnerView>('default');
  const [placement, setPlacement] = useState<AutomationRunnerPlacement>('bottom-right');
  const [page, setPage] = useState('Overview');
  return <main data-aisee-config={JSON.stringify([{scope:'Persistent runner',component:'AutomationRunner',props:{defaultView:view,placement}}])}>
    <h1>Automation Runner</h1>
    <p className="intro">A persistent automation status window that survives route changes when mounted in the app shell. It expands for details, minimizes to the animated eye and can be dragged anywhere in the viewport.</p>
    <div className="runner-demo__heading"><h2>Interactive preview <span className="aisee-content-new">NEW</span></h2><div className="runner-demo__controls">
      <Toggle label="Show runner" checked={open} onChange={event => setOpen(event.target.checked)} />
      <Dropdown ariaLabel="Runner view" items={[{id:'default',label:'Default'},{id:'expanded',label:'Expanded'},{id:'minimized',label:'Minimized'}]} value={view} onValueChange={value => setView(value as AutomationRunnerView)} />
      <Dropdown ariaLabel="Runner placement" items={[{id:'bottom-right',label:'Right'},{id:'bottom-center',label:'Center'},{id:'bottom-left',label:'Left'}]} value={placement} onValueChange={value => setPlacement(value as AutomationRunnerPlacement)} />
    </div></div>
    <section className="runner-demo__app" aria-label="App shell persistence preview">
      <nav aria-label="Demo page switching">
        <span className="runner-demo__route-label">Demo pages · runner stays visible</span>
        <div className="runner-demo__route-tabs">{pages.map(item => <button key={item} className={page === item ? 'is-active' : ''} type="button" onClick={() => setPage(item)}>{item}</button>)}</div>
      </nav>
      <div className="runner-demo__page"><span>Current route</span><strong>{page}</strong><p>Switch routes above. The runner stays mounted because it belongs to the app shell, outside route content.</p></div>
    </section>
    <p className="note">Turn on Show runner to launch it from the bottom. Use the card title or arrow to expand, the line to minimize and click anywhere on the minimized card to restore. Hover the card for a pointer-following curious lean and a wide-eyed two-pass panic scan; enter the green mascot to play one jelly rebound. The eye blinks and follows the pointer. Closing hides only this window; turn Show runner on again to restore it.</p>
    <h2>Integration</h2>
    <section className="runner-demo__usage"><pre><code>{`// Mount once in your root layout, outside route content.
<AutomationRunner
  open={runnerVisible}
  view={runnerView}
  details={automationStatusRows}
  onOpenChange={setRunnerVisible}
  onViewChange={setRunnerView}
  onAction={() => navigate('/automation')}
/>

// The automation task remains owned by your data layer.
// Closing this window must not stop the running task.`}</code></pre>
      <p>Feed title, description and detail rows from real automation state. Store visibility and view state in the app shell if they should survive navigation or reloads. The component does not start, stop or poll an automation.</p>
      <p>Pointer dragging is optional and the drag handle also supports arrow keys. Reduced motion removes the entrance, exit, blink, panic scan, directional lean and jelly rebound while preserving the wide-eye hover feedback, every state and every control.</p>
    </section>
    <AutomationRunner open={open} view={view} placement={placement} details={details} onOpenChange={setOpen} onViewChange={setView} onAction={() => setPage('Schedule')} />
  </main>;
}

createRoot(document.getElementById('automation-runner-demo')!).render(<App />);
