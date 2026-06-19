import React from 'react';
import { within, userEvent, expect, fn } from 'storybook/test';
import { PoeTabs, itemClassTabs } from '../components';

export default {
  title: 'Primitives/PoeTabs',
  component: PoeTabs,
  args: { items: itemClassTabs, active: 'STR Armour', compact: false },
  argTypes: { compact: { control: 'boolean' } },
};

export const Playground = {};

export const Interactive = {
  args: { onSelect: fn() },
  render: (args) => {
    const [active, setActive] = React.useState(args.active);
    return (
      <PoeTabs
        {...args}
        active={active}
        onSelect={(t) => {
          args.onSelect(t);
          setActive(t.label);
        }}
      />
    );
  },
  // Clicking a tab selects it (controlled), fires onSelect with the item, and
  // moves aria-selected — the core tablist contract.
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const str = canvas.getByRole('tab', { name: /STR Armour/ });
    const axes = canvas.getByRole('tab', { name: /Axes/ });

    await expect(str).toHaveAttribute('aria-selected', 'true');
    await expect(axes).toHaveAttribute('aria-selected', 'false');

    await userEvent.click(axes);

    await expect(args.onSelect).toHaveBeenCalledTimes(1);
    await expect(args.onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ label: 'Axes' }),
    );
    await expect(axes).toHaveAttribute('aria-selected', 'true');
    await expect(str).toHaveAttribute('aria-selected', 'false');
  },
};

export const Compact = { args: { compact: true } };
