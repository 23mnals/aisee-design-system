import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Steps, type StepItem, type ThinkingStepItem } from '../../src/components/Steps';
import { TutorialSteps } from '../../src/components/TutorialSteps';
import { Button } from '../../src/components/Button';
import '../../src/tokens/tokens.css';
import '../../src/styles/base.css';
import '../../src/styles/components.css';
import './Steps.demo.css';
import reportIcon from '../../assets/steps/report.svg';
import growthIcon from '../../assets/steps/growth.svg';
import planIcon from '../../assets/steps/plan.svg';
import thinkingImage from '../../assets/steps/thinking.png';

import eyeWhite from '../../assets/tutorial-steps/eye-white.svg';
import eyeIris from '../../assets/tutorial-steps/eye-iris.svg';
import eyePupil from '../../assets/tutorial-steps/eye-pupil.svg';
import scanIcon from '../../assets/tutorial-steps/scan.svg';
import replyIcon from '../../assets/tutorial-steps/reply.svg';

function TutorialEye() {
  return <span className="tutorial-eye tutorial-eye--animated"><span className="tutorial-eye__shape"><img className="tutorial-eye__white" src={eyeWhite} alt="" /><img className="tutorial-eye__iris" src={eyeIris} alt="" /><img className="tutorial-eye__pupil" src={eyePupil} alt="" /></span></span>;
}
const tutorialItems = [
  { id: 'watch', title: 'Add what to watch', description: 'Topics, people or communities', icon: <TutorialEye /> },
  { id: 'scan', title: 'Scans X + Reddit', description: 'A fresh sweep every 24 hours', iconSrc: scanIcon },
  { id: 'reply', title: 'Reply from your feed', description: 'Matches collect in the Signal Feed', iconSrc: replyIcon },
];

const route: StepItem[] = [
  { id: 'brand', label: 'Brand Detection', status: 'complete' },
  { id: 'report', label: 'Report', iconSrc: reportIcon, status: 'pending' },
  { id: 'growth', label: 'Growth tasks', iconSrc: growthIcon, status: 'pending' },
  { id: 'plan', label: '30-day plan', iconSrc: planIcon, status: 'pending' },
];
const initialThinking: ThinkingStepItem[] = [
  { id: 'anthropic-test', content: <>Testing <strong>anthropic</strong> (claude-sonnet-4-6) — name, industry &amp; citation recognition</>, status: 'complete' },
  { id: 'anthropic-result', content: <>✓ <strong>anthropic</strong>: score 0 · coverage 0% · not recognized</>, status: 'active' },
  { id: 'google-test', content: <>Testing <strong>google</strong> (gemini-3-flash-preview)</>, status: 'pending' },
  { id: 'google-result', content: <>✓ <strong>google</strong>: score 100 · coverage 100%</>, status: 'pending' },
  { id: 'scoring', content: 'Scoring visibility, sentiment & ranking per engine', status: 'pending' },
];

function App() {
  const [basicStage, setBasicStage] = useState(-1);
  const [thinking, setThinking] = useState(initialThinking);
  const [animated, setAnimated] = useState(true);
  const activeIndex = thinking.findIndex(item => item.status === 'active');
  const errorIndex = thinking.findIndex(item => item.status === 'error');
  const complete = thinking.every(item => item.status === 'complete');
  const basicItems = route.map((item, index): StepItem => ({ ...item, status: basicStage < 0 ? 'pending' : index < Math.floor(basicStage / 2) || (index === Math.floor(basicStage / 2) && basicStage % 2 === 1) ? 'complete' : index === Math.floor(basicStage / 2) ? 'active' : 'pending' }));
  const thinkingRoute = route.map((item, index): StepItem => index === 0
    ? { ...item, label: 'Brand analysis', status: complete ? 'complete' : errorIndex >= 0 ? 'error' : 'active' }
    : { ...item, status: 'pending' });

  function advance() {
    if (activeIndex < 0) return;
    const nextIndex = thinking.findIndex((item, index) => index > activeIndex && item.status === 'pending');
    setThinking(items => items.map((item, index) => ({ ...item, status: index === activeIndex ? 'complete' : index === nextIndex ? 'active' : item.status })));
  }

  return <main>
    <h1>Steps</h1>
    <p className="intro">Show progress through a workflow, with optional thinking activity for longer tasks.</p>

    <h2 className="aisee-content-heading">Static workflow <span className="aisee-content-new">NEW</span></h2>
    <section className="specimen" aria-label="Static workflow example">
      <Steps items={route} mode="static" stepsLabel="Workflow overview" />
    </section>
    <p className="aisee-usage-note">Explain the sequence only. No task status, progress controls or blinking.</p>

    <h2 className="aisee-content-heading">Animated progress <span className="aisee-content-new">NEW</span></h2>
    <section className="specimen" aria-label="Animated progress example">
      <Steps items={basicItems} mode="progress" stepsLabel="Workflow progress" />
      <div className="demo-controls">
        <Button size="sm" variant="secondary" onClick={() => setBasicStage(index => index + 1)} disabled={basicStage === route.length * 2 - 1}>{basicStage < 0 ? 'Start first step' : basicStage % 2 === 0 ? 'Complete current step' : basicStage === route.length * 2 - 1 ? 'All steps complete' : 'Start next step'}</Button>
        <Button size="sm" variant="ghost" onClick={() => setBasicStage(-1)}>Restart</Button>
      </div>
      <p className="note" role="status">{basicStage < 0 ? 'Initial state — all steps are waiting.' : basicStage % 2 === 0 ? `Step ${Math.floor(basicStage / 2) + 1} is in progress.` : `Step ${Math.floor(basicStage / 2) + 1} is complete.`}</p>
    </section>
    <p className="aisee-usage-note">Every step passes through Waiting → In progress → Completed. Only In progress blinks. Scroll horizontally to view long workflows.</p>

    <h2 className="aisee-content-heading">Feature tutorial <span className="aisee-content-new">NEW</span></h2>
    <section className="specimen" aria-label="Feature tutorial example">
      <TutorialSteps items={tutorialItems} aria-label="Signal Feed tutorial" />
    </section>
    <p className="aisee-usage-note">Introduce a new feature using an icon, title and optional description per step. Automatically stacks in narrow containers.</p>

    <h2 className="aisee-content-heading">Thinking steps <span className="aisee-content-new">NEW</span></h2>
    <section className="specimen specimen--thinking" aria-label="Thinking steps example">
      <Steps
        items={thinkingRoute}
        thinkingSteps={thinking}
        title={complete ? 'Brand analysis complete' : errorIndex >= 0 ? 'Analysis needs attention' : 'Analyzing your brand...'}
        description={complete ? 'The analysis is ready for the next step.' : errorIndex >= 0 ? 'Retry the failed step to continue.' : "This takes about a minute. Your report opens the moment it’s ready."}
        illustration={<img width="78" height="56" src={thinkingImage} alt="" />}
        animated={animated}
      />
      <div className="demo-controls">
        <Button size="sm" variant="secondary" onClick={advance} disabled={activeIndex < 0}>Next step</Button>
        <Button size="sm" variant="secondary" disabled={complete} onClick={() => setThinking(items => items.map((item, index) => ({ ...item, status: index === (errorIndex >= 0 ? errorIndex : activeIndex) ? errorIndex >= 0 ? 'active' : 'error' : item.status })))}>{errorIndex >= 0 ? 'Retry step' : 'Fail step'}</Button>
        <Button size="sm" variant="ghost" onClick={() => { setThinking(initialThinking); setAnimated(true); }}>Restart</Button>
        <label className="animation-control"><input type="checkbox" checked={animated} onChange={event => setAnimated(event.target.checked)} /> Animate active step</label>
      </div>
    </section>
    <p className="aisee-usage-note">Demo data only. Use the controls to advance, fail or retry a step; no analysis request is sent.</p>

    <h2>Usage</h2>
    <div className="usage">
      <p>Use mode="static" for an overview, or mode="progress" for task states. Provide any number of steps with stable IDs, labels and optional icons. Add <code>thinkingSteps</code> for the activity panel.</p>
      <pre><code>{`<Steps
  items={steps}
  thinkingSteps={activity}
  title="Analyzing your brand..."
  description="Your report opens when it is ready."
  animated
/>`}</code></pre>
      <p>Set each status to <code>pending</code>, <code>active</code>, <code>complete</code> or <code>error</code>. Task logic stays in the calling app; this component has no timers or network requests.</p>
    </div>
    <h2>Tutorial usage</h2>
    <div className="usage"><pre><code>{`<TutorialSteps
  items={[{ id: 'watch', title: 'Add what to watch',
    description: 'Topics, people or communities', icon: <FeatureIcon /> }]}
  orientation="auto"
/>`}</code></pre><p>For feature introductions, setup instructions and onboarding. Each item accepts an icon, title, optional description and optional action. Without an icon, a step number is shown. The host app controls whether the tutorial is visible and where actions navigate.</p><p>Figma: 36px icon tile / 22px icon · title Karla 14/600/22 · description 12/400/14 · 16px border radius. The first eye keeps the original 2-second blink/look motion; reduced motion disables it.</p><p><a href="https://www.figma.com/design/LLvI9vd66VLNuAltAWJFJw/?node-id=38-83251" target="_blank" rel="noreferrer">Feature tutorial in Figma</a></p></div>
    <h2>Specs &amp; behavior</h2>
    <div className="usage">
      <p>32px step pills · 22px icon tiles · Karla 16px / 500 · 8px corner radius. Thinking rows use Karla 14px / 22px inside a 12px rounded panel.</p>
      <p>Only the active step pulses: 1.6 seconds, 100% → 45% → 100% opacity. Its loading icon rotates smoothly. Completed, waiting and failed steps remain still. Reduced motion or <code>animated=false</code> turns both animations off.</p>
      <p>Progress uses ordered list semantics and <code>aria-current="step"</code>. Thinking updates are announced politely; status labels can be translated with <code>statusLabels</code>.</p>
      <p><a href="https://www.figma.com/design/LLvI9vd66VLNuAltAWJFJw/?node-id=75-26072" target="_blank" rel="noreferrer">Basic steps in Figma</a> · <a href="https://www.figma.com/design/LLvI9vd66VLNuAltAWJFJw/?node-id=38-42672" target="_blank" rel="noreferrer">Thinking steps in Figma</a></p>
    </div>
  </main>;
}

createRoot(document.getElementById('steps-demo')!).render(<App />);
