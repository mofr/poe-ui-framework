import React, { createContext, useContext, useState } from 'react';
import './PoeTabBar.css';

// Tablist owning the shared baseline rail and the selection. It knows which tab is active (`selected`
// = a tab's `name`) so the active plate and separator logic are the bar's concern, not each tab's.
// Compose <PoeTab name="…"> children inside it.
interface PoeTabBarCtx {
  selected?: string;
  onSelect?: (name: string) => void;
}
const PoeTabBarContext = createContext<PoeTabBarCtx | null>(null);

/** Read the enclosing PoeTabBar's selection state (used by PoeTab). */
export const usePoeTabBar = () => useContext(PoeTabBarContext);

// Number of PoeTabBar.separator-N.png sprites; the bar round-robins them between tabs. Bump when adding one.
const SEP_VARIANTS = 2;

export interface PoeTabBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** `name` of the active tab (controlled — pair with `onSelect` to switch). */
  selected?: string;
  /** Initial active tab (uncontrolled — the bar then owns switching itself). */
  defaultSelected?: string;
  /** Fires with the clicked tab's `name` (both modes). */
  onSelect?: (name: string) => void;
  /** Horizontal space around tabs/separators, in px (default 0). */
  gap?: number;
}

export function PoeTabBar({ selected, defaultSelected, onSelect, gap = 0, children, className = '', style, ...props }: PoeTabBarProps) {
  // Controlled/uncontrolled à la <input>: an explicit `selected` wins; otherwise internal state
  // seeded from `defaultSelected` makes clicking just work. `onSelect` fires either way.
  const [internal, setInternal] = useState(defaultSelected);
  const value = selected !== undefined ? selected : internal;
  const handleSelect = (name: string) => {
    if (selected === undefined) setInternal(name);
    onSelect?.(name);
  };
  // Divider sprites between adjacent tabs, injected by the bar (a bar concern, not a per-tab one).
  // Each separator cycles through the -1..N variants; add a sprite + CSS rule and bump SEP_VARIANTS.
  const items = React.Children.toArray(children);
  return (
    <PoeTabBarContext.Provider value={{ selected: value, onSelect: handleSelect }}>
      <div
        role="tablist"
        className={`poe-tab-bar ${className}`.trim()}
        style={{ '--poe-tab-gap': `${gap}px`, ...style } as React.CSSProperties}
        {...props}
      >
        {items.map((child, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="poe-tab-bar__sep" data-sep={(i - 1) % SEP_VARIANTS + 1} aria-hidden="true" />}
            {child}
          </React.Fragment>
        ))}
      </div>
    </PoeTabBarContext.Provider>
  );
}
