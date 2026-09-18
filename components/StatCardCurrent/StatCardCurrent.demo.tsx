import { createRoot } from 'react-dom/client';
import { StatCard, StatCardGroup } from '../../src/components/StatCard';
import '../../src/tokens/tokens.css';
import '../../src/styles/base.css';
import '../../src/styles/components.css';
import './StatCardCurrent.demo.css';

function App() {
  return <main>
    <h1>Stat Card — Current</h1>
    <p className="intro">Compact overview metrics aligned to the shared Figma card structure.</p>
    <h2>Overview group <span className="aisee-content-new">NEW</span></h2>
    <StatCardGroup title="Overview">
      <StatCard value="66.2" badge="— baseline" label="AI visibility" />
      <StatCard value="4 / 20" label="Score tasks completed" />
      <StatCard value="1 / 32" label="Brand influence tasks completed" />
      <StatCard value="1600" label="Available credits" />
    </StatCardGroup>
    <h2>Compact information strip <span className="aisee-content-new">NEW</span></h2>
    <StatCardGroup variant="compact" aria-label="Workspace limits">
      <StatCard value="30" label="Tracked keywords" />
      <StatCard value="20" label="Accounts per platform" />
      <StatCard value="24h" label="Scan frequency" />
    </StatCardGroup>
    <h2>Optional metadata</h2>
    <section className="stat-demo-grid">
      <StatCard value="74.5" label="7-day goal" delta="+8.3" deltaTone="positive" helper="from current score" />
      <StatCard value="12" unit="posts" label="Scheduled this week" helper="Across three channels" />
    </section>
    <h2>Usage</h2>
    <section className="stat-demo-note">Use <code>StatCardGroup</code> for an overview set. The metric is the strongest content, the label stays on one line with an ellipsis, and the baseline badge is optional.</section>
  </main>;
}

createRoot(document.getElementById('stat-card-demo')!).render(<App />);
