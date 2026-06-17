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
