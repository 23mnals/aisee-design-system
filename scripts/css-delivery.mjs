import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';
import valueParser from 'postcss-value-parser';

const selectorAst = text => selectorParser().astSync(text);
const familyOwns = (name, families) => families.some(f => name === f || name.startsWith(f + '__') || name.startsWith(f + '--'));
// Manifest classes are entry anchors, not a substring filter. Negative/relational
// pseudo arguments alone cannot establish ownership of the styled element.
function anchored(selector, families) {
  return selector.nodes.some(n => n.type === 'class' && familyOwns(n.value, families) ||
    n.type === 'pseudo' && [':is', ':where'].includes(n.value) && n.nodes?.some(s => anchored(s, families)));
}
function ownedSelectors(text, families) {
  const ast = selectorAst(text);
  return ast.nodes.filter(s => anchored(s, families)).map(s => {
    const copy=s.clone();
    // An OR branch must not broaden a component rule to an unrelated component.
    if(!copy.nodes.some(n=>n.type==='class'&&familyOwns(n.value,families))) copy.walkPseudos(p => {if([':is',':where'].includes(p.value) && p.nodes?.some(s=>anchored(s,families))) p.nodes.filter(s=>!anchored(s,families)).forEach(s=>s.remove());});
    let foreign=false;
    const inspect=sel=>sel.nodes.forEach(n=>{
      if(n.type==='class'&&n.value.startsWith('aisee-')&&!familyOwns(n.value,families))foreign=true;
      if(n.type==='pseudo'&&[':is',':where'].includes(n.value))n.nodes?.forEach(inspect);
    });
    inspect(copy);
    // Overrides requiring a different production component belong to that
    // composition's manifest, not to this standalone component.
    return foreign?null:copy.toString();
  }).filter(Boolean);
}
const rootOnly = selector => {const n=selectorAst(selector).nodes; return n.every(s=>s.nodes.length===1 && s.nodes[0].type==='pseudo' && s.nodes[0].value===':root');};
export function variableReferences(value) {
  const refs=[];
  valueParser(value).walk(n=> {if(n.type==='function' && n.value==='var') {
    const name=n.nodes.find(n=>n.type==='word')?.value;
    if(!name?.startsWith('--'))throw Error('Invalid CSS custom property reference: '+value);
    refs.push({name,hasFallback:n.nodes.some(n=>n.type==='div'&&n.value===',')});
  }});
  return refs;
}
export function withVariableFallbacks(value, defaults, trail=[]) {
  const parsed=valueParser(value);
  const visit=nodes=>{for(const n of nodes)if(n.type==='function') {
    if(n.value==='var') {
      const name=n.nodes.find(n=>n.type==='word')?.value;
      if(!n.nodes.some(n=>n.type==='div'&&n.value===',') && defaults.has(name)) {
        if(trail.includes(name))throw Error('Circular CSS default: '+[...trail,name].join(' -> '));
        n.nodes.push({type:'div',value:',',before:'',after:' '},...valueParser(withVariableFallbacks(defaults.get(name),defaults,[...trail,name])).nodes);
      }
    }
    visit(n.nodes);
  }};
  visit(parsed.nodes);return parsed.toString();
}
function scopedProvider(selector, anchors) {
  return selectorAst(selector).nodes.flatMap(s => {
    const copy=s.clone();let root=false;
    copy.walkPseudos(p=>{if(p.value===':root'){root=true;p.replaceWith(selectorParser.pseudo({value:':where',nodes:selectorAst(anchors).nodes}));}});
    if(root)return [copy.toString()];
    // Keep ancestor and same-element contexts without exporting a global theme.
    return [`:where(${s} :is(${anchors}))`,`:where(:is(${anchors}):is(${s}))`];
  }).join(', ');
}
function isKeyframes(node){return node.type==='atrule' && /^(?:-\w+-)?keyframes$/i.test(node.name);}
function enclosingRule(node){let p=node.parent;while(p && p.type!=='rule')p=p.parent;return p;}
function inKeyframes(node){for(let p=node.parent;p;p=p.parent)if(isKeyframes(p))return true;return false;}

/** Reachability: selectors -> declarations -> var definitions/@property ->
 * animation names -> keyframes -> more variables. Original conditional wrappers
 * and source order are emitted after the fixed point, including state rules. */
export function cssDependencyClosure(sources, propertySources=[], runtimeProperties=[], inlineValues=[]) {
  const inputs=[...sources.map(s=>({...s,propertiesOnly:false})),...propertySources.map(s=>({...s,classes:[],propertiesOnly:true}))];
  const trees=inputs.map(s=>postcss.parse(s.css,{from:s.path}));
  const anchors=[...new Set(sources.flatMap(s=>s.classes))].map(c=>'.'+c).join(', ');
  const selected=new Map(), providers=new Map(), defaults=new Map(), frames=new Map(), registrations=new Map();
  const used=new Set(), neededFrames=new Set(), neededRegistrations=new Set(), providerDecls=new Set();
  const selectedDeclarations=()=>{const out=new Set();for(const rule of selected.keys())rule.walkDecls(n=>out.add(n));return [...out];};
  const undeclaredTrees=new Set();
  trees.forEach((tree,index)=>{
    if(inputs[index].undeclared)undeclaredTrees.add(tree);
    const input=inputs[index];
    tree.walkRules(rule=>{
      if(inKeyframes(rule))return;
      const inherited=!!enclosingRule(rule)&&selected.has(enclosingRule(rule));
      const sels=input.propertiesOnly?[]:inherited?selectorAst(rule.selector).nodes.map(s=>s.toString()):ownedSelectors(rule.selector,input.classes);
      if(sels.length)selected.set(rule,sels.join(', '));
      let foreignProvider=false;
      if(!sels.length&&!input.propertiesOnly)selectorAst(rule.selector).walkClasses(n=>{if(n.value.startsWith('aisee-'))foreignProvider=true;});
      rule.each(d=>{if(!foreignProvider&&d.type==='decl'&&d.prop.startsWith('--')){
        if(!providers.has(d.prop))providers.set(d.prop,[]);providers.get(d.prop).push(d);
        if(rootOnly(rule.selector)&&rule.parent.type==='root')defaults.set(d.prop,d.value);
      }});
    });
    tree.walkAtRules(rule=>{
      if(isKeyframes(rule)){
        const name=valueParser(rule.params).nodes.find(n=>['word','string'].includes(n.type))?.value;
        if(!frames.has(name))frames.set(name,[]);frames.get(name).push(rule);
      }
      if(rule.name==='property'){if(!registrations.has(rule.params))registrations.set(rule.params,[]);registrations.get(rule.params).push(rule);}
    });
  });
  const collect=value=>{for(const ref of variableReferences(value))used.add(ref.name);};
  const animationCandidates=(value,seen=new Set())=>{
    valueParser(value).walk(n=>{
      if(['word','string'].includes(n.type)&&frames.has(n.value))neededFrames.add(n.value);
      if(n.type==='function'&&n.value==='var'){
        const name=n.nodes.find(n=>n.type==='word')?.value;
        if(!seen.has(name)){seen.add(name);for(const d of providers.get(name)||[])animationCandidates(d.value,seen);}
      }
    });
  };
  const scan=d=>{collect(d.value);if(/^(?:-\w+-)?animation(?:-name)?$/.test(d.prop))animationCandidates(d.value);};
  inlineValues.forEach(collect);
  let size=-1;
  while(size!==used.size+neededFrames.size+neededRegistrations.size+providerDecls.size){
    size=used.size+neededFrames.size+neededRegistrations.size+providerDecls.size;
    selectedDeclarations().forEach(scan);
    for(const name of used){
      for(const d of providers.get(name)||[]){providerDecls.add(d);scan(d);}
      for(const registration of registrations.get(name)||[]){neededRegistrations.add(registration);registration.walkDecls(scan);}
    }
    for(const name of neededFrames)for(const frame of frames.get(name)||[])frame.walkDecls(scan);
  }
  // Missing definitions fail the build unless a real fallback or an explicitly
  // discovered production JS style property supplies the value at runtime.
  for(const rule of selected.keys())if(undeclaredTrees.has(rule.root()))throw Error('Undeclared CSS production dependency: '+rule.source.input.file);
  for(const d of providerDecls)if(undeclaredTrees.has(d.root()))throw Error('Undeclared CSS custom property provider: '+d.source.input.file);
  for(const name of neededFrames)for(const frame of frames.get(name)||[])if(undeclaredTrees.has(frame.root()))throw Error('Undeclared CSS animation dependency: '+frame.source.input.file);
  for(const registration of neededRegistrations)if(undeclaredTrees.has(registration.root()))throw Error('Undeclared CSS property registration: '+registration.source.input.file);
  const available=new Set([...providers.keys(),...registrations.keys(),...runtimeProperties]);
  const validate=d=>{for(const ref of variableReferences(d.value))if(!available.has(ref.name)&&!ref.hasFallback)throw Error(`Unresolved CSS custom property ${ref.name} in ${d.toString()}`);};
  selectedDeclarations().forEach(validate);providerDecls.forEach(validate);
  inlineValues.forEach(value=>validate({value,toString:()=>value}));
  for(const n of neededRegistrations)n.walkDecls(validate);
  for(const name of neededFrames)for(const n of frames.get(name)||[])n.walkDecls(validate);

  const emit=node=>{
    if(node.type==='comment')return null;
    if(node.type==='decl')return selected.has(enclosingRule(node))?node.clone():null;
    if(node.type==='rule'){
      if(selected.has(node)){
        const clone=node.clone({selector:selected.get(node),nodes:[]});
        for(const child of node.nodes){if(child.type==='decl')clone.append(child.clone());else {const kept=emit(child);if(kept)clone.append(kept);}}
        return clone;
      }
      const nested=node.nodes.filter(n=>n.type!=='decl').map(emit).filter(Boolean);
      if(nested.length){
        let foreign=false;selectorAst(node.selector).walkClasses(n=>{if(n.value.startsWith('aisee-'))foreign=true;});
        if(foreign)throw Error('Nested CSS rule requires its production owner: '+node.selector);
        return node.clone({nodes:nested});
      }
      const declarations=node.nodes.filter(d=>providerDecls.has(d));
      if(!declarations.length || rootOnly(node.selector)&&node.parent.type==='root')return null;
      if(enclosingRule(node))throw Error('CSS variable provider needs its owning parent declared: '+node.selector);
      return node.clone({selector:scopedProvider(node.selector,anchors),nodes:declarations.map(d=>d.clone())});
    }
    if(node.type==='atrule'){
      if(['import','font-face'].includes(node.name))return null;
      if(isKeyframes(node))return [...neededFrames].some(name=>frames.get(name).includes(node))?node.clone():null;
      if(node.name==='property')return neededRegistrations.has(node)?node.clone():null;
      if(!node.nodes)return node.name==='layer'?node.clone():null;
      const children=node.nodes.map(emit).filter(Boolean);
      return children.length?node.clone({nodes:children}):null;
    }
    return null;
  };
  const tree=postcss.root();for(const source of trees)for(const n of source.nodes){const kept=emit(n);if(kept)tree.append(kept);}
  tree.walkDecls(d=>{d.value=withVariableFallbacks(d.value,defaults);});
  return {tree,defaults,usedProperties:[...used],keyframes:[...neededFrames]};
}
