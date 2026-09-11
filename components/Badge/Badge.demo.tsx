import { createRoot } from 'react-dom/client';
import { Badge, type BadgeStatus } from '../../src/components/Badge';
import '../../src/tokens/tokens.css';
import '../../src/styles/base.css';
import '../../src/styles/components.css';

function App() {
  return <>
    <h2 className="aisee-content-heading">Source · icon + label <span className="aisee-content-new">NEW</span></h2>
    <div className="preview row" aria-label="Source badges">
      <Badge variant="source" iconName="from-plan">From plan</Badge>
      <Badge variant="source" iconName="manual">Manual</Badge>
      <Badge variant="source" iconName="rewritten">Rewritten</Badge>
    </div>
    <p className="muted">Solid gray background, no border. Karla 14px / 18px · 16px icon · 4px gap · 3px × 8px padding · 8px radius.</p>
    <h2 className="aisee-content-heading">Status · icon + label <span className="aisee-content-new">NEW</span></h2>
    <div className="preview row" aria-label="Status badges">
      {(['scheduled', 'published', 'draft', 'failed', 'removed'] as BadgeStatus[]).map(status => <Badge key={status} variant="status" status={status} />)}
    </div>
    <p className="muted">Muted fill and a gray border for every status. Karla 12px / 14px · 12px icon · 2px gap · 5px × 8px padding · 12px radius.</p>
    <h2>Icon badge usage</h2>
    <p><code>{'<Badge variant="source" iconName="from-plan">From plan</Badge>'}</code></p>
    <p><code>{'<Badge variant="status" status="scheduled">已排期</Badge>'}</code></p>
    <p className="muted">Use <code>iconName</code> for the Figma icons or <code>icon</code> for a custom icon/logo. Status presets supply the icon and default label; children can replace it with localized text. These are descriptive labels, with no button behavior.</p>
    <p><a href="https://www.figma.com/design/LLvI9vd66VLNuAltAWJFJw/?node-id=75-31848" target="_blank" rel="noreferrer">Source and status badges in Figma</a></p>
  </>;
}
createRoot(document.getElementById('badge-icon-demo')!).render(<App />);
