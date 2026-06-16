import React from 'react';

export function PoeFrame({
  title,
  meta,
  children,
  className = '',
  material = 'stone',
  compact = false,
  selected = false,
  active = false,
  cornered = false,
  as: Component = 'section',
}) {
  const classes = [
    'poe-frame',
    'poe-ornate',
    `poe-frame--${material}`,
    compact && 'poe-frame--compact',
    selected && 'is-selected',
    active && 'is-active',
    cornered && 'poe-cornered',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Component className={classes} data-selected={selected || undefined} data-active={active || undefined}>
      {(title || meta) && (
        <header className="poe-panel-header">
          {title && <span>{title}</span>}
          {meta && <span className="poe-subtle">{meta}</span>}
        </header>
      )}
      <div className="poe-panel-body">{children}</div>
    </Component>
  );
}
