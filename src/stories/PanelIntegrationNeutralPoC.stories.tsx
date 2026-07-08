import React from 'react';
import { PoePanel } from '../components/primitives/PoePanel.tsx';
// PoC neutral relight maps — TWO ways to get the clean baseline (see docs/FRAME-FIDELITY.md), NOT wired
// into the live component. Committed under src/stories/neutral-poc/.
//   *.neutral.png   — LaMa inpaint baseline (fails where the reference is a dense mess of UI)
//   *.bgneutral.png — OUR surface texture as baseline (cracked-stone-2), tone-matched + pre-blur=3
import l1 from './neutral-poc/slim-dark-1.neutral.png';
import l2 from './neutral-poc/slim-dark-2.neutral.png';
import l4 from './neutral-poc/slim-dark-4.neutral.png';
import l5 from './neutral-poc/slim-dark-5.neutral.png';
import b1 from './neutral-poc/slim-dark-1.bgneutral.png';
import b2 from './neutral-poc/slim-dark-2.bgneutral.png';
import b4 from './neutral-poc/slim-dark-4.bgneutral.png';
import b5 from './neutral-poc/slim-dark-5.bgneutral.png';
import crackedStone2 from '../assets/backgrounds/cracked-stone-2.png';
import matteStone2 from '../assets/backgrounds/matte-stone-2.png';
import solidBlack1 from '../assets/backgrounds/solid-black-1.png';

const LAMA: Record<string, string> = { 'slim-dark-1': l1, 'slim-dark-2': l2, 'slim-dark-4': l4, 'slim-dark-5': l5 };
const BG: Record<string, string> = { 'slim-dark-1': b1, 'slim-dark-2': b2, 'slim-dark-4': b4, 'slim-dark-5': b5 };

// Real reconstruction surfaces first (where it must look right), then foreign colours to expose neutrality.
const BACKGROUNDS: { name: string; css: string; fg: string }[] = [
  { name: 'cracked-stone-2 · main content', css: `#241f18 url(${crackedStone2}) center / 350px`, fg: '#d3c6ad' },
  { name: 'matte-stone-2 · header', css: `#241f18 url(${matteStone2}) center / 700px`, fg: '#d3c6ad' },
  { name: 'solid-black-1 · panel interior', css: `#0a0a0a url(${solidBlack1}) center / 431px`, fg: '#9a9a9a' },
  { name: 'parchment · foreign', css: '#d9c9a3', fg: '#5a4a2a' },
  { name: 'slate blue · foreign', css: '#3a5f8a', fg: '#eaf2fb' },
];

// Force NORMAL compositing on `.poc-normal` (default panel rule is multiply). Going live: opt-in per-frame.
const PocStyles = () => (
  <style>{`.poc-normal .poe-panel__integration { mix-blend-mode: normal !important; }`}</style>
);

type Variant = 'stone' | 'lama' | 'bg';
const VARIANTS: { key: Variant; label: string }[] = [
  { key: 'stone', label: 'legacy stone × multiply' },
  { key: 'lama', label: 'neutral · LaMa baseline' },
  { key: 'bg', label: 'neutral · bg baseline' },
];

const W = 210, H = 108;
const Panel = ({ frame, variant, fg }: { frame: string; variant: Variant; fg: string }) => {
  const src = variant === 'lama' ? LAMA[frame] : variant === 'bg' ? BG[frame] : null;
  return (
    <figure style={{ margin: 0, textAlign: 'center' }}>
      <PoePanel
        frame={frame as never}
        surface="none"
        className={variant === 'stone' ? '' : 'poc-normal'}
        style={{ width: W, height: H, ...(src ? { '--src-integration': `url(${src})` } : {}) } as React.CSSProperties}
      />
      <figcaption style={{ marginTop: 9, font: '10px system-ui', color: fg, opacity: 0.85 }}>
        {VARIANTS.find(v => v.key === variant)!.label}
      </figcaption>
    </figure>
  );
};

const Row = ({ bg, frame }: { bg: typeof BACKGROUNDS[number]; frame: string }) => (
  <div style={{ background: bg.css, padding: 24, borderRadius: 6, display: 'flex', gap: 30, alignItems: 'flex-start' }}>
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
        <code>surface="none"</code>, so only frame + halo show. <b>legacy stone × multiply</b> = current live.
        {' '}<b>LaMa baseline</b> = neutral map from a LaMa-inpainted clean plate (degrades where the
        reference is a dense mess). <b>bg baseline</b> = neutral map using OUR cracked-stone-2 surface as the
        clean baseline (tone-matched, pre-blur=3), LaMa-free. First three rows are the real reconstruction
        surfaces; last two are foreign colours.
      </p>
      {BACKGROUNDS.map(bg => <Row key={bg.name} bg={bg} frame={args.frame} />)}
    </div>
  ),
  args: { frame: 'slim-dark-1' },
  argTypes: { frame: { control: 'select', options: Object.keys(LAMA) } },
};

// All four frames, 3 variants each, on the real main-content surface.
export const AllOnCrackedStone = {
  render: () => (
    <div style={{ background: `#241f18 url(${crackedStone2}) center / 350px`, padding: 30, borderRadius: 6, display: 'flex', gap: 40, flexWrap: 'wrap' }}>
      <PocStyles />
      {Object.keys(LAMA).map(frame => (
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
