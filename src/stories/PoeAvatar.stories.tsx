import React from 'react';
import { PoeAvatar } from '../components';
import { Row, Stack, Caption } from './_layout.tsx';
import portrait from '../assets/backgrounds/elder-shaper.jpg';

export default {
  title: 'Primitives/PoeAvatar',
  component: PoeAvatar,
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
          <PoeAvatar src={portrait} size={40} />
          <PoeAvatar src={portrait} size={64} />
          <PoeAvatar src={portrait} size={96} />
          <PoeAvatar src={portrait} size={128} />
        </Row>
      </div>
      <div>
        <Caption>status dots</Caption>
        <Row>
          <PoeAvatar src={portrait} size={64} status="online" />
          <PoeAvatar src={portrait} size={64} status="away" />
          <PoeAvatar src={portrait} size={64} status="busy" />
          <PoeAvatar src={portrait} size={64} status="offline" />
        </Row>
      </div>
      <div>
        <Caption>glow — portrait on an accent inner ring (hero avatar); custom accent</Caption>
        <Row>
          <PoeAvatar src={portrait} size={96} glow />
          <PoeAvatar src={portrait} size={96} glow accent="var(--poe-green)" />
          <PoeAvatar src={portrait} size={96} glow accent="var(--poe-amber)" />
        </Row>
      </div>
      <div>
        <Caption>no src — children fallback (level orb, initials, icon)</Caption>
        <Row>
          <PoeAvatar size={40} style={{ fontSize: 18, color: 'var(--poe-gold-4)' }}>60</PoeAvatar>
          <PoeAvatar size={64} style={{ fontFamily: 'var(--poe-font-title)', fontSize: 22 }}>MF</PoeAvatar>
          <PoeAvatar size={64} glow>★</PoeAvatar>
        </Row>
      </div>
    </Stack>
  ),
};
