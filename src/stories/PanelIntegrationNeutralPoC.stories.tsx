import React from 'react';
import { PoePanel } from '../components/primitives/PoePanel.tsx';
// PoC bg-baseline neutral maps — clean baseline = OUR cracked-stone-2 surface (LaMa dropped for panels),
// tone-matched; baseline smoothed to a tone, observed kept sharp. NOT wired into the live component (see docs/FRAME-FIDELITY.md).
import b1 from './neutral-poc/slim-dark-1.bgneutral.png';
import b2 from './neutral-poc/slim-dark-2.bgneutral.png';
import b4 from './neutral-poc/slim-dark-4.bgneutral.png';
import b5 from './neutral-poc/slim-dark-5.bgneutral.png';
import crackedStone2 from '../assets/backgrounds/cracked-stone-2.png';
import matteStone2 from '../assets/backgrounds/matte-stone-2.png';
import solidBlack1 from '../assets/backgrounds/solid-black-1.png';

const BG: Record<string, string> = { 'slim-dark-1': b1, 'slim-dark-2': b2, 'slim-dark-4': b4, 'slim-dark-5': b5 };

// Real reconstruction surfaces first (where it must look right), then foreign colours to expose neutrality.
const BACKGROUNDS: { name: string; css: string; fg: string }[] = [
  { name: 'cracked-stone-2 · main content', css: `#241f18 url(${crackedStone2}) center / 350px`, fg: '#d3c6ad' },
  { name: 'matte-stone-2 · header', css: `#241f18 url(${matteStone2}) center / 700px`, fg: '#d3c6ad' },
  { name: 'solid-black-1 · panel interior', css: `#0a0a0a url(${solidBlack1}) center / 431px`, fg: '#9a9a9a' },
  { name: 'parchment · foreign', css: '#d9c9a3', fg: '#5a4a2a' },
  { name: 'slate blue · foreign', css: '#3a5f8a', fg: '#eaf2fb' },
];

// Panels now composite integration with NORMAL (live), so no blend override needed here. The two variants
// differ only in the MAP: legacy stone raster vs the bg-baseline neutral relight map.
const W = 210, H = 108;
const Panel = ({ frame, neutral, fg }: { frame: string; neutral?: boolean; fg: string }) => (
  <figure style={{ margin: 0, textAlign: 'center' }}>
    <PoePanel
      frame={frame as never}
      surface="none"
      style={{ width: W, height: H, ...(neutral ? { '--src-integration': `url(${BG[frame]})` } : {}) } as React.CSSProperties}
    />
    <figcaption style={{ marginTop: 9, font: '10px system-ui', color: fg, opacity: 0.85 }}>
      {neutral ? 'neutral · bg baseline' : 'legacy stone map'}
    </figcaption>
  </figure>
);

const Row = ({ bg, frame }: { bg: typeof BACKGROUNDS[number]; frame: string }) => (
  <div style={{ background: bg.css, padding: 24, borderRadius: 6, display: 'flex', gap: 40, alignItems: 'flex-start' }}>
    <div style={{ width: 110, paddingTop: 40, font: '600 11px/1.4 system-ui', color: bg.fg }}>{bg.name}</div>
    <Panel frame={frame} fg={bg.fg} />
    <Panel frame={frame} neutral fg={bg.fg} />
  </div>
);

export default {
  title: 'PoC/Panel Integration Neutral',
  parameters: { bg: 'dark', layout: 'padded' },
};

// One frame across real + foreign backgrounds; switch the frame in Controls. Both composited NORMAL.
export const Comparison = {
  render: (args: { frame: string }) => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 820 }}>
      <p style={{ font: '11px/1.5 system-ui', color: '#aab4c0', margin: 0, maxWidth: 760 }}>
        <code>surface="none"</code>, so only frame + halo show. <b>legacy stone map</b> = the committed stone
        raster (now composited normal, live). <b>bg baseline</b> = neutral relight map using OUR
        cracked-stone-2 surface as the clean baseline (tone-matched, baseline-only smoothed so the shadow stays crisp), LaMa-free. Should match on
        the stone rows; off-stone the legacy drags stone colour, the neutral stays clean.
      </p>
      {BACKGROUNDS.map(bg => <Row key={bg.name} bg={bg} frame={args.frame} />)}
    </div>
  ),
  args: { frame: 'slim-dark-1' },
  argTypes: { frame: { control: 'select', options: Object.keys(BG) } },
};

// All four frames on the real main-content surface: legacy map vs bg-baseline neutral.
export const AllOnCrackedStone = {
  render: () => (
    <div style={{ background: `#241f18 url(${crackedStone2}) center / 350px`, padding: 30, borderRadius: 6, display: 'flex', gap: 40, flexWrap: 'wrap' }}>
      {Object.keys(BG).map(frame => (
        <div key={frame} style={{ textAlign: 'center' }}>
          <div style={{ font: '600 11px system-ui', color: '#d3c6ad', marginBottom: 12 }}>{frame}</div>
          <div style={{ display: 'flex', gap: 22 }}>
            <Panel frame={frame} fg="#d3c6ad" />
            <Panel frame={frame} neutral fg="#d3c6ad" />
          </div>
        </div>
      ))}
    </div>
  ),
};
