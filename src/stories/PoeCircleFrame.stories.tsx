import React from 'react';
import { PoeCircleFrame } from '../components';
import { Row, Stack, Caption } from './_layout.tsx';
import portrait from '../assets/backgrounds/elder-shaper.jpg';

export default {
  title: 'Primitives/PoeCircleFrame',
  component: PoeCircleFrame,
  argTypes: {
    size: { control: { type: 'range', min: 32, max: 160, step: 4 } },
    status: { control: 'inline-radio', options: [undefined, 'online', 'away', 'busy', 'offline'] },
    glow: { control: 'boolean' },
  },
  args: { src: portrait, size: 96 },
};

export const Playground = {};

export const Gallery = {
  render: () => (
    <Stack gap={20}>
      <div>
        <Caption>sizes — one component, ring scales with diameter</Caption>
        <Row>
          <PoeCircleFrame src={portrait} size={40} />
          <PoeCircleFrame src={portrait} size={64} />
          <PoeCircleFrame src={portrait} size={96} />
          <PoeCircleFrame src={portrait} size={128} />
        </Row>
      </div>
      <div>
        <Caption>status dots</Caption>
        <Row>
          <PoeCircleFrame src={portrait} size={64} status="online" />
          <PoeCircleFrame src={portrait} size={64} status="away" />
          <PoeCircleFrame src={portrait} size={64} status="busy" />
          <PoeCircleFrame src={portrait} size={64} status="offline" />
        </Row>
      </div>
      <div>
        <Caption>glow — content on an accent inner ring (hero portrait); custom accent</Caption>
        <Row>
          <PoeCircleFrame src={portrait} size={96} glow />
          <PoeCircleFrame src={portrait} size={96} glow accent="var(--poe-green)" />
          <PoeCircleFrame src={portrait} size={96} glow accent="var(--poe-amber)" />
        </Row>
      </div>
      <div>
        <Caption>no src — children content (level orb, initials, icon)</Caption>
        <Row>
          <PoeCircleFrame size={40} style={{ fontSize: 18, color: 'var(--poe-gold-4)' }}>60</PoeCircleFrame>
          <PoeCircleFrame size={64} style={{ fontFamily: 'var(--poe-font-title)', fontSize: 22 }}>MF</PoeCircleFrame>
          <PoeCircleFrame size={64} glow>★</PoeCircleFrame>
        </Row>
      </div>
    </Stack>
  ),
};
