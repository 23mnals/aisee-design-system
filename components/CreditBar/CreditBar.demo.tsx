import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CreditBar } from '../../src/components/CreditBar';
import '../../src/tokens/tokens.css';
import '../../src/styles/base.css';
import '../../src/styles/components.css';
import './CreditBar.demo.css';

function App() {
  const [notice, setNotice] = useState('');
  return <main>
    <h1>Credit Bar</h1>
    <p className="intro">Remaining credits split into the two current sources: Subscription and Top-up.</p>
      <h2 className="aisee-content-heading">Current balance <span className="aisee-content-new">NEW</span></h2>
    <CreditBar subscriptionCredits={1200} subscriptionLimit={1600} topUpCredits={400} onPurchase={() => setNotice('Demo: open the credit purchase area.')} />
    <p className="credit-demo-status" role="status">{notice}</p>
    <h2 className="aisee-content-heading">Top-up is zero · Subscription only <span className="aisee-content-new">NEW</span></h2>
    <CreditBar remaining={640} subscriptionCredits={640} subscriptionLimit={1600} topUpCredits={0} />
    <h2 className="aisee-content-heading">Subscription is zero · Top-up only <span className="aisee-content-new">NEW</span></h2>
    <CreditBar remaining={480} subscriptionCredits={0} subscriptionLimit={1600} topUpCredits={480} />
    <h2 className="aisee-content-heading">No remaining credits · Both sources zero <span className="aisee-content-new">NEW</span></h2>
    <CreditBar remaining={0} subscriptionCredits={0} subscriptionLimit={1600} topUpCredits={0} onPurchase={() => setNotice('Demo: open the credit purchase area.')} />
    <h2>Usage</h2>
    <section className="credit-demo-note">The progress bar uses Subscription green and Top-up purple. When either source is zero, keep its 0 value visible, mute that legend item and give the full track to the remaining source. When both are zero, keep the empty neutral track visible and expose the purchase action when the product can open that flow. The legend and accessible label are derived from the same values.</section>
  </main>;
}

createRoot(document.getElementById('credit-bar-demo')!).render(<App />);
