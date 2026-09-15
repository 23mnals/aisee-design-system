import { useEffect, useRef, type CSSProperties, type HTMLAttributes } from 'react';
import accountAvatarSprite from '../../assets/avatar/dapp-avatar-set.svg';
import socialAvatarSprite from '../../assets/avatar/social-avatar-set.svg';
import platformXMark from '../../assets/avatar/platform-x-mark.svg';

export type AvatarKind = 'account' | 'social';
export type PostOrigin = 'plan' | 'manual';

export const AISEE_AVATAR_COUNTS = { account: 22, social: 24 } as const;

const SPRITES = {
  account: { src: accountAvatarSprite, width: 1072 },
  social: { src: socialAvatarSprite, width: 1168 },
} as const;

function hashSeed(seed: string) {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Returns a stable one-based avatar ID for the same user or social account seed. */
export function getAiseeAvatarIndex(seed: string | number, kind: AvatarKind = 'account') {
  return hashSeed(String(seed)) % AISEE_AVATAR_COUNTS[kind] + 1;
}

function normalizeIndex(kind: AvatarKind, index?: number, seed?: string | number) {
  const count = AISEE_AVATAR_COUNTS[kind];
  if (index === undefined) return seed === undefined ? 1 : getAiseeAvatarIndex(seed, kind);
  const integer = Number.isFinite(index) ? Math.trunc(index) : 1;
  return ((integer - 1) % count + count) % count + 1;
}

function prefixSvgIds(svg: SVGSVGElement, prefix: string) {
  const replacements = new Map<string, string>();
  svg.querySelectorAll('[id]').forEach((node) => {
    const oldId = node.id;
    const newId = `${prefix}${oldId}`;
    replacements.set(oldId, newId);
    node.id = newId;
  });
  svg.querySelectorAll('*').forEach((node) => {
    for (const attribute of [...node.attributes]) {
      const value = attribute.value
        .replace(/url\(#([^)]+)\)/g, (match, id: string) => replacements.has(id) ? `url(#${replacements.get(id)})` : match)
        .replace(/^#(.+)$/, (match, id: string) => replacements.has(id) ? `#${replacements.get(id)}` : match);
      if (value !== attribute.value) node.setAttribute(attribute.name, value);
    }
  });
}

interface AvatarSpriteProps { kind: AvatarKind; index: number; animated: boolean; }

function AvatarSprite({ kind, index, animated }: AvatarSpriteProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const sprite = SPRITES[kind];
  const x = 20 + (index - 1) * 48;

  useEffect(() => {
    if (!animated) return undefined;
    const svg = svgRef.current;
    if (!svg) return undefined;
    const controller = new AbortController();

    fetch(sprite.src, { signal: controller.signal })
      .then((response) => response.text())
      .then((text) => {
        if (controller.signal.aborted) return;
        const source = new DOMParser().parseFromString(text, 'image/svg+xml').documentElement;
        svg.innerHTML = source.innerHTML;
        const label = kind === 'account' ? String(index).padStart(3, '0') : String(index);
        const selected = [...svg.querySelectorAll<SVGGElement>('g[id]')].find((group) => group.id.endsWith(`=${label}`));
        const eye = selected && [...selected.querySelectorAll<SVGGElement>('g[id]')].find((group) => group.id.includes('Mask Group'));
        if (eye) {
          eye.classList.add('aisee-avatar__eye');
          [...eye.querySelectorAll<SVGElement>('rect[rx]')].at(-1)?.classList.add('aisee-avatar__pupil');
        }
        prefixSvgIds(svg, `aisee-avatar-${kind}-${index}-${Math.random().toString(36).slice(2)}-`);
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) console.warn('AISEE Avatar animation source could not be loaded.', error);
      });

    return () => controller.abort();
  }, [animated, index, kind, sprite.src]);

  return <svg ref={svgRef} viewBox={`${x} 20 24 24`} aria-hidden="true">
    <image href={sprite.src} width={sprite.width} height="64" />
  </svg>;
}

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Website account avatars are square; social fallbacks are circular with the approved gray outline. */
  kind?: AvatarKind;
  /** One-based library ID. Out-of-range values wrap into the selected approved source library. */
  index?: number;
  /** Stable user/account key used when index is omitted. The same seed always resolves to the same avatar. */
  seed?: string | number;
  size?: number | string;
  animated?: boolean;
  label?: string;
}

export function Avatar({ kind = 'account', index, seed, size = 32, animated = false, label, className = '', style, ...props }: AvatarProps) {
  const resolvedIndex = normalizeIndex(kind, index, seed);
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!animated) return undefined;
    const root = rootRef.current;
    if (!root || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;

    const follow = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy) || 1;
      const travel = Math.min(1.8, distance * .035);
      root.style.setProperty('--aisee-avatar-eye-x', `${dx / distance * travel}px`);
      root.style.setProperty('--aisee-avatar-eye-y', `${dy / distance * travel}px`);
      root.classList.add('is-pointer-following');
    };
    const reset = () => {
      root.classList.remove('is-pointer-following');
      root.style.removeProperty('--aisee-avatar-eye-x');
      root.style.removeProperty('--aisee-avatar-eye-y');
    };

    window.addEventListener('pointermove', follow, { passive: true });
    window.addEventListener('blur', reset);
    window.addEventListener('mouseleave', reset);
    return () => {
      window.removeEventListener('pointermove', follow);
      window.removeEventListener('blur', reset);
      window.removeEventListener('mouseleave', reset);
    };
  }, [animated]);

  const dimensions: CSSProperties = { width: size, height: size, ...style };
  return <span
    ref={rootRef}
    className={`aisee-avatar aisee-avatar--${kind}${animated ? ' is-animated' : ''} ${className}`.trim()}
    style={dimensions}
    role={label ? 'img' : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : true}
    data-avatar-kind={kind}
    data-avatar-index={resolvedIndex}
    {...props}
  >
    <AvatarSprite key={`${kind}-${resolvedIndex}-${animated}`} kind={kind} index={resolvedIndex} animated={animated} />
  </span>;
}

export interface SocialAccountAvatarProps extends Omit<AvatarProps, 'kind'> {
  postOrigin: PostOrigin;
  platformIconSrc?: string;
  platformLabel?: string;
}

export function SocialAccountAvatar({ postOrigin, platformIconSrc = platformXMark, platformLabel = 'X', className = '', ...avatarProps }: SocialAccountAvatarProps) {
  return <span className={`aisee-social-account-avatar ${className}`.trim()} data-post-origin={postOrigin}>
    <Avatar {...avatarProps} kind="social" />
    <span className={`aisee-social-account-avatar__platform aisee-social-account-avatar__platform--${postOrigin}`}>
      <img src={platformIconSrc} alt={platformLabel} />
    </span>
  </span>;
}
