import React from 'react';

export function PoeFrame({ title, meta, children, className = '' }) {
  return (
    <section className={`poe-frame poe-ornate ${className}`}>
      <header className="poe-panel-header">
        <span>{title}</span>
        {meta && <span className="poe-subtle">{meta}</span>}
      </header>
      <div className="poe-panel-body">{children}</div>
    </section>
  );
}
