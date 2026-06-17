import React from 'react';
import { PoeFrame } from '../components';

export default {
  title: 'Primitives/PoeFrame',
  component: PoeFrame,
  decorators: [
    (Story) => (
      <div style={{ background: '#0b0907', minHeight: '100vh', padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};

// Resizable container so the 9-slice can be checked at any size; the frame body is the
// asset's own texture so the ornate border/corners read clearly with no content noise.
const box = (w, h) => ({
  resize: 'both',
  overflow: 'hidden',
  border: '1px dashed rgba(255,255,255,0.12)',
  width: w,
  height: h,
  minWidth: 260,
  minHeight: 220,
  marginBottom: 24,
});
const solid = { width: '100%', height: '100%' };

export const FrameA = {
  render: () => (
    <div style={box(860, 520)}>
      <PoeFrame style={solid} />
    </div>
  ),
};

export const FrameAMedium = {
  render: () => (
    <div style={box(520, 340)}>
      <PoeFrame style={solid} />
    </div>
  ),
};

export const FrameB = {
  render: () => (
    <div style={box(760, 620)}>
      <PoeFrame className="poe-frame--ornate2" style={solid} />
    </div>
  ),
};

export const FrameC = {
  render: () => (
    <div style={box(720, 460)}>
      <PoeFrame className="poe-frame--ornate3" style={solid} />
    </div>
  ),
};

// --ov (outward overhang) demo: the same frame pushed progressively past the panel edge.
// Set it per frame to match how much "outer part" the source art carries.
export const Overhang = {
  render: () => (
    <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
      {[0, 20, 40].map((ov) => (
        <div key={ov}>
          <div className="poe-text-meta" style={{ fontFamily: 'var(--poe-font-number)', fontSize: 11, marginBottom: 6 }}>--ov: {ov}px</div>
          <div style={{ width: 300, height: 200 }}>
            <PoeFrame style={{ ...solid, '--ov': `${ov}px` }} />
          </div>
        </div>
      ))}
    </div>
  ),
};
