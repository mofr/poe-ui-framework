import React from 'react';
import { PoePanel, PoePanelHeader, PoePanelBody, type Frame } from '../components/primitives/PoePanel.tsx';
import { PoeText } from '../components/primitives/PoeText.tsx';
import { PoeSegmentBar } from '../components/primitives/PoeSegmentBar.tsx';
import { PoeButton } from '../components/primitives/PoeButton.tsx';
import { PoeBadge } from '../components/primitives/PoeBadge.tsx';
import { PoeInput } from '../components/primitives/PoeInput.tsx';
import { PoeList, PoeListRow } from '../components/primitives/PoeList.tsx';
import { GitCommitHorizontal } from 'lucide-react';
// Reference reconstruction — rebuild the @d4m1n.max "Interface Mage" dashboard from OUR framework.
// Semantic text only (PoeText → role tokens, no inline sizes); PoePanel is auto-height (inner panels AND
// the outer ruled-gold-1 container). The page stone is the OUTER PANEL'S SURFACE (matte-stone-1), not an
// artificial backdrop — proper layer model.
export default {
  title: 'Reference/Reconstruction',
  parameters: { layout: 'fullscreen', bg: 'plain' },
};

// Title + optional meta — layout-free; PoePanel's header slot supplies the flex/space-between/margin.
const Heading = ({ children, meta }: { children?: React.ReactNode; meta?: React.ReactNode }) => (
  <><PoeText variant="heading">{children}</PoeText>{meta && <PoeText variant="meta">{meta}</PoeText>}</>
);
// `bleed` = skip PoePanelBody so content (a list) spans to the frame; default wraps in a padded body.
const Panel = ({ frame = 'slim-dark-1', header, bleed, children, style }: { frame?: Frame; header?: React.ReactNode; bleed?: boolean; children?: React.ReactNode; style?: React.CSSProperties }) => (
  <PoePanel frame={frame} surface="solid-black-1" integration="raster" style={{ width: '100%', ...style }}>
    {header && <PoePanelHeader>{header}</PoePanelHeader>}
    {bleed ? children : <PoePanelBody>{children}</PoePanelBody>}
  </PoePanel>
);
const Row = ({ children }: { children?: React.ReactNode }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '3px 0' }}>{children}</div>
);

const repos = ['react', 'github', 'fixtures', 'packages', 'scripts', 'compiler'];
const commits = [
  ['9f3c1ab', 'feat: improve server component support', '+245', 'var(--poe-green)'],
  ['b7e28f4a', 'fix: hydration mismatch warning', '-18', 'var(--poe-red, #ff6b5e)'],
  ['e4a8b7f', 'chore: update hooks guidelines', '+72', 'var(--poe-green)'],
  ['2d0c44e', 'chore: update type definitions', '+36', 'var(--poe-green)'],
  ['a1f762e', 'refactor: simplify build pipeline', '-9', 'var(--poe-red, #ff6b5e)'],
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
    <PoePanel frame="ruled-gold-1" surface="none" integration="none" innerShadowSize={64} innerShadowColor="rgba(0,0,0,1.0)" style={{ maxWidth: 1680, margin: '0 auto' }}>
      <PoePanel frame="cracked-stone-2" surface="cracked-stone-2" style={{ width: '100%', height: '100%' }}>
      <PoePanelBody>
        <div style={col}>

          {/* header */}
          <Panel frame="slim-dark-3">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div><PoeText variant="display" as="span">gaearon</PoeText> <PoeText variant="meta" style={{ marginLeft: 8 }}>The Interface Mage</PoeText></div>
              <PoeInput ornate placeholder="Search or jump to..." style={{ flex: 1, maxWidth: 420 }} />
              <div style={{ display: 'flex', gap: 14 }}>{['Code', 'Issues', 'Pull Requests', 'Actions', 'Wiki'].map((t, i) => <PoeText key={t} variant="label" as="span" style={i === 0 ? { color: 'var(--poe-magic, #4b8dff)' } : undefined}>{t}</PoeText>)}</div>
            </div>
          </Panel>

          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            {/* left */}
            <div style={{ flex: '0 0 340px', ...col }}>
              <Panel header={<Heading>Repositories</Heading>}>{repos.map((r, i) => <Row key={r}><PoeText variant="body" style={i === 0 ? { color: 'var(--poe-gold-4)' } : undefined}>{i ? '▸ ' : '★ '}{r}</PoeText></Row>)}</Panel>
              <Panel frame="slim-dark-2" header={<Heading>Quest Log (Issues & PRs)</Heading>}>{['Fix hydration warning', 'Improve Suspense docs', 'Update type defs'].map(q => <Row key={q}><PoeText variant="body">{q}</PoeText><PoeBadge type="rare">●</PoeBadge></Row>)}</Panel>
            </div>

            {/* center */}
            <div style={{ flex: '1 1 auto', ...col }}>
              <Panel frame="slim-dark-3">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}><PoeText variant="display" as="span">react</PoeText><PoeBadge type="magic">Public</PoeBadge></div>
                <PoeText variant="body" style={{ marginBottom: 10 }}>The library for web and native user interfaces.</PoeText>
                <div style={{ display: 'flex', gap: 22 }}>{stats.map(([k, v]) => <div key={k}><PoeText variant="number">{v}</PoeText><PoeText variant="meta">{k}</PoeText></div>)}</div>
              </Panel>
              <Panel frame="slim-dark-3" header={<Heading meta="100% Vitality">Contribution Health</Heading>}><PoeSegmentBar variant="green" /></Panel>
              <Panel frame="slim-dark-3" header={<Heading meta="18 Day Streak">Coding Energy (Streak)</Heading>}><PoeSegmentBar variant="blue" /></Panel>
              <div style={{ display: 'flex', gap: 14 }}>
                <Panel bleed header={<Heading>Combat Log (Recent Commits)</Heading>}>
                  <PoeList>
                    {commits.map(([sha, msg, val, color]) => (
                      <PoeListRow
                        key={sha}
                        leading={<GitCommitHorizontal size={18} color="var(--poe-gold-4)" />}
                        title={<><PoeText variant="number" as="span" style={{ color: 'var(--poe-gold-4)' }}>{sha}</PoeText><PoeText variant="body" as="span">{msg}</PoeText></>}
                        meta={<PoeText variant="meta">gaearon committed 2 hours ago</PoeText>}
                        trailing={<span style={{ color }}>{val}</span>}
                      />
                    ))}
                  </PoeList>
                </Panel>
                <Panel header={<Heading meta="Latest">Activity Feed</Heading>}>{activity.map(([who, what, when]) => <Row key={who + what}><PoeText variant="body" as="span" style={{ color: 'var(--poe-magic, #4b8dff)' }}>{who}</PoeText><PoeText variant="body" style={{ flex: 1, margin: '0 8px' }}>{what}</PoeText><PoeText variant="meta">{when}</PoeText></Row>)}</Panel>
              </div>
            </div>

            {/* right */}
            <div style={{ flex: '0 0 340px', ...col }}>
              <Panel frame="slim-dark-4" header={<Heading>Repo Overview</Heading>}><div style={{ height: 150, display: 'grid', placeItems: 'center' }}><PoeText variant="meta">atlas / skill-tree art</PoeText></div></Panel>
              <Panel header={<Heading>Pinned Repositories</Heading>}>{pinned.map(([n, d, s]) => <div key={n} style={{ marginBottom: 8 }}><Row><PoeText variant="label" as="span">{n}</PoeText><PoeText variant="number" as="span">★ {s}</PoeText></Row><PoeText variant="meta">{d}</PoeText></div>)}</Panel>
            </div>
          </div>

          {/* action bar */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>{actions.map((a, i) => <PoeButton key={a} selected={i === 0}>{a}</PoeButton>)}</div>
        </div>
      </PoePanelBody>
      </PoePanel>
    </PoePanel>
  ),
};
