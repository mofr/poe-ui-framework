import React from 'react';

// Semantic typography. `variant` maps to a .poe-text-* role (font/size/colour come from the role +
// the --poe-fs-* / --poe-font-* tokens — never hard-code sizes at the call site). Override the element
// with `as` (default: block for display/heading/label, inline for body/meta/number).
export type PoeTextVariant = 'display' | 'heading' | 'label' | 'body' | 'meta' | 'number' | 'rune';

export interface PoeTextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: PoeTextVariant;
  /** Element/component to render as (default: block for display/heading/label, inline otherwise). */
  as?: React.ElementType;
}

const INLINE = new Set<PoeTextVariant>(['body', 'meta', 'number', 'rune']);

export function PoeText({ variant = 'body', as, children, className = '', style, ...props }: PoeTextProps) {
  const Tag = as || (INLINE.has(variant) ? 'span' : 'div');
  return <Tag className={`poe-text-${variant} ${className}`.trim()} style={style} {...props}>{children}</Tag>;
}
