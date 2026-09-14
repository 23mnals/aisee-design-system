import { createRoot } from 'react-dom/client';
import { Button } from '../../src/components/Button';
import '../../src/tokens/tokens.css';
import '../../src/styles/base.css';
import '../../src/styles/components.css';
import './Button.demo.css';

function App() {
  return <main>
    <h1>Button</h1>
    <p className="intro">Current action variants with the shared two-sided hover and keyboard-focus motion.</p>
    <h2>Recommended · primary actions</h2>
    <section className="button-demo-panel button-demo-row" aria-label="Primary Button examples">
      <Button>Run analysis</Button>
      <span data-aisee-theme="post-agent"><Button>Publish post</Button></span>
      <Button variant="dark">Dark · Analysis</Button>
      <Button variant="dark" data-aisee-theme="post-agent">Dark · Post</Button>
    </section>
    <p className="button-demo-note">Primary uses the current module fill and moves to black. Dark moves to Analysis lime, or Publishing yellow inside a Post context.</p>
    <h2>Other current variants</h2>
    <section className="button-demo-panel button-demo-row" aria-label="Other Button examples">
      <Button variant="secondary">Secondary</Button><Button variant="ghost">Ghost</Button><Button variant="danger">Delete</Button>
    </section>
    <p className="button-demo-note">Secondary uses a 4% #111 hover overlay and keeps its existing border. Ghost and filled borderless variants do not reveal a border. Danger adds a 4% #111 overlay to its red fill.</p>
    <h2>States</h2>
    <section className="button-demo-grid">
      <article><span>Small</span><Button size="sm">Continue</Button></article>
      <article><span>Default</span><Button variant="secondary">Continue</Button></article>
      <article><span>Large</span><Button size="lg">Continue</Button></article>
      <article><span>Disabled</span><Button disabled>Continue</Button></article>
    </section>
    <h2>Usage</h2>
    <section className="button-demo-usage"><p>Import <code>Button</code> and the package stylesheet. The component supplies its structure, states and animation; product code supplies the label, handler, variant and module context.</p><pre><code>{`import { Button } from '@aisee/design-system';
import '@aisee/design-system/styles.css';

<Button variant="dark">Start analysis</Button>`}</code></pre></section>
  </main>;
}

createRoot(document.getElementById('button-demo')!).render(<App />);
