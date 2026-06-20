import React from 'react';
import { PoePanel, type Frame } from '../components/primitives/PoePanel.tsx';
import { PoeText } from '../components/primitives/PoeText.tsx';
import { PoeSegmentBar } from '../components/primitives/PoeSegmentBar.tsx';
import { PoeButton } from '../components/primitives/PoeButton.tsx';
import { PoeBadge } from '../components/primitives/PoeBadge.tsx';
import { PoeInput } from '../components/primitives/PoeInput.tsx';
// Reference reconstruction — rebuild the @d4m1n.max "Interface Mage" dashboard from OUR framework.
// Semantic text only (PoeText → role tokens, no inline sizes); PoePanel is auto-height (inner panels AND
// the outer page-frame container). The page stone is the OUTER PANEL'S SURFACE (page-stone), not an
// artificial backdrop — proper layer model.
export default {
  title: 'Reference/Reconstruction',
  parameters: { layout: 'fullscreen', bg: 'plain' },
};

const Heading = ({ children, meta }: { children?: React.ReactNode; meta?: React.ReactNode }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
    <PoeText variant="heading">{children}</PoeText>
    {meta && <PoeText variant="meta">{meta}</PoeText>}
  </div>
);
const Panel = ({ frame = 'basic-panel-a', children, style }: { frame?: Frame; children?: React.ReactNode; style?: React.CSSProperties }) => (
  <PoePanel frame={frame} surface="ref-panel" integration="raster" style={{ width: '100%', ...style }}>{children}</PoePanel>
);
const Row = ({ children }: { children?: React.ReactNode }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '3px 0' }}>{children}</div>
);

const repos = ['react', 'github', 'fixtures', 'packages', 'scripts', 'compiler'];
const commits = [
  ['9f3c1ab', 'feat: improve server component support'], ['b7e28f4a', 'fix: hydration mismatch warning'],
  ['e4a8b7f', 'chore: update hooks guidelines'], ['2d0c44e', 'chore: update type definitions'],
  ['a1f762e', 'refactor: simplify build pipeline'],
];
const activity = [
  ['@sindresorhus', 'opened PR #27001', '2m'], ['@yyx990803', 'starred react', '14m'],
  ['@rauchg', 'commented on #22492', '40m'], ['@shadcn', 'merged PR #26812', '1h'], ['@addyosmani', 'on issue #27344', '2h'],
];
const pinned = [['next.js', 'The React Framework for Production', '128k'], ['tailwindcss', 'A utility-first CSS framework', '82.7k'], ['typescript', 'JavaScript with syntax for types', '100k']];
const stats = [['Stars', '226k'], ['Forks', '45.6k'], ['Watchers', '6.2k'], ['Issues', '1.2k'], ['Pull Requests', '672']];
const actions = ['Repos', 'Issues', 'PRs', 'Actions', 'Review', 'Merge', 'Fork', 'Star', 'Settings', 'Create'];
const col: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 14 };

export const Dashboard = {
  render: () => (
    <PoePanel frame="page-frame" surface="page-stone" integration="none" innerShadowSize={64} innerShadowColor="rgba(0,0,0,1.0)" style={{ maxWidth: 1680, margin: '0 auto' }}>
        <div style={col}>

          {/* header */}
          <Panel frame="basic-panel-b">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div><PoeText variant="display" as="span">gaearon</PoeText> <PoeText variant="meta" style={{ marginLeft: 8 }}>The Interface Mage</PoeText></div>
              <PoeInput ornate placeholder="Search or jump to..." style={{ flex: 1, maxWidth: 420 }} />
              <div style={{ display: 'flex', gap: 14 }}>{['Code', 'Issues', 'Pull Requests', 'Actions', 'Wiki'].map((t, i) => <PoeText key={t} variant="label" as="span" style={i === 0 ? { color: 'var(--poe-magic, #4b8dff)' } : undefined}>{t}</PoeText>)}</div>
            </div>
          </Panel>

          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            {/* left */}
            <div style={{ flex: '0 0 240px', ...col }}>
              <Panel><Heading meta="6">Repositories</Heading>{repos.map((r, i) => <Row key={r}><PoeText variant="body" style={i === 0 ? { color: 'var(--poe-gold-4)' } : undefined}>{i ? '▸ ' : '★ '}{r}</PoeText></Row>)}</Panel>
              <Panel><Heading meta="Issues & PRs">Quest Log</Heading>{['Fix hydration warning', 'Improve Suspense docs', 'Update type defs'].map(q => <Row key={q}><PoeText variant="body">{q}</PoeText><PoeBadge type="rare">●</PoeBadge></Row>)}</Panel>
            </div>

            {/* center */}
            <div style={{ flex: '1 1 auto', ...col }}>
              <Panel frame="basic-panel-b">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}><PoeText variant="display" as="span">react</PoeText><PoeBadge type="magic">Public</PoeBadge></div>
                <PoeText variant="body" style={{ marginBottom: 10 }}>The library for web and native user interfaces.</PoeText>
                <div style={{ display: 'flex', gap: 22 }}>{stats.map(([k, v]) => <div key={k}><PoeText variant="number">{v}</PoeText><PoeText variant="meta">{k}</PoeText></div>)}</div>
              </Panel>
              <Panel frame="basic-panel-b"><Heading meta="100% Vitality">Contribution Health</Heading><PoeSegmentBar variant="green" /></Panel>
              <Panel frame="basic-panel-b"><Heading meta="18 Day Streak">Coding Energy (Streak)</Heading><PoeSegmentBar variant="blue" /></Panel>
              <div style={{ display: 'flex', gap: 14 }}>
                <Panel><Heading meta="Recent Commits">Combat Log</Heading>{commits.map(([sha, msg]) => <Row key={sha}><PoeText variant="number" as="span" style={{ color: 'var(--poe-gold-4)' }}>{sha}</PoeText><PoeText variant="body" style={{ flex: 1, margin: '0 8px' }}>{msg}</PoeText></Row>)}</Panel>
                <Panel><Heading meta="Latest">Activity Feed</Heading>{activity.map(([who, what, when]) => <Row key={who + what}><PoeText variant="body" as="span" style={{ color: 'var(--poe-magic, #4b8dff)' }}>{who}</PoeText><PoeText variant="body" style={{ flex: 1, margin: '0 8px' }}>{what}</PoeText><PoeText variant="meta">{when}</PoeText></Row>)}</Panel>
              </div>
            </div>

            {/* right */}
            <div style={{ flex: '0 0 260px', ...col }}>
              <Panel><Heading>Repo Overview</Heading><div style={{ height: 150, display: 'grid', placeItems: 'center' }}><PoeText variant="meta">atlas / skill-tree art</PoeText></div></Panel>
              <Panel><Heading>Pinned Repositories</Heading>{pinned.map(([n, d, s]) => <div key={n} style={{ marginBottom: 8 }}><Row><PoeText variant="label" as="span">{n}</PoeText><PoeText variant="number" as="span">★ {s}</PoeText></Row><PoeText variant="meta">{d}</PoeText></div>)}</Panel>
            </div>
          </div>

          {/* action bar */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>{actions.map((a, i) => <PoeButton key={a} selected={i === 0}>{a}</PoeButton>)}</div>
        </div>
    </PoePanel>
  ),
};
