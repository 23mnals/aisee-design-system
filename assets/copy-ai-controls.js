/* Copy UI owns explicit mode/variant intent; preview defaults never imply intent. */
(function(global) {
  'use strict';
  function create({document, deliveryApi, getContext, readSnapshot, resolveDelivery, writeClipboard, showToast, schedule = fn => setTimeout(fn, 1600)}) {
    const group = document.getElementById('copyAiControls');
    const button = document.getElementById('copyAiHeader');
    const label = document.getElementById('copyAiHeaderLabel');
    const mode = document.getElementById('copyAiMode');
    const variant = document.getElementById('copyAiVariant');
    const variantRow = document.getElementById('copyAiVariantRow');
    const status = document.getElementById('copyAiStatus');
    const modeLabel = document.getElementById('copyAiModeLabel');
    const trigger = document.getElementById('copyAiMenuTrigger');
    const menu = document.getElementById('copyAiMenu');
    const variantOptions = document.getElementById('copyAiVariantOptions');
    const modeOptions = [...group.querySelectorAll('[data-copy-mode]')];
    let revision = 0, intent = 0, busy = false, delivery = null, choices = [], fingerprint = '';
    function closeMenu(restoreFocus = false) {
      menu.hidden = true; trigger.setAttribute('aria-expanded', 'false');
      if (restoreFocus) trigger.focus();
    }
    function openMenu(last = false) {
      if (busy) return;
      menu.hidden = false; trigger.setAttribute('aria-expanded', 'true');
      const options = [...menu.querySelectorAll('[role="menuitemradio"]')];
      (last ? options.at(-1) : options.find(option => option.getAttribute('aria-checked') === 'true') || options[0])?.focus();
    }
    function variantSummary(choice) {
      const pretty = value => String(value).replace(/-/g, ' ').replace(/^./, c => c.toUpperCase());
      if (choice.component === 'Toggle') return [choice.props?.color, choice.props?.surface, choice.props?.size ? `${choice.props.size} px` : ''].filter(Boolean).map(pretty).join(' · ');
      return [...Object.entries(choice.props || {}), ...Object.entries(choice.slots || {}), ...(choice.theme ? [['theme', choice.theme]] : [])].map(([key,value]) => `${pretty(key.replace(/([a-z])([A-Z])/g, '$1 $2'))}: ${typeof value === 'boolean' ? value ? 'On' : 'Off' : pretty(value)}`).join(' · ');
    }
    function renderVariants() {
      const option = (value, title, description) => {
        const item = document.createElement('button'); item.type = 'button'; item.className = 'ai-copy-option';
        item.setAttribute('role', 'menuitemradio'); item.setAttribute('aria-checked', String(variant.value === value));
        item.setAttribute('data-copy-variant', value);
        const copy = document.createElement('span'); copy.className = 'ai-copy-option-copy'; copy.textContent = title;
        const detail = document.createElement('small'); detail.textContent = description; copy.append(detail); item.append(copy);
        item.addEventListener('click', () => { variant.value = value; variantChanged(); closeMenu(true); });
        return item;
      };
      variantOptions.replaceChildren(option('', 'No specific variant', 'Use the component reference'), ...choices.map((choice,index) => option(String(index), choices.length === 1 ? 'Use current preview' : choice.component, variantSummary(choice))));
    }
    function display(message) {
      const name = deliveryApi.modeInfo(mode.value).label;
      button.setAttribute('aria-label', `Copy ${getContext()?.name || 'component'} for AI — ${name}`);
      button.title = name;
      status.textContent = message || `${name} · ${variant.value === '' ? 'No specific variant' : 'Selected variant'}`;
      modeLabel.textContent = mode.value === 'design' ? 'Apply design' : 'Motion only';
      trigger.disabled = busy;
      for (const option of modeOptions) option.setAttribute('aria-checked', String(option.getAttribute('data-copy-mode') === mode.value));
      for (const option of variantOptions.querySelectorAll('[data-copy-variant]')) option.setAttribute('aria-checked', String(option.getAttribute('data-copy-variant') === variant.value));
    }
    function reset(enabled) {
      revision++; intent++; busy = false; delivery = null; choices = []; fingerprint = '';
      closeMenu();
      group.hidden = !enabled; button.hidden = !enabled;
      mode.value = 'design'; mode.disabled = false;
      variant.replaceChildren(newOption('', 'No specific variant'));
      variant.value = ''; variant.disabled = true; variantRow.hidden = true;
      button.disabled = false; label.textContent = 'Copy for AI'; display();
    }
    function newOption(value, text) {
      const option = document.createElement('option'); option.value = value; option.textContent = text; return option;
    }
    async function refresh() {
      if (group.hidden || busy) return;
      const token = revision, context = getContext();
      if (!context) return;
      try {
        const resolved = delivery || await resolveDelivery(context.path);
        if (token !== revision || busy || getContext()?.path !== context.path) return;
        const next = deliveryApi.variants(resolved, readSnapshot(context.path));
        const signature = JSON.stringify(next);
        delivery = resolved;
        if (signature === fingerprint) return;
        const hadSelection = variant.value !== '';
        choices = next; fingerprint = signature; intent++;
        variant.replaceChildren(newOption('', 'No specific variant'), ...choices.map((choice, index) => {
          const values = [...Object.entries(choice.props || {}), ...Object.entries(choice.slots || {}), ...(choice.theme ? [['theme', choice.theme]] : [])];
          return newOption(String(index), `${choice.component} · ${values.map(([key,value]) => `${key}: ${value}`).join(' · ')}`);
        }));
        variant.value = ''; variant.disabled = !choices.length; variantRow.hidden = !choices.length;
        renderVariants();
        label.textContent = 'Copy for AI';
        display(hadSelection ? `${deliveryApi.modeInfo(mode.value).label} · Preview changed; choose a variant again` : undefined);
      } catch { /* Copy retries validation and reports the exact error. Never select fallback values. */ }
    }
    async function copy() {
      if (busy || group.hidden) return;
      const context = getContext(); if (!context) return;
      const token = revision, choiceToken = ++intent, selectedMode = mode.value, selectedVariant = variant.value;
      closeMenu();
      const modeName = deliveryApi.modeInfo(selectedMode).label;
      busy = true; button.disabled = true; mode.disabled = true; variant.disabled = true;
      label.textContent = 'Copying…'; display(`Copying · ${modeName}`);
      try {
        readSnapshot(context.path); // Fail closed on stale or loading frames even without a target variant.
        const resolved = await resolveDelivery(context.path);
        if (token !== revision || choiceToken !== intent || getContext()?.path !== context.path || mode.value !== selectedMode || variant.value !== selectedVariant) throw Error('Selection changed; copy again for the current component and mode.');
        const snapshot = readSnapshot(context.path);
        const index = selectedVariant === '' ? null : Number(selectedVariant);
        if (index !== null && JSON.stringify(deliveryApi.variants(resolved, snapshot)[index]) !== JSON.stringify(choices[index])) throw Error('Preview changed; choose the target variant again before copying.');
        const text = deliveryApi.format(resolved, snapshot, {mode:selectedMode, variantIndex:index});
        await writeClipboard(text);
        if (token !== revision || choiceToken !== intent) return;
        label.textContent = 'Copied'; display(`Copied · ${modeName} · ${index === null ? 'No specific variant' : 'Selected variant'}`);
        showToast(`${context.name}: copied — ${modeName}`);
      } catch(error) {
        if (token !== revision || choiceToken !== intent) return;
        label.textContent = 'Copy failed'; display(`Copy failed · ${modeName}`); showToast(error.message || 'Prompt copy failed');
      } finally {
        if (token === revision) {
          busy = false; button.disabled = false; mode.disabled = false; variant.disabled = !choices.length;
          trigger.disabled = false;
          schedule(() => { if (token === revision && choiceToken === intent && !busy) label.textContent = 'Copy for AI'; });
          void refresh();
        }
      }
    }
    function modeChanged() { intent++; label.textContent = 'Copy for AI'; display(); }
    function variantChanged() { intent++; label.textContent = 'Copy for AI'; display(); }
    mode.addEventListener('change', modeChanged);
    variant.addEventListener('change', variantChanged);
    for (const option of modeOptions) option.addEventListener('click', () => { mode.value = option.getAttribute('data-copy-mode'); modeChanged(); closeMenu(true); });
    trigger.addEventListener('click', () => menu.hidden ? openMenu() : closeMenu());
    trigger.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); openMenu(event.key === 'ArrowUp'); }
    });
    menu.addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeMenu(true); return; }
      const options = [...menu.querySelectorAll('[role="menuitemradio"]')];
      const index = options.indexOf(document.activeElement);
      if (['ArrowDown','ArrowUp','Home','End'].includes(event.key)) {
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
        options[next]?.focus();
      }
    });
    document.addEventListener('pointerdown', event => { if (!group.contains(event.target)) closeMenu(); });
    document.addEventListener('focusin', event => { if (!group.contains(event.target)) closeMenu(); });
    global.addEventListener?.('blur', () => closeMenu());
    return Object.freeze({reset, refresh, copy});
  }
  global.AiseeCopyAiControls = Object.freeze({create});
})(typeof window === 'undefined' ? globalThis : window);
