import React from 'react';
import { within, userEvent, expect, fn } from 'storybook/test';
import { PoeActionTile, ActionBar } from '../components';
import { Row, Stack, Caption } from './_layout.jsx';

export default {
  title: 'Primitives/PoeActionTile',
  component: PoeActionTile,
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'danger'] },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { label: 'Search', icon: 'search', hotkey: 1, variant: 'default' },
};

export const Playground = {};

export const States = {
  render: () => (
    <Row gap={10}>
      <PoeActionTile label="Search" icon="search" hotkey={1} />
      <PoeActionTile label="Prefix" icon="prefix" hotkey={2} selected />
      <PoeActionTile label="Craft" icon="craft" hotkey={3} variant="danger" />
      <PoeActionTile label="Export" icon="export" hotkey={4} disabled />
    </Row>
  ),
};

export const InActionBar = {
  name: 'In ActionBar',
  render: () => (
    <Stack gap={10}>
      <Caption>the full hotkey bar (layout/ActionBar)</Caption>
      <ActionBar />
    </Stack>
  ),
};

// A tile fires onClick once; a disabled tile does not.
export const ClickBehavior = {
  args: { label: 'Search', icon: 'search', hotkey: 1, selected: true, onClick: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const tile = canvas.getByRole('button', { name: /Search/ });

    await expect(tile).toHaveClass('poe-action-tile', 'is-selected');
    await expect(tile).toHaveAttribute('data-selected', 'true');
    // Icon is decorative (label text carries the meaning) → empty alt, honoured via `??`.
    await expect(tile.querySelector('img.poe-asset-icon')).toHaveAttribute('alt', '');

    await userEvent.click(tile);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const DisabledNoClick = {
  args: { label: 'Export', icon: 'export', disabled: true, onClick: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const tile = canvas.getByRole('button', { name: /Export/ });

    await expect(tile).toBeDisabled();
    await userEvent.click(tile);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
