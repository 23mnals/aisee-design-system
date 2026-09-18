import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Dropdown } from '../../src/components/Dropdown';
import { Toggle } from '../../src/components/Toggle';
import '../../src/tokens/tokens.css';
import '../../src/styles/base.css';
import '../../src/styles/components.css';

const options = {
  color: [{ id: 'lime', label: 'Lime' }, { id: 'yellow', label: 'Yellow' }],
  surface: [{ id: 'light', label: 'Light' }, { id: 'dark', label: 'Dark' }],
  size: [{ id: '16', label: '16 px' }, { id: '24', label: '24 px' }],
  state: [{ id: 'on', label: 'On' }, { id: 'off', label: 'Off' }, { id: 'disabled-on', label: 'Disabled on' }, { id: 'disabled-off', label: 'Disabled off' }],
};
function TogglePlayground() {
  const [color, setColor] = useState<'lime' | 'yellow'>('lime');
  const [surface, setSurface] = useState<'light' | 'dark'>('light');
  const [size, setSize] = useState<16 | 24>(16);
  const [state, setState] = useState('on');
  return <><span hidden data-aisee-config={JSON.stringify([{scope:'Variant playground',component:'Toggle',props:{color,surface,size,checked:state.endsWith('on'),disabled:state.startsWith('disabled')},previewState:state}])} />
    <div className="variant-controls">
      <Dropdown label="Color" ariaLabel="Color" items={options.color} value={color} onValueChange={value => setColor(value as typeof color)} />
      <Dropdown label="Surface" ariaLabel="Surface" items={options.surface} value={surface} onValueChange={value => setSurface(value as typeof surface)} />
      <Dropdown label="Size" ariaLabel="Size" items={options.size} value={String(size)} onValueChange={value => setSize(Number(value) as typeof size)} />
      <Dropdown label="State" ariaLabel="State" items={options.state} value={state} onValueChange={setState} />
    </div>
    <div className="toggle-stage" data-surface={surface}>
      <Toggle color={color} surface={surface} size={size} label="Monitoring" checked={state.endsWith('on')} disabled={state.startsWith('disabled')} onChange={event => setState(event.target.checked ? 'on' : 'off')} />
    </div>
  </>;
}
createRoot(document.getElementById('togglePlayground')!).render(<TogglePlayground />);
