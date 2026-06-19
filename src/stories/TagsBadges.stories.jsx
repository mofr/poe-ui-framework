import React from 'react';
import { expect } from 'storybook/test';
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

// PoeTag icon resolution: explicit icon wins, else the type→icon alias, else the type name.
// The icon is decorative (the tag text carries the meaning) → empty alt.
export const TagIconAlias = {
  tags: ['!dev'],
  render: () => (
    <Row gap={4}>
      <PoeTag type="defence">Defence</PoeTag>
      <PoeTag type="life">Life</PoeTag>
      <PoeTag type="attack" icon="craft">Override</PoeTag>
      <PoeTag>Bare</PoeTag>
    </Row>
  ),
  play: async ({ canvasElement }) => {
    const imgFor = (label) =>
      [...canvasElement.querySelectorAll('.poe-tag')]
        .find((t) => t.textContent.includes(label))
        ?.querySelector('img.poe-asset-icon');

    // defence → armour (alias)
    await expect(imgFor('Defence')).toHaveAttribute('src', expect.stringContaining('/armour.svg'));
    // life → life (type is its own icon)
    await expect(imgFor('Life')).toHaveAttribute('src', expect.stringContaining('/life.svg'));
    // explicit icon prop wins over the type alias
    await expect(imgFor('Override')).toHaveAttribute('src', expect.stringContaining('/craft.svg'));
    // decorative icon → empty alt
    await expect(imgFor('Life')).toHaveAttribute('alt', '');
    // no type / no icon → no img rendered at all
    await expect(imgFor('Bare')).toBeNull();
  },
};

// PoeBadge composes type into the class; a type without a CSS rule still renders (unstyled).
export const BadgeClass = {
  tags: ['!dev'],
  render: () => <PoeBadge type="socket" title="Socket">S</PoeBadge>,
  play: async ({ canvasElement }) => {
    const badge = canvasElement.querySelector('.poe-badge');
    await expect(badge).toHaveClass('poe-badge', 'socket');
    await expect(badge).toHaveAttribute('title', 'Socket');
  },
};
