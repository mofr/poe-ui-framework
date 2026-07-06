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
    raster: { control: 'inline-radio', options: [undefined, 'big-ornate-1'] },
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
        <Caption>raster — cut ring (big-ornate-1); content sits behind, anchored to the mask hole</Caption>
        <Row>
          <PoeCircleFrame raster="big-ornate-1" src={portrait} size={128} />
          <PoeCircleFrame raster="big-ornate-1" src={portrait} size={64} status="online" />
          <PoeCircleFrame raster="big-ornate-1" size={128} glow style={{ fontSize: 34, color: '#e9e3bc' }}>60</PoeCircleFrame>
        </Row>
      </div>
      <div>
        <Caption>raster shadows — default outer drop-shadow (follows ring alpha) · opt-in circular inner shadow</Caption>
        <Row>
          <PoeCircleFrame raster="big-ornate-1" src={portrait} size={128} style={{ '--poe-cf-outer-shadow': 'none' } as React.CSSProperties} />
          <PoeCircleFrame raster="big-ornate-1" src={portrait} size={128} />
          <PoeCircleFrame raster="big-ornate-1" src={portrait} size={128} style={{ '--poe-cf-inner-shadow': 'inset 0 0 16px rgba(0,0,0,.7)' } as React.CSSProperties} />
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
