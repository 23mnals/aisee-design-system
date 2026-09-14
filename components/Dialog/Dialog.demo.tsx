import { useRef, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from '../../src/components/Button';
import { Checkbox } from '../../src/components/Checkbox';
import {
  Dialog,
  DialogDetailRow,
  DialogDetails,
  DialogNotice,
  DialogSummary,
  type DialogProps,
} from '../../src/components/Dialog';
import { EmptyStateIllustration } from '../../src/components/EmptyStateIllustration';
import { Input } from '../../src/components/Input';
import { Toast, ToastViewport } from '../../src/components/Toast';
import '../../src/tokens/tokens.css';
import '../../src/styles/base.css';
import '../../src/styles/components.css';
import './Dialog.demo.css';

type Scenario = 'create' | 'details' | 'stopped' | 'choice' | 'upgrade' | 'credits' | 'split';

const scenarios: Array<{ id: Scenario; title: string; structure: string; example: string }> = [
  { id: 'create', title: 'Short form', structure: 'Standard · Form', example: 'Create, edit, input a URL' },
  { id: 'details', title: 'Actionable details', structure: 'Standard · Details', example: 'Tracking management' },
  { id: 'stopped', title: 'Read-only details', structure: 'Standard · Notice + details', example: 'Stopped or unavailable state' },
  { id: 'choice', title: 'Choice workflow', structure: 'Standard · Selection', example: 'Choose a tracking method' },
  { id: 'upgrade', title: 'Feature gate', structure: 'Centered · Decision', example: 'Limit reached, upgrade' },
  { id: 'credits', title: 'Insufficient balance', structure: 'Centered · Summary', example: 'Top up or use free mode' },
  { id: 'split', title: 'Multi-section editor', structure: 'Split · Form', example: 'Complex settings and editing' },
];

function App() {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [url, setUrl] = useState('');
  const [hosted, setHosted] = useState(true);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('Action completed');
  const inputRef = useRef<HTMLInputElement>(null);
  const close = () => setScenario(null);
  const open = (next: Scenario) => {
    setScenario(next);
    if (next === 'create' || next === 'split') requestAnimationFrame(() => inputRef.current?.focus());
  };
  const finish = (message = 'Changes saved') => {
    close();
    setToastOpen(false);
    requestAnimationFrame(() => {
      setToastMessage(message);
      setToastOpen(true);
    });
  };

  const common: Pick<DialogProps, 'open' | 'onClose'> = { open: scenario !== null, onClose: close };
  let activeDialog: ReactNode = null;

  if (scenario === 'create') activeDialog = <Dialog
    {...common}
    title="Create analysis"
    description="Add the website you want aisee to analyze."
    onClick={event => { if (event.target === event.currentTarget) close(); }}
    footer={<><Button variant="secondary" onClick={close}>Cancel</Button><Button onClick={() => finish('Analysis created')}>Confirm</Button></>}
  >
    <Input ref={inputRef} label="Website URL" type="url" placeholder="https://example.com" value={url} onChange={event => setUrl(event.target.value)} />
  </Dialog>;

  if (scenario === 'details') activeDialog = <Dialog
    {...common}
    size="sm"
    headingSize="sm"
    title="Tracking details"
    footerLayout="stacked"
    footer={<><Button variant="secondary" onClick={() => finish('Tracking mode changed')}>Switch to extension tracking · Free</Button><Button variant="danger" onClick={close}>Stop hosted tracking</Button></>}
  >
    <DialogDetails>
      <DialogDetailRow label="Method" value="Hosted" />
      <DialogDetailRow label="Started" value="2025-05-20 14:30" />
      <DialogDetailRow label="Frequency" value="Smart · auto-adjusts" />
      <DialogDetailRow label="Spent today" value="5 Credits" />
      <DialogDetailRow label="Total spent · 3 days" value="15 Credits" />
    </DialogDetails>
  </Dialog>;

  if (scenario === 'stopped') activeDialog = <Dialog
    {...common}
    size="sm"
    headingSize="sm"
    title="Tracking details"
    notice={<DialogNotice tone="danger">Tracking stopped. Existing data remains available in read-only mode.</DialogNotice>}
  >
    <DialogDetails>
      <DialogDetailRow label="Method" value="Hosted (stopped)" />
      <DialogDetailRow label="Started" value="2025-05-20 14:30" />
      <DialogDetailRow label="Collected data" value="Kept · read-only" />
      <DialogDetailRow label="Stop reason" value="Original post deleted" valueTone="danger" />
      <DialogDetailRow label="Total spent · 3 days" value="15 Credits" />
    </DialogDetails>
  </Dialog>;

  if (scenario === 'choice') activeDialog = <Dialog
    {...common}
    size="sm"
    headingSize="sm"
    title="Track this reply"
    description="Choose how aisee follows this reply's performance."
    footerLayout="split"
    footer={<><Button variant="secondary" onClick={close}>Cancel</Button><Button variant="dark" onClick={() => finish('Tracking started')}>Start {hosted ? 'hosted' : 'extension'} tracking</Button></>}
  >
    <div className="dialog-demo-choices">
      <div className={`dialog-demo-choice${!hosted ? ' is-selected' : ''}`} onClick={() => setHosted(false)}>
        <Checkbox checked={!hosted} onChange={() => setHosted(false)} label="Extension tracking" />
        <span>Free · refreshes when the browser extension opens the page.</span>
      </div>
      <div className={`dialog-demo-choice${hosted ? ' is-selected' : ''}`} onClick={() => setHosted(true)}>
        <Checkbox checked={hosted} onChange={() => setHosted(true)} label="Hosted tracking · Recommended" />
        <span>24/7 cloud monitoring · 5 Credits per reply / day.</span>
      </div>
      <DialogSummary><strong>Estimated cost (next 7 days)</strong><span>14 Credits</span></DialogSummary>
    </div>
  </Dialog>;

  if (scenario === 'upgrade') activeDialog = <Dialog
    {...common}
    layout="centered"
    title="You've reached your Starter limits"
    description={<>Upgrade to track more <strong>keywords</strong>, unlock <strong>priority accounts &amp; Subreddits</strong>, and scan faster.</>}
    illustration={<EmptyStateIllustration name="unlock" size={64} />}
    closeable={false}
    footerLayout="split"
    footer={<><Button variant="secondary" onClick={close}>Maybe later</Button><Button className="dialog-demo-button--post" onClick={() => finish('Upgrade selected')}>Upgrade Plan</Button></>}
  >
    <DialogSummary>
      <DialogDetailRow label="Current plan" value="Starter" valueTone="muted" />
      <DialogDetailRow label="Generate replies" value="10 / 10" />
    </DialogSummary>
  </Dialog>;

  if (scenario === 'credits') activeDialog = <Dialog
    {...common}
    layout="centered"
    title="Not enough credits"
    description="This reply will cost ~14 Credits over the next 7 days — more than your current balance."
    illustration={<EmptyStateIllustration name="no-credit" size={64} />}
    footerLayout="stacked"
    footer={<><Button variant="secondary" onClick={() => finish('Extension tracking selected')}>Use extension tracking · Free</Button><Button variant="dark" onClick={() => finish('Top up selected')}>Top up credits</Button></>}
  >
    <DialogSummary>
      <DialogDetailRow label="Est. spend · 7d" value="~14 credits" />
      <DialogDetailRow label="Current balance" value="6 credits" valueTone="muted" />
    </DialogSummary>
  </Dialog>;

  if (scenario === 'split') activeDialog = <Dialog
    {...common}
    layout="split"
    size="lg"
    title="Edit tracking rule"
    description="Use split layout only when one task has several local sections."
    sidebar={<nav className="dialog-demo-sidebar"><button className="is-current">Basics</button><button>Schedule</button><button>Notifications</button></nav>}
    footer={<><Button variant="secondary" onClick={close}>Cancel</Button><Button onClick={() => finish('Tracking rule saved')}>Save changes</Button></>}
  >
    <div className="dialog-demo-form">
      <Input ref={inputRef} label="Rule name" defaultValue="Priority reply tracking" />
      <Input label="Source URL" placeholder="https://example.com/post" />
    </div>
  </Dialog>;

  return <main>
    <h1>Dialog</h1>
    <p className="intro">Classify dialogs by reusable structure, then map product functions onto those structures.</p>

    <h2 className="aisee-content-heading">Classification <span className="aisee-content-new" aria-label="New or updated content">NEW</span></h2>
    <section className="dialog-demo-taxonomy">
      <article><strong>1 · Shell</strong><span>Standard · Centered · Split</span></article>
      <article><strong>2 · Content</strong><span>Form · Choice · Details · Summary</span></article>
      <article><strong>3 · Intent</strong><span>Create · Edit · Upgrade · Manage</span></article>
    </section>
    <p className="dialog-demo-guidance">Use structure for the component API. Function names belong to examples and product copy. Destructive yes/no decisions continue to use Confirmation Dialog.</p>

    <h2 className="aisee-content-heading">Interactive patterns <span className="aisee-content-new" aria-label="New or updated content">NEW</span></h2>
    <section className="dialog-demo-grid">
      {scenarios.map(item => <article className="dialog-demo-card" key={item.id}>
        <div><strong>{item.title}</strong><span>{item.structure}</span><small>{item.example}</small></div>
        <Button size="sm" variant="secondary" onClick={() => open(item.id)}>Open</Button>
      </article>)}
    </section>

    <h2 className="aisee-content-heading">Selection rule <span className="aisee-content-new" aria-label="New or updated content">NEW</span></h2>
    <section className="dialog-demo-spec">
      <p><strong>Standard</strong> for short forms, choices and details. <strong>Centered</strong> for a single decision with illustration and summary. <strong>Split</strong> only for a bounded multi-section task; use a page or drawer when navigation is persistent or the work is long.</p>
      <p>Optional illustration, notice, sidebar, close control and footer compose independently. Footer supports inline, split and stacked actions.</p>
    </section>

    {activeDialog}
    <ToastViewport><Toast open={toastOpen} duration={5000} onDismiss={() => setToastOpen(false)}>{toastMessage}</Toast></ToastViewport>
  </main>;
}

createRoot(document.getElementById('dialog-demo')!).render(<App />);
