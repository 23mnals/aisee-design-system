import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'vite';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const require=createRequire(import.meta.url);
const output=await build({configFile:false,logLevel:'silent',build:{write:false,minify:false,lib:{entry:fileURLToPath(new URL('../src/components/ConfirmationDialog.tsx',import.meta.url)),formats:['cjs']},rollupOptions:{external:['react','react/jsx-runtime']}}});
const code=(Array.isArray(output)?output[0]:output).output.find(item=>item.type==='chunk').code;
const module={exports:{}};new Function('require','module','exports',code)(require,module,module.exports);
const {ConfirmationDialog}=module.exports;
const base={open:false,title:'Host confirmation',onClose(){},onConfirm(){}};
const render=props=>renderToStaticMarkup(createElement(ConfirmationDialog,{...base,...props}));
test('simple confirmation does not add business notices or dangling description references',()=>{
  const html=render({});assert.doesNotMatch(html,/aria-describedby|__notices|Queued posts|automation|10 posts/);
  assert.match(html,/Keep Editing/);assert.match(html,/Discard Changes/);
});
test('host notices, content, labels, variant and disabled state compose without demo dependencies',()=>{
  const html=render({description:'Host description',notices:[{id:'a',tone:'positive',title:'Preserved',description:'From real data',icon:createElement('img',{src:'/host.svg',alt:''})},{id:'b',tone:'warning',title:'Paused'}],children:createElement('p',null,'Host content'),cancelLabel:'Stay',confirmLabel:'Continue',closeLabel:'Dismiss',confirmVariant:'primary',confirmDisabled:true,className:'host-dialog'});
  assert.match(html,/__notice--positive/);assert.match(html,/__notice--warning/);assert.match(html,/From real data/);assert.match(html,/host-dialog/);assert.match(html,/Host content/);assert.match(html,/aria-label="Dismiss"/);assert.match(html,/aisee-button--primary[^>]*disabled/);assert.doesNotMatch(html,/Turn off automation|demo|Toast/);
});
