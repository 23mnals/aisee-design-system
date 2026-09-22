import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Tooltip, type TooltipProps } from '../../src/components/Tooltip';
import { Dropdown } from '../../src/components/Dropdown';
import '../../src/tokens/tokens.css';
import '../../src/styles/components.css';

function TooltipPlayground() {
  const [animation, setAnimation] = useState<NonNullable<TooltipProps['animation']>>('playful');
  return <><span hidden data-aisee-config={JSON.stringify([{scope:'Tooltip motion preview',component:'Tooltip',props:{placement:'auto',animation},rules:['Four direction triggers are simultaneous examples of preferred sides, not a selected fixed placement. Show bubbles on hover or keyboard focus only. Playful motion is opt-in for avatar or member details; default to subtle for functional labels.']}])} />
    <div className="tooltip-controls"><Dropdown ariaLabel="Tooltip animation" label="Motion" items={[{id:'subtle',label:'Subtle'},{id:'playful',label:'Playful · avatar'},{id:'none',label:'No animation'}]} value={animation} onValueChange={value => setAnimation(value as typeof animation)} /></div>
    <section className="demo tooltip-demo"><Tooltip animation={animation} content="Set as baseline"><button className="trigger" type="button">Hover or focus</button></Tooltip></section>
    <p className="spec">Automatically chooses a side and stays within the viewport. Hover or focus each direction to preview.</p>
    <div className="placement-gallery" aria-label="Tooltip placement examples">
      {(['top','right','bottom','left'] as const).map(side => <div className="placement-example" key={side}><Tooltip placement={side} animation={animation} content="Tooltip"><button className="trigger" type="button">{side[0].toUpperCase() + side.slice(1)}</button></Tooltip></div>)}
    </div>
    <h2 className="aisee-content-heading">Avatar hover <span className="aisee-content-new" aria-label="New or updated content">NEW</span></h2>
    <section className="demo tooltip-demo avatar-tooltip-demo" aria-label="Avatar tooltip examples">
      {['Alex','Sam','Taylor'].map((name,index) => <Tooltip key={name} animation={animation} content={<><strong>{name}</strong><span className="member-role">Team member</span></>}><button className="avatar-trigger" type="button" aria-label={name}><img draggable={false} src={`../../assets/stemui/avatar-social-${index + 1}.svg`} alt="" /></button></Tooltip>)}
    </section>
    <p className="spec">Choose Playful for a springy entrance and pointer-following sway. Enter from either side to change the direction. Keyboard focus stays stable; reduced motion removes movement.</p>
  </>;
}
createRoot(document.getElementById('tooltip-live')!).render(<TooltipPlayground />);
