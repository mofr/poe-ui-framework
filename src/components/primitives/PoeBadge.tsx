import React from 'react';

export interface PoeBadgeProps {
  children?: React.ReactNode;
  /** Maps to a .poe-badge class (e.g. 'corrupt', 'rare', 'magic', …). */
  type?: string;
  title?: string;
  className?: string;
}

export function PoeBadge({ children, type = 'corrupt', title, className = '' }: PoeBadgeProps) {
  const classes = ['poe-badge', type, className].filter(Boolean).join(' ');
  return <span className={classes} title={title}>{children}</span>;
}
