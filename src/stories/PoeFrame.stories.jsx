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

// Resizable container so the 9-slice can be checked at any size. The frame body is a
// flat solid colour so the ornate border/corners read clearly with no content noise.
const box = (w, h) => ({
  resize: 'both',
  overflow: 'hidden',
  border: '1px dashed rgba(255,255,255,0.15)',
  width: w,
  height: h,
  minWidth: 220,
  minHeight: 160,
  marginBottom: 24,
});
const solid = { width: '100%', height: '100%', background: '#3c3a37' };

export const Large = {
  render: () => (
    <div style={box(820, 480)}>
      <PoeFrame style={solid} />
    </div>
  ),
};

export const Medium = {
  render: () => (
    <div style={box(440, 280)}>
      <PoeFrame style={solid} />
    </div>
  ),
};

export const WithHeader = {
  render: () => (
    <div style={box(680, 380)}>
      <PoeFrame title="Panel" meta="header" style={solid} />
    </div>
  ),
};
