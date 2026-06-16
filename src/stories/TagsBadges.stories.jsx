import React from 'react';
import { PoeTag, PoeBadge } from '../components';
import { Row, Stack, Caption } from './_layout.jsx';

export default { title: 'Primitives/Tags & Badges' };

export const Tags = {
  render: () => (
    <Stack gap={16}>
      <div>
        <Caption>semantic types</Caption>
        <Row gap={4}>
          {['life', 'attack', 'defence', 'elemental', 'chaos'].map((t) => (
            <PoeTag key={t} type={t}>{t}</PoeTag>
          ))}
        </Row>
      </div>
      <div>
        <Caption>required state</Caption>
        <Row gap={4}>
          <PoeTag type="life">Life</PoeTag>
          <PoeTag type="elemental" state="required">Required</PoeTag>
          <PoeTag type="defence">Defence</PoeTag>
        </Row>
      </div>
    </Stack>
  ),
};

export const Badges = {
  render: () => (
    <Row>
      <PoeBadge type="corrupt" title="Corrupted">C</PoeBadge>
      <PoeBadge type="socket" title="Socket">S</PoeBadge>
      <PoeBadge type="essence" title="Essence">E</PoeBadge>
      <PoeBadge type="warning" title="Warning">!</PoeBadge>
    </Row>
  ),
};
