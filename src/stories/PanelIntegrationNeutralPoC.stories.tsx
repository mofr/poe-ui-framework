import React from 'react';
import { PoePanel } from '../components/primitives/PoePanel.tsx';
// PoC neutral relight maps (generated from each panel's mask via tools/integration-neutral.py; NOT wired
// into the live component yet — see docs/FRAME-FIDELITY.md). Committed under src/stories/neutral-poc/.
import sd1 from './neutral-poc/slim-dark-1.neutral.png';
import sd2 from './neutral-poc/slim-dark-2.neutral.png';
import sd4 from './neutral-poc/slim-dark-4.neutral.png';
import sd5 from './neutral-poc/slim-dark-5.neutral.png';

const NEUTRAL: Record<string, string> = {
  'slim-dark-1': sd1, 'slim-dark-2': sd2, 'slim-dark-4': sd4, 'slim-dark-5': sd5,
};

// Stress-test neutrality: a neutral halo must only darken/lift whatever is behind it — never drag the
// reference stone's colour/texture in. On the reference stone the two should match; off-stone the legacy
// stone×multiply tints toward stone, while the neutral map stays a clean shadow + warm rim.
const BACKGROUNDS: { name: string; css: string; fg: string }[] = [
  { name: 'reference stone', css: '#2c251b', fg: '#c9bda6' },
  { name: 'parchment', css: '#d9c9a3', fg: '#5a4a2a' },
  { name: 'slate blue', css: '#3a5f8a', fg: '#eaf2fb' },
  { name: 'teal', css: '#2f6d63', fg: '#e6fffa' },
  { name: 'crimson', css: '#7a2f34', fg: '#ffe6e6' },
  { name: 'near white', css: '#eceae4', fg: '#333' },
];

// THE MECHANISM UNDER TEST: a neutral relight map wants NORMAL compositing; the legacy stone map wants
// MULTIPLY. Here we force normal on `.poc-neutral` instances. Going live this becomes an opt-in per-frame
// var (e.g. --integration-blend: normal) instead of a scoped override.
const PocStyles = () => (
  <style>{`.poc-neutral .poe-panel__integration { mix-blend-mode: normal !important; }`}</style>
);

const W = 260, H = 120;
const Panel = ({ frame, neutral, fg }: { frame: string; neutral?: boolean; fg: string }) => (
  <figure style={{ margin: 0, textAlign: 'center' }}>
    <PoePanel
      frame={frame as never}
      surface="none"
      className={neutral ? 'poc-neutral' : ''}
      style={{ width: W, height: H, ...(neutral ? { '--src-integration': `url(${NEUTRAL[frame]})` } : {}) } as React.CSSProperties}
    />
    <figcaption style={{ marginTop: 10, font: '10px system-ui', color: fg, opacity: 0.85 }}>
      {neutral ? 'neutral × normal' : 'stone × multiply'}
    </figcaption>
  </figure>
);

const Row = ({ bg, frame }: { bg: typeof BACKGROUNDS[number]; frame: string }) => (
  <div style={{ background: bg.css, padding: 26, borderRadius: 6, display: 'flex', gap: 40, alignItems: 'flex-start' }}>
    <div style={{ width: 96, paddingTop: 44, font: '600 11px system-ui', color: bg.fg }}>{bg.name}</div>
    <Panel frame={frame} fg={bg.fg} />
    <Panel frame={frame} neutral fg={bg.fg} />
  </div>
);

export default {
  title: 'PoC/Panel Integration Neutral',
  parameters: { bg: 'dark', layout: 'padded' },
};

// One frame across many backgrounds — switch the frame in the Controls panel to polish each.
export const Comparison = {
  render: (args: { frame: string }) => (
    <div style={{ display: 'grid', gap: 18, maxWidth: 820 }}>
      <PocStyles />
      <p style={{ font: '11px/1.5 system-ui', color: '#aab4c0', margin: 0, maxWidth: 720 }}>
        Interior is <code>surface="none"</code> so only the frame + halo show. Left = committed legacy map
        (stone × multiply). Right = PoC neutral relight map (× normal). They should match on the reference
        stone and diverge off-stone (legacy tints toward stone; neutral stays clean).
      </p>
      {BACKGROUNDS.map(bg => <Row key={bg.name} bg={bg} frame={args.frame} />)}
    </div>
  ),
  args: { frame: 'slim-dark-1' },
  argTypes: { frame: { control: 'select', options: Object.keys(NEUTRAL) } },
};

// All four convertible frames on one foreign background, for an at-a-glance neutrality read.
export const AllOnParchment = {
  render: () => (
    <div style={{ background: '#d9c9a3', padding: 34, borderRadius: 6, display: 'flex', gap: 44, flexWrap: 'wrap' }}>
      <PocStyles />
      {Object.keys(NEUTRAL).map(frame => (
        <div key={frame} style={{ textAlign: 'center' }}>
          <div style={{ font: '600 11px system-ui', color: '#5a4a2a', marginBottom: 14 }}>{frame}</div>
          <div style={{ display: 'flex', gap: 28 }}>
            <Panel frame={frame} fg="#5a4a2a" />
            <Panel frame={frame} neutral fg="#5a4a2a" />
          </div>
        </div>
      ))}
    </div>
  ),
};
