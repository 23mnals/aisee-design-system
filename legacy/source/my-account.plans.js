/* ═══════════════════════════════════════════════════════════════
   Plans grid — renders the 3 pricing cards (Starter / Developer / Pro)
   Matches the spec from image 3 of the user reference.
   ═══════════════════════════════════════════════════════════════ */

const SPARK = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"/></svg>';
const CK = '<svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 12 10 17 19 7"/></svg>';

function modelDots(set){
  // set: 'core' or 'all' or 'full'
  const dots = [
    {c:'gpt',l:'G'},{c:'gem',l:'g'},{c:'grk',l:'X'},{c:'ppx',l:'P'}
  ];
  const n = set === 'core' ? 2 : 4;
  return '<span class="feat-models">' + dots.slice(0,n).map(d=>`<span class="m ${d.c}">${d.l}</span>`).join('') + '</span>';
}

const cubeIcons = {
  starter: `<svg width="40" height="40" viewBox="0 0 32 32" fill="none" stroke="#111" stroke-width="1.2" stroke-linejoin="round"><path d="M16 4 L28 10 L28 22 L16 28 L4 22 L4 10 Z"/><path d="M16 4 L16 16 M4 10 L16 16 M28 10 L16 16"/></svg>`,
  developer: `<svg width="40" height="40" viewBox="0 0 32 32" fill="none" stroke="#111" stroke-width="1.2" stroke-linejoin="round"><path d="M16 3 L29 24 L3 24 Z"/><path d="M16 3 L16 24 M9 13 L23 13"/></svg>`,
  pro: `<svg width="40" height="40" viewBox="0 0 32 32" fill="none" stroke="#111" stroke-width="1.2" stroke-linejoin="round"><rect x="3" y="3" width="11" height="11"/><rect x="18" y="3" width="11" height="11"/><rect x="3" y="18" width="11" height="11"/><rect x="18" y="18" width="11" height="11"/></svg>`,
};

const plans = [
  {
    id:'starter',
    name:'Starter',
    tag:'For Individuals',
    tagColor:'var(--lime-bright)',
    price:'$9',
    desc:'Get the basics of AEO Checker, at a limited rate.',
    credits:'1,000',
    cta:{label:'Current Plan', kind:'current'},
    icon:cubeIcons.starter,
    sections:[
      {
        title:'Analysis · AI Visibility',
        items:[
          {label:'Core AI models', extra:modelDots('core')},
          {label:'Brand presence detection · <b>basic</b>'},
          {label:'Action Canvas<br><span style="color:var(--muted);font-size:12px;">(insights → Recommended actions)</span>'},
          {label:'Competitor mentions overview'},
        ],
      },
      {
        title:'Engage · Track & Reply',
        items:[
          {label:'3 tracked keywords', meta:'MAX', metaCls:'max'},
          {label:'Priority tracked accounts', dash:true},
          {label:'1 sub-channel / sub-reddit'},
          {label:'Scan frequency · 24 h'},
          {label:'AI-generated replies', meta:'10 / mo trial', metaCls:'trial'},
          {label:'Sent tracking + history'},
        ],
      },
      {
        title:'Support',
        items:[
          {label:'Standard support'},
        ],
      },
    ],
  },
  {
    id:'developer',
    name:'Developer',
    tag:'For Startups',
    tagColor:'var(--lime-bright)',
    price:'$25',
    desc:'Run unlimited monthly checks with limited models.',
    credits:'4,000',
    cta:{label:'Upgrade Plan →', kind:'upgrade'},
    icon:cubeIcons.developer,
    sections:[
      {
        title:'Analysis · AI Visibility',
        items:[
          {label:'All AI models', extra:modelDots('all')},
          {label:'Multi-model comparison'},
          {label:'Brand presence detection · <b>full</b>'},
          {label:'Visibility'},
          {label:'Competitor Mentions Overview'},
          {label:'Website AI Diagnostic & Priorities Report'},
          {label:'Action Canvas<br><span style="color:var(--muted);font-size:12px;">(insights → Recommended actions)</span>'},
        ],
      },
      {
        title:'Engage · Track & Reply',
        items:[
          {label:'10 tracked keywords', meta:'MAX', metaCls:'max'},
          {label:'10 priority tracked accounts'},
          {label:'5 sub-channels / sub-reddits'},
          {label:'Scan frequency · 24 h'},
          {label:'AI-generated replies', meta:'Unlimited', metaCls:'unlimited'},
          {label:'Sent tracking + history'},
        ],
      },
      {
        title:'Support',
        items:[
          {label:'Standard support'},
          {label:'Priority scan queue'},
        ],
      },
    ],
  },
  {
    id:'pro',
    name:'Pro',
    tag:'For Organizations',
    tagColor:'var(--lime-bright)',
    price:'$55',
    desc:'Optimize for long term AEO presence and track progress.',
    credits:'10,000',
    cta:{label:'Upgrade Plan →', kind:'primary'},
    badge:'Full Engage',
    icon:cubeIcons.pro,
    sections:[
      {
        title:'Analysis · AI Visibility',
        items:[
          {label:'All AI platforms · full coverage', extra:modelDots('full')},
          {label:'Multi-model comparison'},
          {label:'Brand presence detection · <b>full</b>'},
          {label:'Visibility'},
          {label:'Competitor Mentions Overview'},
          {label:'Website AI diagnostic + priorities'},
          {label:'Action Canvas<br><span style="color:var(--muted);font-size:12px;">(insights → Recommended actions)</span>'},
        ],
      },
      {
        title:'Engage · Track & Reply',
        items:[
          {label:'30 tracked keywords', meta:'MAX', metaCls:'max'},
          {label:'Priority accounts · <b>unlimited</b> <span style="color:var(--muted);">(soft cap)</span>'},
          {label:'15 sub-channels / sub-reddits'},
          {label:'Scan frequency · <b>6–12 h</b> (faster)'},
          {label:'AI-generated replies', meta:'Unlimited', metaCls:'unlimited'},
          {label:'Sent tracking + history'},
        ],
      },
      {
        kind:'post-agent-box',
        title:'Post Agent · publish & schedule',
        items:[
          'Action Mappings',
          'Execution Workspace',
          'AI-Assisted Content Creation',
          'Multi-Channel & Scheduled Execution',
          'Automated Distribution',
          'Performance Data track',
        ],
      },
      {
        title:'Support',
        items:[
          {label:'Priority support · 24 / 7'},
          {label:'Dedicated account manager'},
          {label:'Priority scan queue'},
        ],
      },
    ],
  },
];

function renderItem(it){
  if(typeof it === 'string') return `<li>${it}</li>`;
  const ck = it.dash
    ? `<span class="ck dash">−</span>`
    : `<span class="ck">${CK}</span>`;
  const meta = it.meta ? `<span class="meta ${it.metaCls||''}">${it.meta}</span>` : '';
  return `<li>${ck}<span>${it.label}${it.extra||''}</span>${meta}</li>`;
}

function renderSection(s){
  if(s.kind === 'post-agent-box'){
    return `
      <div class="post-agent-box">
        <div class="pa-head">
          <span class="ck">${CK}</span> ${s.title}
        </div>
        <ul>${s.items.map(i=>`<li>${i}</li>`).join('')}</ul>
        <div class="pa-icon">⚡</div>
      </div>`;
  }
  return `
    <div class="feat-cat-label${s._first?' first':''}">${s.title}</div>
    <ul class="feat-list">${s.items.map(renderItem).join('')}</ul>`;
}

function renderPlan(p){
  // mark first section
  p.sections[0]._first = true;
  const badge = p.badge ? `<div class="plan-badge">${p.badge}</div>` : '';
  return `
    <div class="plan-card${p.id==='pro'?' featured':''}">
      ${badge}
      <div class="plan-top">
        <div class="pkg-icon">${p.icon}</div>
        <div class="price">${p.price}<small>/ Month</small></div>
      </div>
      <div class="plan-name-row">
        <h4>${p.name}</h4>
        <span class="tier-tag" style="background:${p.tagColor}">${p.tag}</span>
      </div>
      <p class="plan-desc">${p.desc}</p>
      <div class="plan-credits-line">
        <svg class="spark" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"/></svg>
        <strong>${p.credits} Credits</strong> <small>/ Mo</small>
      </div>
      <button class="plan-cta ${p.cta.kind}">${p.cta.label}</button>
      <div class="feat-section">
        ${p.sections.map(renderSection).join('')}
      </div>
    </div>`;
}

document.getElementById('plans-grid').innerHTML = plans.map(renderPlan).join('');
