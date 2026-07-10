import React from 'react';
import './PoeSeparator.css';

// Horizontal decorative rule that sits between stacked regions (e.g. the header ↔ body seam). Owned by
// neither neighbour — drop it as a sibling between them. Full-width; the rule sprite stretches across it.
export interface PoeSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PoeSeparator({ className = '', ...props }: PoeSeparatorProps) {
  return <div role="separator" aria-orientation="horizontal" className={`poe-separator ${className}`.trim()} {...props} />;
}
