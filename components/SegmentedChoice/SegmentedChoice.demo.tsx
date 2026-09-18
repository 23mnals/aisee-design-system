import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SegmentedChoice, type SegmentedChoiceOption } from '../../src/components/SegmentedChoice';
import '../../src/tokens/tokens.css';
import '../../src/styles/base.css';
import '../../src/styles/components.css';
import './SegmentedChoice.demo.css';
const formats: SegmentedChoiceOption[] = [
  { id:'single',label:'Single post',requirement:'Up to ~280 chars',description:'One standalone post · Up to 280 characters' },
  { id:'thread',label:'Thread',requirement:'Connected X posts',description:'A connected sequence of X posts for a longer story.' },
];
const lengths: SegmentedChoiceOption[] = [
  { id:'short',label:'Short',requirement:'1–2 sentences',description:'Keep the message focused on one idea.' },
  { id:'medium',label:'Medium',requirement:'3–5 sentences',description:'Add a little context and one supporting detail.' },
  { id:'long',label:'Long',requirement:'6–8 sentences',description:'Use more space to explain the idea and its context.' },
];
function Demo(){const [format,setFormat]=useState('single');return <main className="segmented-demo">
<h1>Segmented Choice</h1><p>Choose one of 2–4 options. Keep each requirement short; use the information control for an explanation.</p>
<h2>Post format <span className="aisee-content-new">NEW</span></h2><section><SegmentedChoice label="Post format" tone="yellow" options={formats} value={format} onValueChange={setFormat}/></section>
<h2>Three options</h2><section><SegmentedChoice label="Content length" options={lengths} defaultValue="short"/></section>
<h2>Four options / unavailable</h2><section><SegmentedChoice label="Content length" options={[...lengths,{id:'custom',label:'Custom',requirement:'Not available',description:'Custom length is not available for this workspace.',disabled:true}]} defaultValue="medium"/></section>
<h2>Disabled</h2><section><SegmentedChoice label="Post format" tone="yellow" options={formats} defaultValue="single" disabled/></section>
<h2>Usage</h2><section><p>Use native radio selection for a small, mutually exclusive choice. Arrow keys move between available options; Tab reaches the information control. Explanations follow the selected option.</p><p>For many options, use Dropdown. For switching views, use Tabs. For a group that can be turned on or off, use Toggle Selection Group.</p><pre>{`<SegmentedChoice label="Post format" tone="yellow"
  options={options} value={format} onValueChange={setFormat} />`}</pre><p>Options: id, label, requirement, description, disabled. Group: value / defaultValue, onValueChange, name, required, disabled, tone.</p></section>
</main>};createRoot(document.getElementById('segmented-choice-demo')!).render(<Demo/>);
