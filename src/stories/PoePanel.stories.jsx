import React from 'react';
import { expect } from 'storybook/test';
import { PoePanel } from '../components/primitives/PoePanel.tsx';
import grid from '../assets/backgrounds/blueprint-grid.png';

// margin:-28 cancels the global .poe-app wrapper padding (preview.jsx) so the backdrop bleeds full-iframe.
const bleed = { minHeight: '100vh', margin: -28, padding: 80 };

const blueprintBg = {
  ...bleed,
  backgroundColor: '#1a63ad',
  backgroundImage: `url(${grid}),
    radial-gradient(ellipse at 50% 30%, rgba(255,255,255,.10), rgba(0,0,0,0) 62%),
    linear-gradient(180deg, rgba(255,255,255,.05), rgba(0,0,0,.22))`,
  backgroundSize: '96px 96px, cover, cover',
  backgroundRepeat: 'repeat, no-repeat, no-repeat',
};
const galleryBg = { ...bleed, background: 'radial-gradient(circle at 50% 0%, #241a12 0, #0c0a08 70%)' };

const onBlueprint = (Story) => <div style={blueprintBg}><Story /></div>;
const onGallery = (Story) => <div style={galleryBg}><Story /></div>;

export default {
  title: 'Primitives/PoePanel',
  component: PoePanel,
};

const Section = ({ title, children }) => (
  <section style={{ marginBottom: 64 }}>
    <h3 style={{ font: '600 12px/1.4 system-ui', color: '#eaf2fb', margin: '0 0 28px', letterSpacing: '.3px' }}>{title}</h3>
    <div style={{ display: 'flex', gap: 80, flexWrap: 'wrap', alignItems: 'flex-start' }}>{children}</div>
  </section>
);
const Cell = ({ label, w = 300, h = 200, color = '#dce8f6', children, ...props }) => (
  <figure style={{ margin: 0, width: w }}>
    <PoePanel style={{ width: w, height: h }} {...props}>{children}</PoePanel>
    <figcaption style={{ marginTop: 24, textAlign: 'center', font: '11px system-ui', color }}>{label}</figcaption>
  </figure>
);

const questContent = (
  <div>
    <h4 style={{ margin: '0 0 8px', font: '600 14px system-ui', color: '#f0e7d2' }}>Quest Log</h4>
    <p style={{ margin: '0 0 8px' }}>Slay the Beast of the Hollow Fen and return its ember-heart.</p>
    <ul style={{ margin: 0, paddingLeft: 16 }}>
      <li>Reward: 1,200 gold</li>
      <li>Reputation: +50</li>
    </ul>
  </div>
);

// ============================================================================================
// Debug — every variation, organised by part CHOICE.
// ============================================================================================
export const Debug = {
  decorators: [onBlueprint],
  render: () => (
    <>
      <Section title="FRAME — debug corner-radius sets. Same band (30px), only the radius (+ art) differs — EXCEPT debug-r24, whose corner can't fit a 30px slice so its band/slice grow to 48.">
        <Cell frame="debug-r0" label="debug-r0 (square)" />
        <Cell frame="debug-r4" label="debug-r4" />
        <Cell frame="debug-r8" label="debug-r8 (default)" />
        <Cell frame="debug-r24" label="debug-r24 (bigger band/slice)" />
        <Cell frame="none" integration="none" label="frame none" />
      </Section>

      <Section title="SURFACE — interior fill (scale 1 = 1:1 native pixels)">
        <Cell surface="none" label="surface none" />
        <Cell surface="debug" label="surface debug" />
        <Cell surface="stone" surfaceScale={0.2} label="stone (scale 0.2)" />
        <Cell surface="leather" surfaceScale={0.2} label="leather (scale 0.2)" />
      </Section>

      <Section title="SURFACE SHADOW — inner shadow strength (0 = none)">
        <Cell surfaceShadow={0} label="0" />
        <Cell surfaceShadow={0.55} label="0.55 (default)" />
        <Cell surfaceShadow={0.9} label="0.9" />
      </Section>

      <Section title="INTEGRATION — raster-driven (on/off; styles would be different rasters)">
        <Cell integration="debug" label="integration debug" />
        <Cell integration="none" label="integration none" />
      </Section>

      <Section title="ACCENTS — centre-edge medallions, per edge; each has its own scale (1 = native). Plus resize.">
        <Cell accentTop="debug" accentRight="debug" accentBottom="debug" accentLeft="debug" label="all four edges" />
        <Cell accentTop="debug" label="top only" />
        <Cell accentLeft="debug" accentRight="debug" accentLeftScale={1.4} accentRightScale={1.4} label="left/right, scale 1.4" />
        <Cell accentTop="debug" accentBottom="debug" w={520} h={150} label="wide — edges tile, corners hold" />
      </Section>

      <Section title="With content — sits in the surface, inset by padding">
        <Cell w={320} h={240} surface="leather" surfaceScale={0.2} label="content slot">{questContent}</Cell>
      </Section>
    </>
  ),
};

// ============================================================================================
// Gallery — the default state plus a few polished presets (real frames, not debug textures).
// ============================================================================================
export const Gallery = {
  decorators: [onGallery],
  render: () => (
    <div style={{ display: 'flex', gap: 70, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <Cell color="#cbb" w={320} h={230} label="default state">{questContent}</Cell>
      <Cell color="#cbb" w={360} h={250} frame="frame-b" integration="none" surface="stone" surfaceScale={0.18}
        accentTop="debug" accentBottom="debug" label="frame-b · stone">{questContent}</Cell>
      <Cell color="#cbb" w={360} h={250} frame="frame-b" integration="none" surface="leather" surfaceScale={0.18}
        label="frame-b · leather">{questContent}</Cell>
      <Cell color="#cbb" w={620} h={420} frame="frame-a" integration="none" surface="stone" surfaceScale={0.22}
        label="frame-a · stone (large)">{questContent}</Cell>
    </div>
  ),
};

// ============================================================================================
// Playground — tweak the panel live. (slice/repeat are intrinsic to the frame raster, not controls.)
// ============================================================================================
const SCALE = { control: { type: 'range', min: 0.25, max: 2, step: 0.05 } };
const ACCENT = { control: 'inline-radio', options: ['none', 'debug'] };

export const Playground = {
  decorators: [onBlueprint],
  args: {
    frame: 'debug-r8', frameScale: 1,
    surface: 'debug', surfaceScale: 1, surfaceShadow: 0.55,
    integration: 'debug',
    accentTop: 'none', accentRight: 'none', accentBottom: 'none', accentLeft: 'none',
    accentTopScale: 1, accentRightScale: 1, accentBottomScale: 1, accentLeftScale: 1,
    overhang: -1,
    width: 340, height: 240,
    content: 'Tweak me with the Controls panel →',
  },
  argTypes: {
    frame: {
      control: 'select',
      options: ['none', 'debug-r0', 'debug-r4', 'debug-r8', 'debug-r24', 'frame-a', 'frame-b'],
      description: 'frame-a/b are real 1:1 frames — set width/height near native for correct proportion.',
    },
    frameScale: SCALE,
    surface: { control: 'inline-radio', options: ['none', 'debug', 'stone', 'leather'] },
    surfaceScale: SCALE,
    surfaceShadow: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    integration: { control: 'inline-radio', options: ['none', 'debug'] },
    accentTop: ACCENT, accentRight: ACCENT, accentBottom: ACCENT, accentLeft: ACCENT,
    accentTopScale: SCALE, accentRightScale: SCALE, accentBottomScale: SCALE, accentLeftScale: SCALE,
    overhang: { control: { type: 'range', min: -1, max: 80, step: 1 }, description: '-1 = auto (half band); frame↔box distance (overhang)' },
    width: { control: { type: 'range', min: 160, max: 1400, step: 10 } },
    height: { control: { type: 'range', min: 120, max: 960, step: 10 } },
    content: { control: 'text' },
  },
  parameters: { controls: { exclude: ['className', 'style', 'children'] } },
  render: ({ width, height, content, overhang, ...args }) => {
    const style = { width, height };
    if (overhang >= 0) style['--overhang'] = `${overhang}px`;
    return <PoePanel style={style} {...args}>{content}</PoePanel>;
  },
};

// ============================================================================================
// LayerContract — guards the layered-panel structure (docs/FRAME-FIDELITY.md): chosen part
// variants land on data-* hooks, every decoration layer is emitted, and accents render one
// span per requested edge. No new sidebar noise — hidden from the dev sidebar, runs in tests.
// ============================================================================================
export const LayerContract = {
  tags: ['!dev'],
  args: { frame: 'frame-b', surface: 'stone', integration: 'none', accentTop: 'debug', accentBottom: 'debug' },
  render: (args) => <PoePanel {...args} style={{ width: 300, height: 200 }}>Body</PoePanel>,
  play: async ({ canvasElement }) => {
    const panel = canvasElement.querySelector('.poe-panel');
    await expect(panel).not.toBeNull();
    await expect(panel).toHaveAttribute('data-frame', 'frame-b');
    await expect(panel).toHaveAttribute('data-surface', 'stone');
    await expect(panel).toHaveAttribute('data-integration', 'none');

    for (const layer of ['surface', 'recess', 'shadow', 'specular', 'content', 'art']) {
      await expect(panel.querySelector(`.poe-panel__${layer}`)).not.toBeNull();
    }

    // Two edges requested → exactly two accent spans, on the right edges.
    await expect(panel.querySelectorAll('.poe-panel__accent')).toHaveLength(2);
    await expect(panel.querySelector('.poe-panel__accent--t')).not.toBeNull();
    await expect(panel.querySelector('.poe-panel__accent--b')).not.toBeNull();
    await expect(panel.querySelector('.poe-panel__accent--l')).toBeNull();
  },
};
