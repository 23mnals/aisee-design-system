import { access, copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const outputRoot = join(projectRoot, 'assets', 'stemui');
const explicitRoot = process.env.STEMUI_ROOT?.trim();
const candidates = explicitRoot
  ? [explicitRoot]
  : [join(homedir(), 'stemui'), join(homedir(), 'aisee icon github')];

const assets = {
  'nav-overview.svg': 'line_categrary_layout.svg',
  'nav-analysis.svg': 'line_scan_analysis.svg',
  'nav-growth.svg': 'line_process_list.svg',
  'nav-improve-score.svg': 'line_calendar_task.svg',
  'nav-brand-influence.svg': 'line_earth_timezone.svg',
  'nav-engage.svg': 'line_bubble_message.svg',
  'nav-signal-feed.svg': 'line_single_feed.svg',
  'nav-keywords.svg': 'line_keyboard_keyword.svg',
  'nav-replies.svg': 'line_arrowup_send.svg',
  'nav-post.svg': 'line_file_social.svg',
  'nav-calendar.svg': 'line_calendar_schedule.svg',
  'nav-channels.svg': 'line_media_channel.svg',
  'nav-media.svg': 'line_movie_media.svg',
  'nav-verify.svg': 'line_arrow_rescan.svg',
  'nav-connection.svg': 'line_arrow_connect.svg',
  'action-bell.svg': 'fill_bell_notice.svg',
  'action-logout.svg': 'line_arrow_logout.svg',
  'action-plus.svg': 'line_plus_add.svg',
  'action-close.svg': 'line_x_close.svg',
  'action-check.svg': 'line_correct_done.svg',
  'avatar-user.svg': 'avatar_dapp_001.svg',
  'avatar-social-1.svg': 'avatar_social_1.svg',
  'avatar-social-2.svg': 'avatar_social_2.svg',
  'avatar-social-3.svg': 'avatar_social_3.svg',
  'platform-x.svg': 'platform=x.svg',
  'platform-linkedin.svg': 'platform=linkedin.svg',
  'platform-reddit.svg': 'platform=reddit.svg',
  'platform-medium.svg': 'platform=medium.svg',
  'platform-youtube.svg': 'platform=youtube.svg',
  'platform-tiktok.svg': 'platform=tiktok.svg',
  'platform-github.svg': 'platform=github.svg',
  'platform-google.svg': 'platform=google.svg'
};

const sourceRoot = await selectSourceRoot(candidates);
const packageFile = join(sourceRoot, 'packages', 'icons', 'package.json');
const svgRoot = join(sourceRoot, 'packages', 'icons', 'svg');
const packageJson = JSON.parse(await readFile(packageFile, 'utf8'));

await mkdir(outputRoot, { recursive: true });
const copied = [];
for (const [targetName, sourceName] of Object.entries(assets)) {
  const source = await findByBasename(svgRoot, sourceName);
  if (!source) throw new Error(`StemUI asset not found: ${sourceName}`);
  const target = join(outputRoot, targetName);
  await copyFile(source, target);
  const copiedSource = await readFile(target, 'utf8');
  await writeFile(target, `${copiedSource.trimEnd()}\n`);
  copied.push({ file: targetName, source: source.slice(svgRoot.length + 1) });
}

const manifest = {
  package: packageJson.name,
  version: packageJson.version,
  repository: 'https://github.com/qi15582378779/stemui',
  npm: 'https://www.npmjs.com/package/@stemui/icons',
  mode: 'read-only source snapshot',
  assets: copied
};
await writeFile(join(outputRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`Synced ${copied.length} StemUI assets from ${sourceRoot}`);
console.log(`Snapshot: ${outputRoot}`);

async function selectSourceRoot(roots) {
  for (const root of roots) {
    try {
      await access(join(root, 'packages', 'icons', 'package.json'));
      return resolve(root);
    } catch {
      // Try the next known local worktree.
    }
  }
  if (explicitRoot) throw new Error(`STEMUI_ROOT is invalid: ${explicitRoot}`);
  throw new Error('StemUI repository not found. Set STEMUI_ROOT to its local checkout.');
}

async function findByBasename(root, expected) {
  const { readdir } = await import('node:fs/promises');
  const entries = await readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(root, entry.name);
    if (entry.isDirectory()) {
      const nested = await findByBasename(fullPath, expected);
      if (nested) return nested;
    } else if (basename(fullPath) === expected) {
      return fullPath;
    }
  }
  return null;
}
