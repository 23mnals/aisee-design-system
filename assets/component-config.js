/* Copy-time configuration contract. Only explicit design controls are exported. */
(function (global) {
  'use strict';
  const pathFor = name => `components/${name}/${name}.html`;
  const reactPages = ['SidebarNavigation', 'Button', 'Toggle', 'EmptyState', 'FeatureOverview', 'Card', 'ToggleSelectionGroup', 'Steps'].map(pathFor);
  const galleryPages = ['SegmentedChoice', 'PlanCardCurrent', 'TagInput', 'TreeNav', 'Badge', 'StatCardCurrent', 'Table', 'Chart', 'ScoreGauge', 'CreditBar', 'Dialog', 'ConfirmationDialog', 'TooltipToast'].map(pathFor);
  function required(doc, selector) {
    const element = doc.querySelector(selector);
    if (!element) throw new Error('Configuration is not ready: ' + selector);
    return element;
  }
  const checked = (doc, selector) => Boolean(required(doc, selector).checked);
  const attr = (doc, selector, name) => {
    const value = required(doc, selector).getAttribute(name);
    if (value === null) throw new Error('Missing configuration value: ' + selector);
    return value;
  };
  const section = (scope, component, props, extra = {}) => ({scope, component, props, ...extra});
  const staticReaders = {
    [pathFor('Input')]: doc => {
      const state = attr(doc, '#stateLabel', 'data-state');
      return [section('Interactive preview', 'Input', {type:'url', disabled:state === 'disabled', ...(state === 'error' ? {error:'Enter a valid website URL.'} : {})}, {previewState:state})];
    },
    [pathFor('Checkbox')]: doc => [section('Module theme', 'Checkbox', {}, {theme:attr(doc, '[data-theme][aria-pressed="true"]', 'data-theme')})],
    [pathFor('QuantityStepper')]: doc => [section('Input mode', 'QuantityStepper', {inputMode:attr(doc, '[data-mode-control][aria-pressed="true"]', 'data-mode-control') === 'buttons' ? 'buttons-only' : 'editable'})],
    [pathFor('Tabs')]: doc => [
      section('Segmented · Icon + text', 'Tabs', {}, {slots:{icon:checked(doc, '#showIcons')}}),
      section('Segmented · Text only', 'Tabs', {}, {slots:{count:checked(doc, '#showCounts')}})
    ],
    [pathFor('NotificationBell')]: doc => [
      section('Notification bell', 'NotificationBell', {dot:checked(doc, '#dotModeDemo')}),
      section('Notification dropdown', 'NotificationPanel', {state:attr(doc, '#panelStateMenu [aria-selected="true"]', 'data-value'),showIcons:checked(doc, '#showIcons'),showStatus:checked(doc, '#showStatus'),showActions:checked(doc, '#showActions')}, {slots:{errorDetail:checked(doc, '#showErrors')},previewState:'Panel state is for demonstration; real loading and errors come from the data source.'})
    ],
    [pathFor('Select')]: doc => {
      const composition = attr(doc, '#compositionVariantControl', 'data-value');
      const extra = composition === 'action' ? {slots:{leadingIcon:checked(doc, '#variantIcons')}} : {};
      if (composition === 'compact') extra.previewState = {open:checked(doc, '#variantOpen')};
      return [section('Variant playground', 'Dropdown', {}, {composition, ...extra, rules:['Composition is a demo recipe, not a Dropdown prop. Reuse the matching Current composition; use real task content.']})];
    },
    'preview/avatar.html': doc => ['account','social'].map(kind => section(kind === 'account' ? 'Sidebar account profile' : 'Social account list', 'Avatar', {kind}, {
      composition:{assetIndex:Number(attr(doc, `[data-picker="${kind}"] [aria-selected="true"]`, 'data-index'))},
      ...(kind === 'account' ? {motion:{animateEyes:checked(doc, '#avatarMotion')}} : {}),
      rules:['Asset index refers to this page’s avatar library; use the matching approved asset. Do not treat it as a seed or assume a nonexistent component prop. Generated extensions remain unapproved and must not enter automatic assignment pools.']
    }))
  };
  const supportedPaths = Object.freeze([...reactPages, ...Object.keys(staticReaders), ...galleryPages]);
  function read(doc, path) {
    if (!supportedPaths.includes(path)) throw new Error('Component configuration has not been registered.');
    let sections = [];
    if (reactPages.includes(path)) {
      sections = JSON.parse(attr(doc, '[data-aisee-config]', 'data-aisee-config'));
      if (!Array.isArray(sections) || !sections.length || sections.some(s => !s.scope || !s.component)) throw new Error('Invalid component configuration.');
    } else if (staticReaders[path]) sections = staticReaders[path](doc);
    return {schemaVersion:1, reference:path, status:sections.length ? 'selected' : 'no-variable-controls', sections};
  }
  function readFrame(frame, path, baseURI) {
    const doc = frame.contentDocument;
    const expected = new URL(path, baseURI);
    if (!doc || doc.readyState !== 'complete' || new URL(doc.URL).origin !== expected.origin || new URL(doc.URL).pathname !== expected.pathname) {
      throw new Error('Please wait for the current component preview to finish loading.');
    }
    return read(doc, path);
  }
  function format(snapshot) {
    return '\n\nCurrent selected configuration (captured when Copy for AI was clicked):\n' +
      (snapshot.status === 'selected'
        ? 'Use these choices for their named scopes. Do not substitute a different variant unless the user requests it. Separate scopes are independent examples, not props to merge into a single component.\n'
        : 'This page has no variable selector. No particular gallery example has been selected; do not claim that it has. Follow explicit user requirements, the target design or established product configuration, then documented component defaults.\n') +
      'props are component parameters; slots, composition, theme and motion describe composition requirements and may need mapping to the documented API. previewState is a visual demonstration, not a fixed production state. Replace example business content.\n' +
      '```json\n' + JSON.stringify(snapshot, null, 2) + '\n```';
  }
  global.AiseeComponentConfig = Object.freeze({read, readFrame, format, supportedPaths});
})(typeof window === 'undefined' ? globalThis : window);
