import React from 'react';
import { PoePanel } from '../components/primitives/PoePanel.tsx';
// PoC neutral relight maps (generated per panel via tools/integration-neutral.py --blur=0; NOT wired into
// the live component — see docs/FRAME-FIDELITY.md). Committed under src/stories/neutral-poc/.
import sd1 from './neutral-poc/slim-dark-1.neutral.png';
import sd2 from './neutral-poc/slim-dark-2.neutral.png';
import sd4 from './neutral-poc/slim-dark-4.neutral.png';
import sd5 from './neutral-poc/slim-dark-5.neutral.png';
// Real reconstruction surfaces the panels actually sit on.
import crackedStone2 from '../assets/backgrounds/cracked-stone-2.png';
import matteStone2 from '../assets/backgrounds/matte-stone-2.png';
import solidBlack1 from '../assets/backgrounds/solid-black-1.png';

const NEUTRAL: Record<string, string> = {
  'slim-dark-1': sd1, 'slim-dark-2': sd2, 'slim-dark-4': sd4, 'slim-dark-5': sd5,
};

// Real reconstruction backgrounds first (that's where it has to look right), then two foreign colours to
// expose neutrality (the halo must darken/lift only, never drag stone colour in).
const BACKGROUNDS: { name: string; css: string; fg: string }[] = [
  { name: 'cracked-stone-2 · main content', css: `#241f18 url(${crackedStone2}) center / 350px`, fg: '#d3c6ad' },
  { name: 'matte-stone-2 · header', css: `#241f18 url(${matteStone2}) center / 700px`, fg: '#d3c6ad' },
  { name: 'solid-black-1 · panel interior', css: `#0a0a0a url(${solidBlack1}) center / 431px`, fg: '#9a9a9a' },
  { name: 'parchment · foreign', css: '#d9c9a3', fg: '#5a4a2a' },
  { name: 'slate blue · foreign', css: '#3a5f8a', fg: '#eaf2fb' },
];

// Force NORMAL compositing on `.poc-normal` instances (default panel rule is multiply). Going live this
// becomes an opt-in per-frame var (--integration-blend: normal); here a scoped override keeps it isolated.
const PocStyles = () => (
  <style>{`.poc-normal .poe-panel__integration { mix-blend-mode: normal !important; }`}</style>
);

type Variant = 'stone-multiply' | 'stone-normal' | 'neutral-normal';
const VARIANTS: { key: Variant; label: string }[] = [
  { key: 'stone-multiply', label: 'old cut × multiply' },
  { key: 'stone-normal', label: 'old cut × normal' },
  { key: 'neutral-normal', label: 'new cut × normal' },
];

const W = 210, H = 108;
const Panel = ({ frame, variant, fg }: { frame: string; variant: Variant; fg: string }) => (
  <figure style={{ margin: 0, textAlign: 'center' }}>
    <PoePanel
      frame={frame as never}
      surface="none"
      className={variant === 'stone-multiply' ? '' : 'poc-normal'}
      style={{ width: W, height: H, ...(variant === 'neutral-normal' ? { '--src-integration': `url(${NEUTRAL[frame]})` } : {}) } as React.CSSProperties}
    />
    <figcaption style={{ marginTop: 9, font: '10px system-ui', color: fg, opacity: 0.85 }}>
      {VARIANTS.find(v => v.key === variant)!.label}
    </figcaption>
  </figure>
);

const Row = ({ bg, frame }: { bg: typeof BACKGROUNDS[number]; frame: string }) => (
  <div style={{ background: bg.css, padding: 24, borderRadius: 6, display: 'flex', gap: 34, alignItems: 'flex-start' }}>
    <div style={{ width: 110, paddingTop: 40, font: '600 11px/1.4 system-ui', color: bg.fg }}>{bg.name}</div>
    {VARIANTS.map(v => <Panel key={v.key} frame={frame} variant={v.key} fg={bg.fg} />)}
  </div>
);

export default {
  title: 'PoC/Panel Integration Neutral',
  parameters: { bg: 'dark', layout: 'padded' },
};

// One frame across real + foreign backgrounds; switch the frame in Controls.
export const Comparison = {
  render: (args: { frame: string }) => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 980 }}>
      <PocStyles />
      <p style={{ font: '11px/1.5 system-ui', color: '#aab4c0', margin: 0, maxWidth: 900 }}>
        Interior is <code>surface="none"</code> so only frame + halo show. Three cuts of the SAME frame:
        {' '}<b>old cut × multiply</b> (current live behaviour) · <b>old cut × normal</b> (stone map, no
        blend) · <b>new cut × normal</b> (neutral relight map, blur=0). First three rows are the real
        reconstruction surfaces; last two are foreign colours to expose neutrality.
      </p>
      {BACKGROUNDS.map(bg => <Row key={bg.name} bg={bg} frame={args.frame} />)}
    </div>
  ),
  args: { frame: 'slim-dark-1' },
  argTypes: { frame: { control: 'select', options: Object.keys(NEUTRAL) } },
};

// All four convertible frames, 3 cuts each, on the real main-content surface.
export const AllOnCrackedStone = {
  render: () => (
    <div style={{ background: `#241f18 url(${crackedStone2}) center / 350px`, padding: 30, borderRadius: 6, display: 'flex', gap: 40, flexWrap: 'wrap' }}>
      <PocStyles />
      {Object.keys(NEUTRAL).map(frame => (
        <div key={frame} style={{ textAlign: 'center' }}>
          <div style={{ font: '600 11px system-ui', color: '#d3c6ad', marginBottom: 12 }}>{frame}</div>
          <div style={{ display: 'flex', gap: 22 }}>
            {VARIANTS.map(v => <Panel key={v.key} frame={frame} variant={v.key} fg="#d3c6ad" />)}
          </div>
        </div>
      ))}
    </div>
  ),
};
