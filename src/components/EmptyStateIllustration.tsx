import type { ImgHTMLAttributes } from 'react';
import illustration0 from '../../assets/empty-state/library/no-event.svg';
import illustration1 from '../../assets/empty-state/library/no-account.svg';
import illustration2 from '../../assets/empty-state/library/no-time-slot.svg';
import illustration3 from '../../assets/empty-state/library/nothing.svg';
import illustration4 from '../../assets/empty-state/library/no-report.svg';
import illustration5 from '../../assets/empty-state/library/no-credit.svg';
import illustration6 from '../../assets/empty-state/library/no-media.svg';
import illustration7 from '../../assets/empty-state/library/free-use.svg';
import illustration8 from '../../assets/empty-state/library/bound.svg';
import illustration9 from '../../assets/empty-state/library/nobody.svg';
import illustration10 from '../../assets/empty-state/library/link.svg';
import illustration12 from '../../assets/empty-state/library/plugin.svg';
import illustration13 from '../../assets/empty-state/library/successful.svg';
import illustration14 from '../../assets/empty-state/library/unlock.svg';

export const emptyStateIllustrations = {
  'no-event': { src: illustration0, label: "No event", feature: "yellow", nodeId: '42:11681' },
  'no-account': { src: illustration1, label: "No account", feature: "yellow", nodeId: '42:11795' },
  'no-time-slot': { src: illustration2, label: "No time slot", feature: "yellow", nodeId: '42:11856' },
  'nothing': { src: illustration3, label: "Nothing", feature: "analysis", nodeId: '42:11878' },
  'no-report': { src: illustration4, label: "No report", feature: "analysis", nodeId: '42:11895' },
  'no-credit': { src: illustration5, label: "No credit", feature: "credit", nodeId: '42:11925' },
  'no-media': { src: illustration6, label: "No media", feature: "yellow", nodeId: '42:11835' },
  'free-use': { src: illustration7, label: "Free use", feature: "post agent", nodeId: '42:11941' },
  'bound': { src: illustration8, label: "Bound", feature: "analysis", nodeId: '42:11820' },
  'nobody': { src: illustration9, label: "Nobody", feature: "yellow", nodeId: '42:11777' },
  'link': { src: illustration10, label: "Link", feature: "yellow", nodeId: '42:11696' },
  'plugin': { src: illustration12, label: "Plugin", feature: "yellow", nodeId: '42:11727' },
  'successful': { src: illustration13, label: "Successful", feature: "subscription", nodeId: '42:11910' },
  'unlock': { src: illustration14, label: "Unlock", feature: "subscription", nodeId: '42:11965' },
} as const;

export type EmptyStateIllustrationName = keyof typeof emptyStateIllustrations;
export interface EmptyStateIllustrationProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'> {
  name: EmptyStateIllustrationName;
  size?: number;
}

/** Original Figma exports. Their event and feature colors are intentionally paired. */
export function EmptyStateIllustration({ name, size = 48, alt = '', className = '', ...props }: EmptyStateIllustrationProps) {
  return <img {...props} className={`aisee-empty-state-illustration ${className}`.trim()} src={emptyStateIllustrations[name].src} alt={alt} width={size} height={size} />;
}
