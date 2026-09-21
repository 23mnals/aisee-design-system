import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {NotificationBell} from './src/notification-bell';
import {Button} from './src/button';
import {Tabs} from './src/tabs';
import {Dialog} from './src/dialog';
const sleep=(ms:number)=>new Promise(resolve=>setTimeout(resolve,ms));
function TestApp(){
  const [results,setResults]=useState<string[]>([]);
  const [tab,setTab]=useState('first');
  const [open,setOpen]=useState(false);
  async function run(){
    const output:string[]=[];
    const check=(ok:boolean,message:string)=>{output.push(`${ok?'PASS':'FAIL'}: ${message}`);setResults([...output]);};
    const host=document.getElementById('bell-test')!;
    const root=createRoot(host);
    let rings=0,badges=0;
    host.addEventListener('animationstart',e=> {const name=(e as AnimationEvent).animationName;if(name.includes('bell-ring'))rings++;if(name.includes('badge-in'))badges++;});
    const render=(count:number,dot=false)=>flushSync(()=>root.render(<NotificationBell count={count} dot={dot}/>));
    const wait=()=>sleep(750);
    render(0);await wait();check(rings===0&&badges===0&&!host.querySelector('.aisee-notification-bell__badge'),'initial zero has no incoming animation or badge');
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    render(1);await wait();check(reduced ? rings===0&&badges===0 : rings===1&&badges===1,'increase runs bell and badge animation (or honors reduced motion)');
    let previous=[rings,badges];
    render(1);await wait();check(rings===previous[0]&&badges===previous[1],'ordinary rerender does not replay');
    render(3);await wait();check(reduced ? rings===previous[0] : rings===previous[0]+1&&badges===previous[1]+1,'next increase replays both animations');
    previous=[rings,badges];render(2);await wait();check(rings===previous[0]&&badges===previous[1],'decrease does not replay');
    render(0);await wait();check(rings===previous[0]&&badges===previous[1]&&!host.querySelector('.aisee-notification-bell__badge'),'clear hides badge without incoming animation');
    render(100);await wait();check(host.querySelector('.aisee-notification-bell__badge')?.textContent==='99+','real count >99 displays 99+');
    render(100,true);await wait();check(!!host.querySelector('.aisee-notification-bell__dot')&&!host.querySelector('.aisee-notification-bell__badge'),'dot capability retained');
    previous=[rings,badges];host.querySelector('button')!.focus();await wait();check(reduced ? rings===previous[0] : rings===previous[0]+1&&badges===previous[1],'focus rings only inner bell');
    previous=[rings,badges];host.querySelector('button')!.dispatchEvent(new PointerEvent('pointerover',{bubbles:true}));await wait();check(reduced ? rings===previous[0] : rings===previous[0]+1&&badges===previous[1],'hover rings only inner bell');
    check(getComputedStyle(host.querySelector('button')!).fontFamily.includes('monospace'),'inherits host typography');
    output.push('DONE');setResults([...output]);
  }
  return <main style={{fontFamily:'monospace',padding:32}}><h1>Isolated production delivery verification</h1><button onClick={run} disabled={results.length>0}>Run bell behavior tests</button><div id="bell-test" style={{padding:30}}/><pre>{results.join('\n')}</pre><Button onClick={()=>setOpen(true)}>Open production Dialog</Button><Tabs items={[{id:'first',label:'First'},{id:'second',label:'Second'}]} value={tab} onValueChange={setTab}/><p>Selected tab: {tab}</p><Dialog open={open} onClose={()=>setOpen(false)} title="Production dialog"><p>Host content</p></Dialog></main>;
}
createRoot(document.getElementById('root')!).render(<TestApp/>);
