import React from 'react';
import { expect } from 'storybook/test';
import { PoePanel, type PoePanelProps } from '../components/primitives/PoePanel.tsx';
// Backgrounds are global now: pick from the toolbar "Background" dropdown (.storybook/preview.jsx).
// Per-story default via parameters.bg (e.g. Gallery → 'dark').

export default {
  title: 'Primitives/PoePanel',
  component: PoePanel,
};

const Section = ({ title, children }: { title?: React.ReactNode; children?: React.ReactNode }) => (
  <section style={{ marginBottom: 64 }}>
    <h3 style={{ font: '600 12px/1.4 system-ui', color: '#eaf2fb', margin: '0 0 28px', letterSpacing: '.3px' }}>{title}</h3>
    <div style={{ display: 'flex', gap: 80, flexWrap: 'wrap', alignItems: 'flex-start' }}>{children}</div>
  </section>
);
interface CellProps extends Partial<PoePanelProps> {
  label?: React.ReactNode;
  w?: number;
  h?: number;
  color?: string;
}
const Cell = ({ label, w = 300, h = 200, color = '#dce8f6', children, ...props }: CellProps) => (
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
  render: () => (
    <>
      <Section title="FRAME — debug corner-radius sets. Same band (30px), only the radius (+ art) differs — EXCEPT debug-r24, whose corner can't fit a 30px slice so its band/slice grow to 48.">
        <Cell frame="debug-r0" label="debug-r0 (square)" />
        <Cell frame="debug-r4" label="debug-r4" />
        <Cell frame="debug-r8" label="debug-r8 (default)" />
        <Cell frame="debug-r24" label="debug-r24 (bigger band/slice)" />
        <Cell frame="none" integration="none" label="frame none" />
      </Section>

      <Section title="SURFACE — interior fill (scale 1 = 1:1 native pixels). ref-panel + page-stone are what the Reconstruction dashboard uses.">
        <Cell surface="none" label="surface none" />
        <Cell surface="debug" label="surface debug" />
        <Cell surface="gpt-stone-1" surfaceScale={0.2} label="gpt-stone-1 (scale 0.2)" />
        <Cell surface="gpt-stone-2" surfaceScale={0.2} label="gpt-stone-2 (scale 0.2)" />
        <Cell surface="ref-panel" label="ref-panel (dashboard inner panels)" />
        <Cell surface="page-stone" surfaceScale={0.3} label="page-stone (dashboard page)" />
        <Cell surface="big-stone-2" surfaceScale={0.3} label="big-stone-2 (new)" />
      </Section>

      <Section title="INNER SHADOW — colour incl. opacity (transparent = none)">
        <Cell innerShadowColor="rgba(0,0,0,0)" label="transparent" />
        <Cell innerShadowColor="rgba(0,0,0,0.55)" label="black 0.55 (default)" />
        <Cell innerShadowColor="rgba(0,0,0,0.9)" label="black 0.9" />
      </Section>

      <Section title="INTEGRATION — the frame's bundled contact-shadow/specular (auto = render it, none = hide it)">
        <Cell integration="auto" label="integration auto" />
        <Cell integration="none" label="integration none" />
      </Section>

      <Section title="ACCENTS — centre-edge medallions, per edge; each has its own scale (1 = native). Plus resize.">
        <Cell accentTop="debug" accentRight="debug" accentBottom="debug" accentLeft="debug" label="all four edges" />
        <Cell accentTop="debug" label="top only" />
        <Cell accentLeft="debug" accentRight="debug" accentLeftScale={1.4} accentRightScale={1.4} label="left/right, scale 1.4" />
        <Cell accentTop="debug" accentBottom="debug" w={520} h={150} label="wide — edges tile, corners hold" />
      </Section>

      <Section title="With content — sits in the surface, inset by padding">
        <Cell w={320} h={240} surface="gpt-stone-2" surfaceScale={0.2} label="content slot">{questContent}</Cell>
      </Section>
    </>
  ),
};

// ============================================================================================
// Gallery — the default state plus a few polished presets (real frames, not debug textures).
// ============================================================================================
export const Gallery = {
  parameters: { bg: 'dark' },
  render: () => (
    <div style={{ display: 'flex', gap: 70, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <Cell color="#cbb" w={320} h={230} label="default state">{questContent}</Cell>
      <Cell color="#cbb" w={360} h={250} frame="gpt-panel-b" integration="none" surface="gpt-stone-1"
        label="gpt-panel-b · stone">{questContent}</Cell>
      <Cell color="#cbb" w={360} h={250} frame="gpt-panel-b" integration="none" surface="gpt-stone-2"
        label="gpt-panel-b · leather">{questContent}</Cell>
      <Cell color="#cbb" w={620} h={420} frame="gpt-panel-a" integration="none" surface="gpt-stone-1"
        label="gpt-panel-a · stone (large)">{questContent}</Cell>
      <Cell color="#cbb" w={454} h={306} frame="basic-panel-a" integration="auto" surface="ref-panel"
        label="basic-panel-a · combat log (native)">{questContent}</Cell>
      <Cell color="#cbb" w={600} h={150} frame="basic-panel-b" integration="auto" surface="ref-panel"
        label="basic-panel-b · contribution health (wide)">{questContent}</Cell>
    </div>
  ),
};

// ============================================================================================
// Playground — tweak the panel live. PUBLIC props (frame/scales/surface/innerShadow*/overhang/
// contentPad/accents…) pass straight to PoePanel. A separate "Raster alignment" group
// (slice/band/surfaceRadius/edgeRepeat + bring-your-own srcFrame) is injected as CSS vars via
// `style` — these are raster-INTRINSIC dev knobs, NOT component props; each name matches its CSS var
// so a tuned value copies straight into the frame's data-frame rule in poe-panel.css.
// ============================================================================================
const SCALE = { control: { type: 'range', min: 0.25, max: 2, step: 0.05 } };
const ACCENT = { control: 'inline-radio', options: ['none', 'debug'] };
const ALIGN = 'Raster alignment';
const ALIGN_NUM = (desc) => ({ control: { type: 'number', min: -1 }, table: { category: ALIGN }, description: desc });

export const Playground = {
  args: {
    frame: 'debug-r8', frameScale: 1,
    surface: 'debug', surfaceScale: 1,
    innerShadowSize: 16, innerShadowColor: 'rgba(0, 0, 0, 0.55)',
    integration: 'auto',
    accentTop: 'none', accentRight: 'none', accentBottom: 'none', accentLeft: 'none',
    accentTopScale: 1, accentRightScale: 1, accentBottomScale: 1, accentLeftScale: 1,
    overhang: -1, contentPad: -1,
    slice: -1, band: -1, surfaceRadius: -1, edgeRepeat: 'auto', srcFrame: '',
    width: 340, height: 240,
    content: 'Tweak me with the Controls panel →',
  },
  argTypes: {
    frame: {
      control: 'select',
      options: ['none', 'debug-r0', 'debug-r4', 'debug-r8', 'debug-r24', 'gpt-panel-a', 'gpt-panel-b', 'basic-panel-a', 'basic-panel-b', 'page-frame'],
      description: 'Real 1:1 frames render best when width/height stay near their native proportions.',
    },
    frameScale: SCALE,
    surface: { control: 'inline-radio', options: ['none', 'debug', 'gpt-stone-1', 'gpt-stone-2', 'ref-panel', 'page-stone', 'big-stone-2'] },
    surfaceScale: SCALE,
    innerShadowSize: { control: { type: 'range', min: 0, max: 60, step: 1 }, description: 'Inner-shadow blur radius (px).' },
    innerShadowColor: { control: 'color', description: 'Inner-shadow colour incl. opacity (opacity = intensity).' },
    integration: { control: 'inline-radio', options: ['none', 'auto'] },
    accentTop: ACCENT, accentRight: ACCENT, accentBottom: ACCENT, accentLeft: ACCENT,
    accentTopScale: SCALE, accentRightScale: SCALE, accentBottomScale: SCALE, accentLeftScale: SCALE,
    overhang: { control: { type: 'range', min: -1, max: 80, step: 1 }, description: '-1 = auto (half the scaled band). Frame spill past the box edge.' },
    contentPad: { control: { type: 'number', min: -1 }, description: '-1 = auto (frame thickness × scale, so content clears the frame). Content inset from the box edge in px.' },
    slice: ALIGN_NUM('-1 = auto (frame default). border-image-slice — where to cut the source corners (source px).'),
    band: ALIGN_NUM('-1 = auto. Rendered frame thickness in px (border-image-width). If band ≠ slice the art SCALES: band < slice shrinks the ornament, band > slice enlarges it; band == slice ⇒ 1:1 native. Normally left to the frame; use frameScale to resize.'),
    surfaceRadius: ALIGN_NUM('-1 = auto. Surface + inner-shadow corner radius in px (match the frame opening).'),
    edgeRepeat: { control: 'inline-radio', options: ['auto', 'round', 'stretch', 'repeat', 'space'], table: { category: ALIGN }, description: 'auto = frame default. How the EDGE slices tile (corners never repeat): round/stretch suit continuous bars, repeat/space suit small motifs.' },
    srcFrame: { control: 'text', table: { category: ALIGN }, description: 'Bring-your-own art: a URL for --src-frame (overrides the frame raster, no prop needed).' },
    width: { control: { type: 'range', min: 160, max: 1400, step: 10 } },
    height: { control: { type: 'range', min: 120, max: 960, step: 10 } },
    content: { control: 'text' },
  },
  parameters: { controls: { exclude: ['className', 'style', 'children'] } },
  render: ({ width, height, content, slice, band, surfaceRadius, edgeRepeat, srcFrame, ...args }) => {
    // Raster-INTRINSIC dev knobs are injected as CSS vars (not props); only set when not "auto" (-1)
    // so the frame's own data-frame rule wins otherwise. The rest (overhang/contentPad/innerShadow*/…)
    // are real props and flow through {...args}.
    const style = { width, height };
    if (slice >= 0) style['--slice'] = slice;
    if (band >= 0) style['--band'] = `${band}px`;
    if (surfaceRadius >= 0) style['--surface-radius'] = `${surfaceRadius}px`;
    if (edgeRepeat !== 'auto') style['--edge-repeat'] = edgeRepeat;
    if (srcFrame) style['--src-frame'] = `url('${srcFrame}')`;
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
  args: { frame: 'gpt-panel-b', surface: 'stone', integration: 'none', accentTop: 'debug', accentBottom: 'debug' },
  render: (args) => <PoePanel {...args} style={{ width: 300, height: 200 }}>Body</PoePanel>,
  play: async ({ canvasElement }) => {
    const panel = canvasElement.querySelector('.poe-panel');
    await expect(panel).not.toBeNull();
    await expect(panel).toHaveAttribute('data-frame', 'gpt-panel-b');
    await expect(panel).toHaveAttribute('data-surface', 'stone');
    await expect(panel).toHaveAttribute('data-integration', 'none');

    for (const layer of ['surface', 'inner-shadow', 'integration-shadow', 'integration-specular', 'content', 'frame']) {
      await expect(panel.querySelector(`.poe-panel__${layer}`)).not.toBeNull();
    }

    // Two edges requested → exactly two accent spans, on the right edges.
    await expect(panel.querySelectorAll('.poe-panel__accent')).toHaveLength(2);
    await expect(panel.querySelector('.poe-panel__accent--t')).not.toBeNull();
    await expect(panel.querySelector('.poe-panel__accent--b')).not.toBeNull();
    await expect(panel.querySelector('.poe-panel__accent--l')).toBeNull();
  },
};
