import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ToggleSelectionGroup, resolveToggleSelection, type ToggleSelectionValue } from '../../src/components/ToggleSelectionGroup';
import { Button } from '../../src/components/Button';
import { Dropdown } from '../../src/components/Dropdown';
import '../../src/tokens/tokens.css';
import '../../src/styles/base.css';
import '../../src/styles/components.css';
import '../Steps/Steps.demo.css';
import './ToggleSelectionGroup.demo.css';
import googleIcon from '../../assets/toggle-selection-group/google.svg';
import historyIcon from '../../assets/toggle-selection-group/history.svg';

const models = [
  { id: 'pro-15', label: 'Gemini 1.5 Pro' },
  { id: 'flash-15', label: 'Gemini 1.5 Flash' },
  { id: 'pro-10', label: 'Gemini 1.0 Pro' },
  { id: 'ultra-10', label: 'Gemini 1.0 Ultra' },
];
const scenarios = [
  { id: 'models', label: 'AI model analysis', group: 'google', options: models, usage: 'Enable a provider, then choose its models. A paused provider keeps the last model selection.', scope: 'Only enabled providers and selected available models enter the next analysis request.' },
  { id: 'sources', label: 'Content sources', group: 'Social sources', options: [{ id: 'x', label: 'X' }, { id: 'reddit', label: 'Reddit' }, { id: 'youtube', label: 'YouTube' }], usage: 'Pause a collection group without rebuilding the source selection.', scope: 'Turning the group back on restores the same source scope.' },
  { id: 'monitoring', label: 'Monitoring events', group: 'Brand monitoring', options: [{ id: 'mention', label: 'Mentions' }, { id: 'competitor', label: 'Competitors' }, { id: 'citation', label: 'Citations' }], usage: 'Enable monitoring and narrow down the event types.', scope: 'Closing the group pauses monitoring; selected event types remain saved.' },
  { id: 'reports', label: 'Report sections', group: 'Include insights', options: [{ id: 'visibility', label: 'Visibility' }, { id: 'sentiment', label: 'Sentiment' }, { id: 'ranking', label: 'Ranking' }], usage: 'Include or omit an entire report block while keeping its section choices.', scope: 'Generate the selected sections only when the block is enabled.' },
  { id: 'notifications', label: 'Notification categories', group: 'Email notifications', options: [{ id: 'report', label: 'Reports ready' }, { id: 'failure', label: 'Task failures' }, { id: 'weekly', label: 'Weekly summaries' }], usage: 'Mute one notification channel without erasing its categories.', scope: 'The app must separately save preferences; the component sends no notifications.' },
  { id: 'publishing', label: 'Publishing targets', group: 'Publish to channels', options: [{ id: 'x', label: 'X account' }, { id: 'linkedin', label: 'LinkedIn page' }, { id: 'reddit', label: 'Reddit community' }], usage: 'Choose the targets for a publishing group, then temporarily exclude that group.', scope: 'Selection does not publish. The application submits only enabled, selected targets.' },
  { id: 'export', label: 'Export field groups', group: 'Include performance data', options: [{ id: 'reach', label: 'Reach' }, { id: 'engagement', label: 'Engagement' }, { id: 'clicks', label: 'Clicks' }], usage: 'Switch a field group on or off without losing a custom export setup.', scope: 'Hidden or unavailable fields are never added to the active export automatically.' },
  { id: 'schedule', label: 'Schedule windows', group: 'Weekly availability', options: [{ id: 'morning', label: 'Morning' }, { id: 'afternoon', label: 'Afternoon' }, { id: 'evening', label: 'Evening' }], usage: 'Pause a schedule while retaining the allowed time windows.', scope: 'Resume with the last selected windows. Actual dates and scheduling stay in the application.' },
];

function App() {
  const [value, setValue] = useState<ToggleSelectionValue>({ enabled: false });
  const [scenarioId, setScenarioId] = useState('sources');
  const scenario = scenarios.find(item => item.id === scenarioId)!;
  const state = resolveToggleSelection(models, value);
  return <main>
    <h1>Toggle Selection Group</h1>
    <p className="intro">Enable a group, select its options, and pause it without losing your selection.</p>
    <h2 className="aisee-content-heading">Enable &amp; remember <span className="aisee-content-new">NEW</span></h2>
    <section aria-label="Selection memory example">
      <ToggleSelectionGroup label="google" options={models} value={value} onChange={setValue} icon={<img src={googleIcon} alt="" />} metadata={<><img src={historyIcon} alt="" />Last scan: 1 model</>} />
      <div className="selection-summary" aria-live="polite">
        <p><strong>Saved selection:</strong> {state.visibleSelectedIds.map(id => models.find(item => item.id === id)!.label).join(', ') || 'None'}</p>
        <p><strong>Active scope:</strong> {state.activeSelectedIds.length ? `${state.activeSelectedIds.length} models` : 'None'}</p>
      </div>
      <div className="demo-controls"><Button size="sm" variant="secondary" onClick={() => setValue({ enabled: false })}>Reset first activation</Button><Button size="sm" variant="secondary" onClick={() => setValue({ enabled: false, selectedIds: ['pro-15', 'flash-15'] })}>Load saved selection</Button></div>
      <p className="aisee-usage-note">Turn on to select all four models. Deselect some, turn off, then on again to verify that the same selection returns.</p>
    </section>
    <h2>Design reference · partial selection</h2>
    <section aria-label="Partial selection example"><ToggleSelectionGroup label="google" options={models} defaultValue={{ enabled: true, selectedIds: ['pro-15', 'flash-15'] }} icon={<img src={googleIcon} alt="" />} metadata={<><img src={historyIcon} alt="" />Last scan: 1 model</>} /><p className="note">The reference shows four model choices; the counter is derived from the real options, so two selected reads 2/4.</p></section>
    <h2>Unavailable options</h2>
    <section aria-label="Unavailable options example"><ToggleSelectionGroup label="Analysis scope" options={[{ id: 'standard', label: 'Standard model' }, { id: 'advanced', label: 'Advanced model', disabled: true, disabledReason: 'Not available for this workspace' }]} defaultValue={{ enabled: true, selectedIds: ['standard'] }} description="The advanced model is unavailable for this workspace. All only changes available options." /></section>
    <h2>Read-only configuration</h2>
    <section aria-label="Read only selection example"><ToggleSelectionGroup label="Saved report configuration" options={models} defaultValue={{ enabled: true, selectedIds: ['flash-15'] }} disabled description="View access only. Saved choices stay visible while editing is disabled." /></section>
    <h2>No options</h2>
    <section><ToggleSelectionGroup label="Connected accounts" options={[]} emptyText="Connect an account before choosing channels." /></section>
    <h2>Usage scenarios</h2>
    <section aria-label="Selection group scenarios">
      <Dropdown label="Scenario" items={scenarios.map(item => ({ id: item.id, label: item.label }))} value={scenarioId} onValueChange={setScenarioId} />
      <div className="scenario-preview"><ToggleSelectionGroup key={scenario.id} label={scenario.group} options={scenario.options} /></div>
      <p className="aisee-usage-note"><strong>Usage:</strong> {scenario.usage} {scenario.scope}</p>
    </section>
    <h2>Behavior &amp; API</h2>
    <div className="usage">
      <p>First activation selects every available option. Turning off disables the options and All, preserving their checks. Turning on again restores the saved selection, including a deliberately empty selection.</p>
      <p>All selects every available option from a partial selection; selecting All again clears them. The mixed checkbox indicates a partial selection. An unavailable option cannot be changed by itself or by All.</p>
      <p>Supply <code>value</code> + <code>onChange</code> for controlled forms, or <code>defaultValue</code> for local state. Leave <code>selectedIds</code> undefined for the first activation; pass <code>[]</code> to restore a saved empty selection.</p>
      <pre><code>{`const [selection, setSelection] = useState({ enabled: false });

<ToggleSelectionGroup
  label="google"
  options={models}
  value={selection}
  onChange={setSelection}
/>

const { activeSelectedIds } = resolveToggleSelection(models, selection);`}</code></pre>
      <p>When off, <code>activeSelectedIds</code> is empty while saved IDs remain intact. Store <code>enabled</code> and <code>selectedIds</code> together in your form or backend if preferences must survive navigation or reload.</p>
      <p>Once choices have been saved, newly added options start unselected. Removed IDs are retained in saved state but excluded from counts and active scope until they return. Duplicate IDs are not supported. An empty option list disables the switch.</p>
      <p>14px group label · 12px option label · 13px equal horizontal padding · 8px radius · 16px checks · shared 24×16px Toggle. Long labels and header metadata wrap without stretching the switch.</p>
      <p><a href="../../docs/TOGGLE_SELECTION_GROUP_SCENARIOS.md">Detailed scenarios and edge cases</a> · <a href="https://www.figma.com/design/tv7gTsQn6OipGVwHG8z0mX/?node-id=9704-256746" target="_blank" rel="noreferrer">Figma reference</a></p>
    </div>
  </main>;
}

createRoot(document.getElementById('toggle-selection-demo')!).render(<App />);
