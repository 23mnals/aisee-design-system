import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfirmationDialog, type ConfirmationDialogNotice } from '../../src/components/ConfirmationDialog';
import { Button } from '../../src/components/Button';
import { Toast, ToastViewport } from '../../src/components/Toast';
import queuedPostsIcon from '../../assets/confirmation-dialog/queued-posts.svg';
import managedRepliesIcon from '../../assets/confirmation-dialog/managed-replies.svg';
import '../../src/tokens/tokens.css';
import '../../src/styles/base.css';
import '../../src/styles/components.css';
import './ConfirmationDialog.demo.css';

// These business examples belong only to this showcase, never to the production delivery.
const notices: ConfirmationDialogNotice[] = [
  { id: 'queue', tone: 'positive', icon: <img src={queuedPostsIcon} style={{width:11,height:11}} alt="" />, title: 'Queued posts will continue publishing', description: '10 posts already in the publishing queue will publish in order at their scheduled times.' },
  { id: 'replies', tone: 'warning', icon: <img src={managedRepliesIcon} style={{width:14,height:14}} alt="" />, title: 'Managed replies will pause', description: 'Aisee will stop checking conversations and publishing new replies until you turn automation back on.' },
];

function App() {
  const [scenario, setScenario] = useState<'basic' | 'impact' | null>(null);
  const [toast, setToast] = useState('');
  const impact = scenario === 'impact';
  return <main className="confirmation-demo aisee-root">
    <h1>Confirmation Dialog</h1>
    <p className="intro">A reusable confirmation for consequential actions. Use a short description, or add impact notices when parts of the workflow behave differently.</p>
    <h2>Impact notices</h2>
    <section className="confirmation-demo__surface">
      <h3>Turn off plan automation?</h3>
      <p>Explain what continues and what pauses before the user confirms.</p>
      <Button variant="secondary" onClick={() => setScenario('impact')}>Preview impact confirmation</Button>
    </section>
    <h2>Simple confirmation</h2>
    <section className="confirmation-demo__surface">
      <h3>Discard unsaved changes?</h3>
      <p>The existing compact confirmation stays available without notice cards.</p>
      <Button variant="secondary" onClick={() => setScenario('basic')}>Preview simple confirmation</Button>
    </section>
    <h2>Usage</h2>
    <section className="confirmation-demo__usage">
      <p>Supply title, description, notices, button labels and callbacks from your product. Each notice accepts a positive or warning tone and an optional icon. Omit notices for the simple version; use children for additional product content.</p>
      <pre><code>{`<ConfirmationDialog\n  open={open}\n  title={confirmationTitle}\n  description={confirmationDescription}\n  notices={impactNotices}\n  cancelLabel="Cancel"\n  confirmLabel="Confirm"\n  confirmVariant="danger"\n  onClose={() => setOpen(false)}\n  onConfirm={handleConfirm}\n/>`}</code></pre>
      <p>Use confirmVariant="primary" for a normal confirmation and confirmDisabled while the host operation is unavailable. The host owns the operation, error handling and closing after success. Completion feedback belongs in a page-level Toast.</p>
      <p>Copy for AI includes the production dialog, Button, required styles and close icon. It excludes these scenarios, sample counts, illustration icons, demo controls and Toast feedback.</p>
    </section>
    <h2>Specs</h2>
    <p className="spec">512px width · 24px padding · 12px between notices · 32px icon tile · 44px actions. Cancel receives initial focus; native modal focus containment, Escape and focus return remain available. Small screens stack the actions; long content scrolls within the viewport.</p>
    <ConfirmationDialog
      open={scenario !== null}
      title={impact ? 'Turn off plan automation?' : 'Discard unsaved changes?'}
      description={impact ? 'Queued posts and managed replies will be handled differently.' : 'Your changes will be lost if you leave this page.'}
      notices={impact ? notices : undefined}
      cancelLabel={impact ? 'Keep automation on' : 'Keep Editing'}
      confirmLabel={impact ? 'Turn off automation' : 'Discard Changes'}
      onClose={() => setScenario(null)}
      onConfirm={() => { setScenario(null); setToast(impact ? 'Automation turned off' : 'Changes discarded'); }}
    />
    <ToastViewport><Toast open={!!toast} onDismiss={() => setToast('')}>{toast}</Toast></ToastViewport>
  </main>;
}
createRoot(document.getElementById('confirmation-dialog-demo')!).render(<App />);
