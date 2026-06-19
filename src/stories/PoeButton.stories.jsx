import React from 'react';
import { Sparkles, Skull } from 'lucide-react';
import { within, userEvent, expect, fn } from 'storybook/test';
import { PoeButton } from '../components';
import { Row, Stack, Caption } from './_layout.jsx';

export default {
  title: 'Primitives/PoeButton',
  component: PoeButton,
  argTypes: {
    variant: { control: 'select', options: ['default', 'primary', 'magic', 'danger', 'corrupt', 'ghost'] },
    ornate: { control: 'boolean' },
    compact: { control: 'boolean' },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { children: 'Craft Item', variant: 'default' },
};

export const Playground = {};

// Pass-through props (onClick, etc.) reach the underlying <button>, and `selected`
// surfaces as both the is-selected class and a data-selected hook.
export const ClickBehavior = {
  args: { children: 'Craft Item', selected: true, onClick: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /Craft Item/ });

    await expect(button).toHaveClass('poe-button', 'is-selected');
    await expect(button).toHaveAttribute('data-selected', 'true');
    // Defaults to type="button" so it never submits a surrounding <form> by accident.
    await expect(button).toHaveAttribute('type', 'button');

    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

// The default type="button" is overridable via props.
export const SubmitTypeOverride = {
  tags: ['!dev'],
  args: { children: 'Submit', type: 'submit' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: /Submit/ })).toHaveAttribute('type', 'submit');
  },
};

// A disabled button must not fire onClick.
export const DisabledNoClick = {
  args: { children: 'Disabled', disabled: true, onClick: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /Disabled/ });

    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Ornate = {
  render: () => (
    <Stack gap={14}>
      <Caption>asset-backed plate (border-image fill, scaled)</Caption>
      <Row gap={14}>
        <PoeButton ornate>Craft Item</PoeButton>
        <PoeButton ornate>Simulate</PoeButton>
        <PoeButton ornate style={{ minWidth: 220 }}>Show Related Paths</PoeButton>
      </Row>
    </Stack>
  ),
};

export const Variants = {
  render: () => (
    <Row>
      {['default', 'primary', 'magic', 'danger', 'corrupt', 'ghost'].map((v) => (
        <PoeButton key={v} variant={v}>{v}</PoeButton>
      ))}
    </Row>
  ),
};

export const States = {
  render: () => (
    <Stack gap={16}>
      <div>
        <Caption>default · selected · disabled · compact</Caption>
        <Row>
          <PoeButton>Default</PoeButton>
          <PoeButton selected>Selected</PoeButton>
          <PoeButton disabled>Disabled</PoeButton>
          <PoeButton compact>Compact</PoeButton>
        </Row>
      </div>
      <div>
        <Caption>with icons</Caption>
        <Row>
          <PoeButton variant="magic"><Sparkles size={15} /> Show related paths</PoeButton>
          <PoeButton variant="corrupt"><Skull size={15} /> Corrupt</PoeButton>
        </Row>
      </div>
      <div>
        <Caption>ornate (asset-backed)</Caption>
        <Row><PoeButton ornate>Ornate Plate</PoeButton></Row>
      </div>
    </Stack>
  ),
};
