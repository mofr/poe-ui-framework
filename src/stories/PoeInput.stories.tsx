import React from 'react';
import { PoeInput } from '../components/primitives/PoeInput.tsx';
import { Stack, Caption } from './_layout.tsx';

export default {
  title: 'Primitives/PoeInput',
  component: PoeInput,
};

export const Gallery = {
  render: () => (
    <Stack gap={20} style={{ maxWidth: 460 }}>
      <div>
        <PoeInput ornate placeholder="Search or jump to..." />
        <Caption>ornate — extracted 9-slice frame · .poe-input--ornate (used on the Reconstruction dashboard)</Caption>
      </div>
      <div>
        <PoeInput placeholder="Search modifiers, tags, item classes..." />
        <Caption>plain inset field · .poe-input</Caption>
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
    <div style={{ maxWidth: 460 }}><PoeInput {...args} /></div>
  ),
};
