import React from 'react';
import { Code, CircleAlert, GitPullRequest, Play, BookOpen, Shield, Settings } from 'lucide-react';
import { PoeTab, PoeTabBar } from '../components';
import { Row, Stack, Caption } from './_layout.tsx';

export default {
  title: 'Primitives/PoeTab',
  component: PoeTab,
  argTypes: {
    disabled: { control: 'boolean' },
  },
  args: { name: 'code', children: 'Code' },
  render: (args: React.ComponentProps<typeof PoeTab>) => (
    <PoeTabBar selected="code"><PoeTab icon={<Code size={16} />} {...args} /></PoeTabBar>
  ),
};

export const Playground = {};

const items: [string, string, React.ReactNode][] = [
  ['code', 'Code', <Code size={16} />],
  ['issues', 'Issues', <CircleAlert size={16} />],
  ['prs', 'Pull Requests', <GitPullRequest size={16} />],
  ['actions', 'Actions', <Play size={16} />],
  ['wiki', 'Wiki', <BookOpen size={16} />],
  ['security', 'Security', <Shield size={16} />],
  ['settings', 'Settings', <Settings size={16} />],
];

export const Gallery = {
  render: () => {
    const [active, setActive] = React.useState('code');
    return (
      <Stack gap={20}>
        <div>
          <Caption>states — default · selected · disabled</Caption>
          <PoeTabBar selected="code">
            <Row>
              <PoeTab name="a" icon={<Code size={16} />}>Code</PoeTab>
              <PoeTab name="code" icon={<Code size={16} />}>Code</PoeTab>
              <PoeTab name="b" icon={<Code size={16} />} disabled>Code</PoeTab>
            </Row>
          </PoeTabBar>
        </div>
        <div>
          <Caption>PoeTabBar — click to select; shared baseline rail</Caption>
          <PoeTabBar selected={active} onSelect={setActive}>
            {items.map(([name, label, icon]) => (
              <PoeTab key={name} name={name} icon={icon}>{label}</PoeTab>
            ))}
          </PoeTabBar>
        </div>
      </Stack>
    );
  },
};
