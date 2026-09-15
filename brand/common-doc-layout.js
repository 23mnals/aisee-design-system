(() => {
  const page = document.documentElement.dataset.aiseeCommonPage;
  if (!page || document.querySelector('.aisee-common-document')) return;

  const pages = {
    foundations: ['dApp v6 Foundations', 'Current color, typography, layout and module-theme rules.'],
    'logo-animation': ['AIsee Logo Animation', 'Current cursor-following eye animation, idle motion and downloadable delivery assets.'],
    logo: ['Logo', 'Official mark and wordmark usage across sizes, backgrounds and compact placements.'],
    avatar: ['Avatar', 'Square website-registration avatars and circular outlined fallbacks for missing social-media profile images.'],
    colors: ['Color Palette', 'Brand, neutral and semantic color tokens used across AISEE.'],
    spacing: ['Spacing, Radii & Shadows', 'Current spacing scale, control and surface radii, and elevation levels.'],
    'display-type': ['Display Type — Karla', 'Karla display scale from hero statements to supporting body copy.'],
    'ui-type': ['UI Type — Karla', 'Karla interface hierarchy for labels, controls, data and supporting text.'],
    'update-tutorial': ['Update Tutorial Preview', 'Looping browser-extension update sequence and its current interaction rhythm.'],
    'install-tutorial': ['Install Tutorial Preview', 'Looping browser-extension installation sequence and its current interaction rhythm.'],
  };
  const copy = pages[page];
  if (!copy) return;

  const currentScript = document.currentScript;
  const existingTitle = document.body.querySelector(':scope > h1, :scope > main > h1');
  if (existingTitle?.textContent.trim().toLowerCase() === copy[0].toLowerCase()) {
    existingTitle.remove();
  }
  const showcase = document.body.querySelector(':scope > [data-aisee-common-showcase]');
  const content = [...document.body.childNodes].filter((node) => node !== currentScript && node !== showcase);
  const documentFrame = document.createElement('div');
  documentFrame.className = 'aisee-common-document';
  const intro = document.createElement('header');
  intro.className = 'aisee-common-intro';
  const title = document.createElement('h1');
  title.textContent = copy[0];
  const description = document.createElement('p');
  description.textContent = copy[1];
  intro.append(title, description);
  const sectionTitle = document.createElement('h2');
  sectionTitle.className = 'aisee-common-section-title';
  sectionTitle.textContent = 'Overview / Examples';
  const card = document.createElement('section');
  card.className = 'aisee-common-card';
  content.forEach((node) => card.append(node));
  documentFrame.append(intro);
  if (showcase) documentFrame.append(showcase);
  documentFrame.append(sectionTitle, card);
  document.body.append(documentFrame);
})();
