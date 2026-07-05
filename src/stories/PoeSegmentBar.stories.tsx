import React from 'react';
import { expect } from 'storybook/test';
import { PoeSegmentBar } from '../components';
import { Stack, Caption } from './_layout.tsx';

export default {
  title: 'Primitives/PoeSegmentBar',
  component: PoeSegmentBar,
  argTypes: {
    variant: { control: 'inline-radio', options: ['blue', 'green'] },
    value: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
    label: { control: 'text' },
    pad: { control: { type: 'range', min: 0, max: 8, step: 1 } },
  },
  args: { variant: 'blue' },
};

export const Playground = {};

export const Gallery = {
  render: () => (
    <Stack gap={16}>
      <div><Caption>blue — extracted rail + fill raster (decorative, full)</Caption><PoeSegmentBar variant="blue" /></div>
      <div><Caption>green — baked recolour (own asset)</Caption><PoeSegmentBar variant="green" /></div>
      <div><Caption>value=0.6875 + label — XP / progress variation</Caption><PoeSegmentBar variant="blue" value={0.6875} label="68,750 / 100,000 XP" /></div>
      <div><Caption>value=0.35 (green)</Caption><PoeSegmentBar variant="green" value={0.35} label="35%" /></div>
      <div style={{ width: 240 }}><Caption>narrow — whole segments (background-repeat: round)</Caption><PoeSegmentBar variant="blue" /></div>
    </Stack>
  ),
};

// Structure guard: a 9-slice rail + a single repeating fill (segments are the raster fill, not spans).
export const Structure = {
  tags: ['!dev'],
  args: { variant: 'green' },
  play: async ({ canvasElement }) => {
    const bar = canvasElement.querySelector('.poe-segment-bar');
    await expect(bar).toHaveAttribute('data-variant', 'green');
    await expect(bar.querySelector('.poe-segment-fill')).not.toBeNull();
  },
};
