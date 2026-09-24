import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import { PlanCard, type SubscriptionPlanCardProps } from '../../src/components/PlanCard';
import { Dialog } from '../../src/components/Dialog';
import { Button } from '../../src/components/Button';
import companyIcon from '../../assets/plan-card/subscription/company.png';
import '../../src/tokens/tokens.css';
import '../../src/styles/base.css';
import '../../src/styles/components.css';
import './PlanCardCurrent.demo.css';

function App() {
  const [open,setOpen]=useState(false);
  const [message,setMessage]=useState('');
  const props:SubscriptionPlanCardProps={variant:'subscription',name:'Growth Loop',title:'Unlock full analysis',
    description:'Subscribe to start your full AI visibility report, growth plan, and publishing workflow.',
    price:'$99',credits:'8,000',companyName:'Aisee',website:'https://aisee.live',
    companyIcon:<img src={companyIcon} alt=""/>,
    onDismiss:()=>{setOpen(false);setMessage('Subscription postponed.');},
    onAction:()=>{setMessage('Subscribe callback triggered. Connect your checkout flow in the product. No payment was made.');}};
  return <main className="plan-demo aisee-root">
    <h1>PlanCard</h1><p className="intro">Subscription confirmation with plan benefits, credits and brand context.</p>
    <div className="plan-demo-heading"><h2>Subscription card <span className="aisee-content-new">NEW</span></h2><Button variant="secondary" onClick={()=>{setMessage('');setOpen(true);}}>Open dialog</Button></div>
    <div className="plan-demo-stage"><PlanCard {...props}/></div>
    <p className="plan-demo-feedback" role="status" aria-live="polite">{message}</p>
    <h2>Usage</h2><div className="plan-demo-usage"><p>Use the subscription variant for a single plan confirmation. Supply live price, credits and brand data. Maybe later dismisses; Subscribe calls the product checkout handler.</p><p>The preview demonstrates callbacks only. It does not purchase a subscription or start an analysis.</p><a href="./PlanCardPrevious.html">Previous plan comparison</a></div>
    <Dialog open={open} onClose={()=>setOpen(false)} title="Subscription confirmation" closeable={false} className="aisee-plan-subscription-dialog"><PlanCard {...props}/><p className="plan-demo-dialog-feedback" role="status" hidden={!message}>{message}</p></Dialog>
  </main>;
}
createRoot(document.getElementById('plan-card-demo')!).render(<App/>);
