import type { HTMLAttributes } from 'react';
export type TagVariant = 'latest' | 'baseline' | 'target' | 'neutral' | 'help' | 'opinion' | 'discussion' | 'comparison' | 'danger';
export interface TagProps extends HTMLAttributes<HTMLSpanElement> { variant?: TagVariant; }
export function Tag({ variant = 'neutral', className = '', ...props }: TagProps) { return <span className={`aisee-tag aisee-tag--${variant} ${className}`.trim()} {...props} />; }
