import React from 'react';
import { Sparkles, Skull } from 'lucide-react';
import { PoeButton } from '../components';
import { Row, Stack, Caption } from './_layout.tsx';

export default {
  title: 'Primitives/PoeButton',
  component: PoeButton,
  argTypes: {
    variant: { control: 'inline-radio', options: ['ornate'] },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { children: 'Craft Item', variant: 'ornate' },
};

export const Playground = {};

// Every state of each implemented variant.
export const Gallery = {
  render: () => (
    <Stack gap={16}>
      <div>
        <Caption>ornate — default · selected · disabled</Caption>
        <Row>
          <PoeButton>Default</PoeButton>
          <PoeButton selected>Selected</PoeButton>
          <PoeButton disabled>Disabled</PoeButton>
        </Row>
      </div>
      <div>
        <Caption>with icons</Caption>
        <Row>
          <PoeButton><Sparkles size={15} /> Show Related Paths</PoeButton>
          <PoeButton><Skull size={15} /> Corrupt</PoeButton>
        </Row>
      </div>
      <div>
        <Caption>wide</Caption>
        <Row><PoeButton style={{ minWidth: 220 }}>Simulate</PoeButton></Row>
      </div>
    </Stack>
  ),
};
