import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ThinkingIndicator } from '../../src/components/ThinkingIndicator';
import { Dropdown } from '../../src/components/Dropdown';
import { Toggle } from '../../src/components/Toggle';
import '../../src/tokens/tokens.css';
import '../../src/styles/base.css';
import '../../src/styles/components.css';
import './ThinkingIndicator.demo.css';

function App() {
  const [size, setSize] = useState<'default' | 'compact'>('default');
  const [showIcon, setShowIcon] = useState(true);
  return <main data-aisee-config={JSON.stringify([{scope:'Interactive preview',component:'ThinkingIndicator',props:{showIcon,size}}])}>
    <h1>Thinking Indicator</h1>
    <p className="intro">A quiet thinking state before a reply arrives. A circle morphs into infinity while the label gently shimmers and cycles.</p>
    <div className="thinking-demo__heading"><h2>Interactive preview <span className="aisee-content-new">NEW</span></h2><div className="thinking-demo__controls">
      <Toggle label="Show icon" checked={showIcon} onChange={event => setShowIcon(event.target.checked)} />
      <Dropdown ariaLabel="Indicator size" items={[{id:'default',label:'Default'},{id:'compact',label:'Compact'}]} value={size} onValueChange={value => setSize(value as typeof size)} />
    </div></div>
    <section className="thinking-demo__surface thinking-demo__preview" aria-label="Interactive thinking preview"><ThinkingIndicator showIcon={showIcon} size={size} /></section>
    <p className="note">Copy for AI keeps the icon and size choices above. Status words can be supplied by your product; they do not indicate real task progress.</p>
    <h2>Variants</h2>
    <div className="thinking-demo__grid">
      <section className="thinking-demo__surface"><h3>Default</h3><ThinkingIndicator /></section>
      <section className="thinking-demo__surface"><h3>Compact</h3><ThinkingIndicator size="compact" /></section>
      <section className="thinking-demo__surface"><h3>Text only</h3><ThinkingIndicator showIcon={false} /></section>
      <section className="thinking-demo__surface"><h3>Localized labels</h3><ThinkingIndicator labels={['思考中', '整理思路', '完善回答']} aria-label="正在思考，请稍候" /></section>
    </div>
    <h2>Usage</h2>
    <section className="thinking-demo__usage">
      <pre><code>{`// Render only while waiting; use your real request state.
{isThinking && <ThinkingIndicator />}

// Inline before a streamed reply
<ThinkingIndicator showIcon={false} size="compact" />`}</code></pre>
      <p>Use labels for your own language or neutral waiting phrases. Remove the indicator when the response is ready. Use Steps for real progress; this indicator does not claim which operations the model is performing.</p>
      <p>AISEE preview uses Karla, 14px / 22px by default and 12px / 18px when compact. Production inherits your font and uses scoped semantic color defaults. No Tailwind, Inter, SizeProvider or motion package is required.</p>
      <p>Respects reduced motion: a static infinity glyph and first label replace all animation. Screen readers receive one stable status rather than every decorative phrase.</p>
    </section>
  </main>;
}
createRoot(document.getElementById('thinking-indicator-demo')!).render(<App />);
