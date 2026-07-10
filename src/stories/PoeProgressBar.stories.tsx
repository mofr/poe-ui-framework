import React from 'react';
import { expect } from 'storybook/test';
import { PoeProgressBar } from '../components';
import { Stack, Caption } from './_layout.tsx';

export default {
  title: 'Primitives/PoeProgressBar',
  component: PoeProgressBar,
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
      <div><Caption>blue — extracted rail + fill raster (decorative, full)</Caption><PoeProgressBar variant="blue" /></div>
      <div><Caption>green — baked recolour (own asset)</Caption><PoeProgressBar variant="green" /></div>
      <div><Caption>value=0.6875 + label — XP / progress variation</Caption><PoeProgressBar variant="blue" value={0.6875} label="68,750 / 100,000 XP" /></div>
      <div><Caption>value=0.35 (green)</Caption><PoeProgressBar variant="green" value={0.35} label="35%" /></div>
      <div style={{ width: 185 }}><Caption>blue-slim — continuous header-XP fill (native 185×32, CSS trough)</Caption><PoeProgressBar variant="blue-slim" value={0.6875} label="68,750 / 100,000 XP" /></div>
      <div style={{ width: 240 }}><Caption>narrow — segments stay 1:1 (native 28×23, even gaps)</Caption><PoeProgressBar variant="blue" /></div>
    </Stack>
  ),
};

// Structure guard: a 9-slice rail + a single repeating fill (segments are the raster fill, not spans).
export const Structure = {
  tags: ['!dev'],
  args: { variant: 'green' },
  play: async ({ canvasElement }) => {
    const bar = canvasElement.querySelector('.poe-progress-bar');
    await expect(bar).toHaveAttribute('data-variant', 'green');
    await expect(bar.querySelector('.poe-progress-bar__fill')).not.toBeNull();
  },
};
