import React from 'react';
import { PoeTabs, itemClassTabs } from '../components';

export default {
  title: 'Primitives/PoeTabs',
  component: PoeTabs,
  args: { items: itemClassTabs, active: 'STR Armour', compact: false },
  argTypes: { compact: { control: 'boolean' } },
};

export const Playground = {};

export const Interactive = {
  render: (args) => {
    const [active, setActive] = React.useState(args.active);
    return <PoeTabs {...args} active={active} onSelect={(t) => setActive(t.label)} />;
  },
};

export const Compact = { args: { compact: true } };
