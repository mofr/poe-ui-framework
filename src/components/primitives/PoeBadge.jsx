import React from 'react';

export function PoeBadge({ children, type = 'corrupt' }) {
  return <span className={`poe-badge ${type}`}>{children}</span>;
}
