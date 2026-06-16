import React from 'react';

export function PoeBadge({ children, type = 'corrupt', title, className = '' }) {
  const classes = ['poe-badge', type, className].filter(Boolean).join(' ');
  return <span className={classes} title={title}>{children}</span>;
}
