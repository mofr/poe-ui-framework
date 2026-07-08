import React from 'react';
import { Search } from 'lucide-react';
import { PoeInput } from '../components/primitives/PoeInput.tsx';
import { Stack, Caption } from './_layout.tsx';

export default {
  title: 'Primitives/PoeInput',
  component: PoeInput,
};

export const Gallery = {
  render: () => (
    <Stack gap={20} style={{ maxWidth: 560 }}>
      <div>
        <PoeInput ornate leading={<Search size={20} />} trailing="/" placeholder="Search or jump to..." />
        <Caption>ornate + adornments — search icon & keyboard hint (used on the Reconstruction dashboard)</Caption>
      </div>
      <div>
        <PoeInput ornate placeholder="Search or jump to..." />
        <Caption>ornate — extracted 9-slice frame · .poe-input--ornate</Caption>
      </div>
      <div>
        <PoeInput leading={<Search size={15} />} placeholder="Search modifiers, tags, item classes..." />
        <Caption>plain inset field + leading icon</Caption>
      </div>
      <div>
        <PoeInput disabled placeholder="Disabled" />
        <Caption>disabled</Caption>
      </div>
    </Stack>
  ),
};

export const Playground = {
  args: { ornate: true, placeholder: 'Search or jump to...', disabled: false },
  argTypes: {
    ornate: { control: 'boolean' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  render: (args: React.ComponentProps<typeof PoeInput>) => (
    <div style={{ maxWidth: 460 }}><PoeInput leading={<Search size={16} />} {...args} /></div>
  ),
};
