import React from 'react';
import { Code, CircleAlert, GitPullRequest, Play, BookOpen, Shield, Settings } from 'lucide-react';
import { PoeTab, PoeTabBar } from '../components';
import { Row, Stack, Caption } from './_layout.tsx';

export default {
  title: 'Primitives/PoeTab',
  component: PoeTab,
  argTypes: {
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { children: 'Code', selected: false },
  render: (args: React.ComponentProps<typeof PoeTab>) => <PoeTab icon={<Code size={16} />} {...args} />,
};

export const Playground = {};

const items: [string, React.ReactNode][] = [
  ['Code', <Code size={16} />],
  ['Issues', <CircleAlert size={16} />],
  ['Pull Requests', <GitPullRequest size={16} />],
  ['Actions', <Play size={16} />],
  ['Wiki', <BookOpen size={16} />],
  ['Security', <Shield size={16} />],
  ['Settings', <Settings size={16} />],
];

export const Gallery = {
  render: () => {
    const [active, setActive] = React.useState(0);
    return (
      <Stack gap={20}>
        <div>
          <Caption>states — default · selected · disabled</Caption>
          <Row>
            <PoeTab icon={<Code size={16} />}>Code</PoeTab>
            <PoeTab icon={<Code size={16} />} selected>Code</PoeTab>
            <PoeTab icon={<Code size={16} />} disabled>Code</PoeTab>
          </Row>
        </div>
        <div>
          <Caption>PoeTabBar — click to select; shared baseline rail</Caption>
          <PoeTabBar>
            {items.map(([label, icon], i) => (
              <PoeTab key={label} icon={icon} selected={i === active} onClick={() => setActive(i)}>{label}</PoeTab>
            ))}
          </PoeTabBar>
        </div>
      </Stack>
    );
  },
};
