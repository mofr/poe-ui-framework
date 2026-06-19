import React from 'react';
import { PoeHeader, PoeApp, PoeNodePreview } from '../components';
import { Stack, Caption } from './_layout.jsx';

export default {
  title: 'Layout/Shell',
};

export const Header = {
  render: () => (
    <Stack gap={10}>
      <Caption>PoeHeader — title, subtitle, search, settings</Caption>
      <PoeHeader />
    </Stack>
  ),
};

export const HeaderCustom = {
  name: 'Header (custom text)',
  render: () => <PoeHeader title="Atlas Cartographer" subtitle="Waystone Forge" />,
};

export const Nodes = {
  render: () => (
    <Stack gap={10}>
      <Caption>PoeNodePreview — passive / notable / keystone node art</Caption>
      <PoeApp>
        <PoeNodePreview />
      </PoeApp>
    </Stack>
  ),
};
