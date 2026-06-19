import React from 'react';
import { expect } from 'storybook/test';
import { PoeSegmentBar } from '../components';
import { Stack, Caption } from './_layout.jsx';

export default {
  title: 'Primitives/PoeSegmentBar',
  component: PoeSegmentBar,
  argTypes: {
    count: { control: { type: 'range', min: 1, max: 60, step: 1 } },
    blue: { control: 'boolean' },
  },
  args: { count: 36, blue: false },
};

export const Playground = {};

export const Variants = {
  render: () => (
    <Stack gap={16}>
      <div>
        <Caption>green (default)</Caption>
        <PoeSegmentBar count={36} />
      </div>
      <div>
        <Caption>blue</Caption>
        <PoeSegmentBar count={36} blue />
      </div>
      <div>
        <Caption>sparse (count 12)</Caption>
        <PoeSegmentBar count={12} />
      </div>
    </Stack>
  ),
};

// Renders exactly `count` segments, and `blue` toggles the segment class.
export const SegmentCount = {
  tags: ['!dev'],
  args: { count: 8, blue: true },
  play: async ({ canvasElement }) => {
    const segments = canvasElement.querySelectorAll('.poe-segment');
    await expect(segments).toHaveLength(8);
    await expect(segments[0]).toHaveClass('blue');
  },
};
