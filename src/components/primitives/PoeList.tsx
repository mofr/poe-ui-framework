import React from 'react';
import './PoeList.css';

// PoeList — the interior list structure, placed INSIDE a PoePanel (which supplies the heavy
// frame + surface, and the section title via its `header` slot). PoeList owns a separate, THIN
// ornament: a RULE with corner ornaments (the list's own top edge) and a divider repeated between
// rows. The ornament's side edges + lower corners fade out in the reference; only the top (rule)
// is traced/cut so far — when the sides are traced they extend the same edge-dark-1 asset.
//
// Content model = freeform children + a row kit: PoeList renders any children and auto-inserts a
// separator BETWEEN adjacent rows (n rows → n−1 separators). PoeListRow is the ready-made row.

export interface PoeListProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PoeList({ children, className = '', ...props }: PoeListProps) {
  const rows = React.Children.toArray(children).filter(Boolean);
  return (
    <div className={`poe-list ${className}`.trim()} {...props}>
      <div className="poe-list__body">
        <div className="poe-list__rule" />               {/* rule — the ornament's top edge */}
        {rows.map((row, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="poe-list__sep" />} {/* divider — between rows only */}
            {row}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// Omit the HTML `title` attribute — we repurpose `title` as the primary-line slot (ReactNode).
export interface PoeListRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Leading slot — typically an icon/avatar. */
  leading?: React.ReactNode;
  /** Primary line. */
  title?: React.ReactNode;
  /** Secondary line below the title. */
  meta?: React.ReactNode;
  /** Trailing slot — typically a value, aligned right. */
  trailing?: React.ReactNode;
  selected?: boolean;
}

// Slot layout: leading | main(title+meta) | trailing. Pass `children` instead for a freeform row.
export function PoeListRow({ leading, title, meta, trailing, selected, children, className = '', ...props }: PoeListRowProps) {
  const classes = ['poe-list-row', selected && 'is-selected', className].filter(Boolean).join(' ');
  if (children != null) {
    return <div className={classes} data-selected={selected || undefined} {...props}>{children}</div>;
  }
  return (
    <div className={classes} data-selected={selected || undefined} {...props}>
      {leading != null && <div className="poe-list-row__leading">{leading}</div>}
      <div className="poe-list-row__main">
        {title != null && <div className="poe-list-row__title">{title}</div>}
        {meta != null && <div className="poe-list-row__meta">{meta}</div>}
      </div>
      {trailing != null && <div className="poe-list-row__trailing">{trailing}</div>}
    </div>
  );
}
