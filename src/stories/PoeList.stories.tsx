import React from 'react';
import { expect } from 'storybook/test';
import { PoeList, PoeListRow, PoePanel, PoePanelHeader, PoePanelBody, PoeText } from '../components';
import { Stack, Caption } from './_layout.tsx';
import { GitCommitHorizontal, Bug, FileText, Wrench, Hammer } from 'lucide-react';

// PoeList is interior-only: it lives INSIDE a PoePanel (heavy frame + surface) and adds its own
// thin ornament (top-edge rule + row dividers). The section TITLE is panel chrome — it comes from
// PoePanel's `header` slot, not from PoeList.
export default {
  title: 'Primitives/PoeList',
  component: PoeList,
};

const commits = [
  ['9f3c1ab', 'feat: improve server component support', '+245', 'var(--poe-green)', GitCommitHorizontal],
  ['b7e28f4a', 'fix: hydration mismatch warning', '-18', 'var(--poe-red, #ff6b5e)', Bug],
  ['e4a8b7f', 'docs: update hooks guidelines', '+72', 'var(--poe-green)', FileText],
  ['2d0c44e', 'chore: update type definitions', '+36', 'var(--poe-green)', Wrench],
  ['a1f762e', 'refactor: simplify build pipeline', '-9', 'var(--poe-red, #ff6b5e)', Hammer],
] as const;

const combatTitle = <><PoeText variant="heading">Combat Log</PoeText><PoeText variant="meta">Recent Commits</PoeText></>;

const CombatLog = () => (
  <PoeList>
    {commits.map(([sha, msg, val, color, Icon]) => (
      <PoeListRow
        key={sha}
        leading={<Icon size={18} color="var(--poe-gold-4)" />}
        title={<><PoeText variant="number" as="span" style={{ color: 'var(--poe-gold-4)' }}>{sha}</PoeText><PoeText variant="body" as="span">{msg}</PoeText></>}
        meta={<PoeText variant="meta">gaearon committed 2 hours ago</PoeText>}
        trailing={<span style={{ color }}>{val}</span>}
      />
    ))}
  </PoeList>
);

// Standalone — PoeList has its own background, so no PoePanel (and no title) is required.
export const Playground = {
  render: () => (
    <div style={{ width: 460 }}><CombatLog /></div>
  ),
};

export const Gallery = {
  render: () => (
    <Stack gap={20} style={{ maxWidth: 480 }}>
      <div>
        <Caption>standalone — no PoePanel, no title (the bare list primitive)</Caption>
        <CombatLog />
      </div>
      <div>
        <Caption>in a panel, bare child — innate art clearance only; separators/rule sit at the frame's inner edge (the reference look)</Caption>
        <PoePanel frame="slim-dark-1" surface="solid-black-1" integration="raster">
          <PoePanelHeader>{combatTitle}</PoePanelHeader>
          <CombatLog />
        </PoePanel>
      </div>
      <div>
        <Caption>vs. wrapped in PoePanelBody — extra breathing room on top of the art clearance (right for prose / a progress bar)</Caption>
        <PoePanel frame="slim-dark-1" surface="solid-black-1" integration="raster">
          <PoePanelHeader>{combatTitle}</PoePanelHeader>
          <PoePanelBody><CombatLog /></PoePanelBody>
        </PoePanel>
      </div>
      <div>
        <Caption>row states — hover + selected (rows are otherwise unadorned)</Caption>
        <PoePanel frame="slim-dark-1" surface="solid-black-1" integration="raster">
          <PoePanelHeader><PoeText variant="heading">States</PoeText></PoePanelHeader>
          <PoePanelBody>
            <PoeList>
              <PoeListRow title={<PoeText variant="body" as="span">normal row</PoeText>} trailing="—" />
              <PoeListRow selected title={<PoeText variant="body" as="span">selected row</PoeText>} trailing="✓" />
              <PoeListRow title={<PoeText variant="body" as="span">another row</PoeText>} trailing="—" />
            </PoeList>
          </PoePanelBody>
        </PoePanel>
      </div>
      <div>
        <Caption>freeform children — PoeList inserts dividers between any children, not just PoeListRow</Caption>
        <PoePanel frame="slim-dark-1" surface="solid-black-1" integration="raster">
          <PoePanelHeader><PoeText variant="heading">Freeform</PoeText></PoePanelHeader>
          <PoePanelBody>
            <PoeList>
              <div style={{ padding: '8px' }}><PoeText variant="body">a plain div row</PoeText></div>
              <div style={{ padding: '8px' }}><PoeText variant="body">another plain div row</PoeText></div>
            </PoeList>
          </PoePanelBody>
        </PoePanel>
      </div>
    </Stack>
  ),
};

// Structure guard: dividers appear only BETWEEN rows (n rows → n−1), and the rule renders once.
export const Structure = {
  tags: ['!dev'],
  render: () => (
    <PoePanel frame="slim-dark-1" surface="solid-black-1">
      <PoePanelHeader>{combatTitle}</PoePanelHeader>
      <PoePanelBody><CombatLog /></PoePanelBody>
    </PoePanel>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const list = canvasElement.querySelector('.poe-list')!;
    await expect(list.querySelectorAll('.poe-list-row')).toHaveLength(commits.length);
    await expect(list.querySelectorAll('.poe-list__sep')).toHaveLength(commits.length - 1);
  },
};
