import React from 'react';
import { PoeInput } from '../components/primitives/PoeInput.tsx';
import { Stack, Caption } from './_layout.tsx';

export default {
  title: 'Primitives/PoeInput',
  component: PoeInput,
};

export const Ornate = {
  render: () => (
    <Stack style={{ maxWidth: 460 }}>
      <PoeInput ornate placeholder="Search or jump to..." />
      <Caption>Ornate — extracted 9-slice frame · .poe-search--ornate (used on the Reconstruction dashboard)</Caption>
    </Stack>
  ),
};

export const Plain = {
  render: () => (
    <Stack style={{ maxWidth: 460 }}>
      <PoeInput placeholder="Search modifiers, tags, item classes..." />
      <Caption>Plain inset field · .poe-search</Caption>
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
    <div style={{ maxWidth: 460 }}><PoeInput {...args} /></div>
  ),
};
