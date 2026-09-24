/* Content dates are explicit: opening a page or rebuilding must not renew NEW. */
(function (global) {
  'use strict';
  const DAY = 86400000;
  const TIME_ZONE = 'Asia/Taipei';
  const dates = Object.freeze({
    'README': '2026-09-24',
    'components/AutomationRunner/AutomationRunner.html': '2026-09-21',
    'components/ThinkingIndicator/ThinkingIndicator.html': '2026-09-21',
    'components/ConfirmationDialog/ConfirmationDialog.html': '2026-09-21',
    'components/TooltipToast/TooltipToast.html': '2026-09-20',
    'components/Button/Button.html': '2026-09-18',
    'components/Input/Input.html': '2026-09-18',
    'components/SegmentedChoice/SegmentedChoice.html': '2026-09-18',
    'components/PlanCardCurrent/PlanCardCurrent.html': '2026-09-18',
    'components/FeatureOverview/FeatureOverview.html': '2026-09-18',
    'components/Card/Card.html': '2026-09-18',
    'components/Checkbox/Checkbox.html': '2026-09-18',
    'components/QuantityStepper/QuantityStepper.html': '2026-09-18',
    'components/Select/Select.html': '2026-09-18',
    'components/Toggle/Toggle.html': '2026-09-18',
    'components/TagInput/TagInput.html': '2026-09-11',
    'components/ToggleSelectionGroup/ToggleSelectionGroup.html': '2026-09-18',
    'components/Tabs/Tabs.html': '2026-09-18',
    'components/SidebarNavigation/SidebarNavigation.html': '2026-09-18',
    'components/TreeNav/TreeNav.html': '2026-09-16',
    'preview/avatar.html': '2026-09-18',
    'components/Badge/Badge.html': '2026-09-11',
    'components/Steps/Steps.html': '2026-09-18',
    'components/EmptyState/EmptyState.html': '2026-09-18',
    'components/StatCardCurrent/StatCardCurrent.html': '2026-09-18',
    'components/CreditBar/CreditBar.html': '2026-09-15',
    'components/Dialog/Dialog.html': '2026-09-17',
    'components/NotificationBell/NotificationBell.html': '2026-09-20'
  });
  function dateOrdinal(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
    const timestamp = Date.parse(value + 'T00:00:00Z');
    if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== value) return NaN;
    return timestamp / DAY;
  }
  function calendarDate(now = new Date()) {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
    const get = type => parts.find(part => part.type === type).value;
    return `${get('year')}-${get('month')}-${get('day')}`;
  }
  function isRecent(updatedAt, now = new Date()) {
    const age = dateOrdinal(calendarDate(now)) - dateOrdinal(updatedAt);
    return Number.isFinite(age) && age >= 0 && age < 7;
  }
  function dateFor(path, explicitDate) { return explicitDate || dates[path]; }
  function apply(doc, fallbackDate, now = new Date()) {
    doc.querySelectorAll('.aisee-content-new, .nav-new-label').forEach(badge => {
      const date = badge.dataset.updatedAt || fallbackDate;
      const visible = isRecent(date, now);
      badge.hidden = !visible;
      if (visible) badge.style.removeProperty('display');
      else badge.style.setProperty('display', 'none', 'important');
    });
  }
  global.AiseeUpdates = Object.freeze({ dates, dateFor, isRecent, calendarDate, apply, timeZone: TIME_ZONE });
  if (!global.document) return;
  const doc = global.document;
  const root = new URL('../', doc.currentScript.src);
  const relativePath = decodeURIComponent(global.location.pathname).slice(decodeURIComponent(root.pathname).length);
  const isPortal = ['', 'index.html', 'aisee-design-system-preview.html'].includes(relativePath);
  const pageDate = dateFor(isPortal ? 'README' : relativePath);
  function refresh() {
    // Navigation owns each item's date; static README labels use the README date.
    if (isPortal) {
      doc.querySelectorAll('.nav-new-label').forEach(badge => {
        if (badge.closest('[data-path]')) return;
        applyBadge(badge, pageDate);
      });
    } else apply(doc, pageDate);
  }
  function applyBadge(badge, date) {
    const visible = isRecent(badge.dataset.updatedAt || date);
    badge.hidden = !visible;
    if (visible) badge.style.removeProperty('display');
    else badge.style.setProperty('display', 'none', 'important');
  }
  function refreshAll() {
    refresh();
    global.dispatchEvent(new Event('aisee:updates-refresh'));
  }
  function scheduleMidnight() {
    // Taipei has a fixed UTC+8 offset; expiry follows calendar dates rather than a rolling-hour window.
    const delay = DAY - ((Date.now() + 8 * 3600000) % DAY);
    global.setTimeout(() => { refreshAll(); scheduleMidnight(); }, delay);
  }
  function start() {
    // A preview iframe may be replaced while its DOMContentLoaded is queued.
    const target = doc.body || doc.documentElement;
    if (!target) return;
    refresh();
    new MutationObserver(refresh).observe(target, { childList: true, subtree: true });
    scheduleMidnight();
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
  doc.addEventListener('visibilitychange', () => { if (!doc.hidden) refreshAll(); });
  global.addEventListener('pageshow', refreshAll);
})(globalThis);
