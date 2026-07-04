import React from 'react';
import { PoePanel, PoePanelHeader, PoePanelBody } from '../components/primitives/PoePanel.tsx';
import { PoeText } from '../components/primitives/PoeText.tsx';
import { PoeSegmentBar } from '../components/primitives/PoeSegmentBar.tsx';
import { PoeButton } from '../components/primitives/PoeButton.tsx';
import { PoeBadge } from '../components/primitives/PoeBadge.tsx';
import { PoeInput } from '../components/primitives/PoeInput.tsx';
import { PoeList, PoeListRow } from '../components/primitives/PoeList.tsx';
import { GitCommitHorizontal, GitCommitVertical } from 'lucide-react';
import castleNight from '../assets/backgrounds/castle-night-2.jpg';
// Reference reconstruction — rebuild the @d4m1n.max "Interface Mage" dashboard from OUR framework.
// Semantic text only (PoeText → role tokens, no inline sizes); PoePanel is auto-height (inner panels AND
// the outer ruled-gold-1 container). The page stone is the OUTER PANEL'S SURFACE (matte-stone-1), not an
// artificial backdrop — proper layer model.
export default {
  title: 'Reference/Reconstruction',
  parameters: { layout: 'fullscreen', bg: 'plain' },
};

const BodyRow = ({ children }: { children?: React.ReactNode }) => (
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
const col: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12 };

export const Dashboard = {
  render: () => (
    <PoePanel frame="ruled-gold-1" surface="none" integration="none" innerShadowSize={64} innerShadowColor="rgba(0,0,0,1.0)" style={{ maxWidth: 1680, margin: '0 auto' }}>

      {/* header — outside stone bg, no frame, matte-stone-2 surface */}
      <PoePanel frame="none" integration="none" surface="matte-stone-2" innerShadowSize={24} innerShadowColor="rgba(0,0,0,1.0)" style={{ width: '100%' }}>
        <PoePanelBody>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div><PoeText variant="display" as="span">gaearon</PoeText> <PoeText variant="meta" style={{ marginLeft: 8 }}>The Interface Mage</PoeText></div>
            <PoeInput ornate placeholder="Search or jump to..." style={{ flex: 1, maxWidth: 420 }} />
            <div style={{ display: 'flex', gap: 12 }}>{['Code', 'Issues', 'Pull Requests', 'Actions', 'Wiki'].map((t, i) => <PoeText key={t} variant="label" as="span" style={i === 0 ? { color: 'var(--poe-magic, #4b8dff)' } : undefined}>{t}</PoeText>)}</div>
          </div>
        </PoePanelBody>
      </PoePanel>

      {/* main content — with stone background */}
      <PoePanel frame="cracked-stone-2" surface="cracked-stone-2" style={{ width: '100%', height: '100%' }}>
      <PoePanelBody>
        <div style={col}>

          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            {/* left */}
            <div style={{ flex: '0 0 340px', ...col }}>
              <PoePanel frame="slim-dark-1" surface="solid-black-1" integration="raster" style={{ width: '100%' }}>
                <PoePanelHeader><PoeText variant="heading">Repositories</PoeText></PoePanelHeader>
                <PoePanelBody>{repos.map((r, i) => <BodyRow key={r}><PoeText variant="body" style={i === 0 ? { color: 'var(--poe-gold-4)' } : undefined}>{i ? '▸ ' : '★ '}{r}</PoeText></BodyRow>)}</PoePanelBody>
              </PoePanel>
              <PoePanel frame="slim-dark-2" surface="solid-black-1" integration="raster" style={{ width: '100%' }}>
                <PoePanelHeader><PoeText variant="heading">Quest Log (Issues & PRs)</PoeText></PoePanelHeader>
                <PoePanelBody>{['Fix hydration warning', 'Improve Suspense docs', 'Update type defs'].map(q => <BodyRow key={q}><PoeText variant="body">{q}</PoeText><PoeBadge type="rare">●</PoeBadge></BodyRow>)}</PoePanelBody>
              </PoePanel>
            </div>

            {/* center */}
            <div style={{ flex: '1 1 auto', ...col }}>
              <PoePanel frame="slim-dark-3" surface="solid-black-1" integration="raster" style={{ width: '100%' }}>
                <PoePanelBody>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}><PoeText variant="display" as="span">react</PoeText><PoeBadge type="magic">Public</PoeBadge></div>
                  <PoeText variant="body" style={{ marginBottom: 10 }}>The library for web and native user interfaces.</PoeText>
                  <div style={{ display: 'flex', gap: 22 }}>{stats.map(([k, v]) => <div key={k}><PoeText variant="number">{v}</PoeText><PoeText variant="meta">{k}</PoeText></div>)}</div>
                </PoePanelBody>
              </PoePanel>
              <PoePanel frame="slim-dark-3" surface="solid-black-1" integration="raster" style={{ width: '100%' }}>
                <PoePanelHeader><><PoeText variant="heading">Contribution Health</PoeText><PoeText variant="meta">100% Vitality</PoeText></></PoePanelHeader>
                <PoePanelBody><PoeSegmentBar variant="green" /></PoePanelBody>
              </PoePanel>
              <PoePanel frame="slim-dark-3" surface="solid-black-1" integration="raster" style={{ width: '100%' }}>
                <PoePanelHeader><><PoeText variant="heading">Coding Energy (Streak)</PoeText><PoeText variant="meta">18 Day Streak</PoeText></></PoePanelHeader>
                <PoePanelBody><PoeSegmentBar variant="blue" /></PoePanelBody>
              </PoePanel>
              <div style={{ display: 'flex', gap: 14 }}>
                <PoePanel frame="slim-dark-1" surface="solid-black-1" integration="raster" style={{ width: '100%' }}>
                  <PoePanelHeader><PoeText variant="heading">Combat Log (Recent Commits)</PoeText></PoePanelHeader>
                  <PoePanel frame="thin-ornament-1">
                    <PoeList>
                      {commits.map(([sha, msg, val, color]) => (
                        <PoeListRow
                          key={sha}
                          leading={<GitCommitVertical size={18} color="var(--poe-gold-4)" />}
                          title={<><PoeText variant="number" as="span" style={{ color: 'var(--poe-gold-4)' }}>{sha}</PoeText><PoeText variant="body" as="span">{msg}</PoeText></>}
                          meta={<PoeText variant="meta">gaearon committed 2 hours ago</PoeText>}
                          trailing={<span style={{ color }}>{val}</span>}
                        />
                      ))}
                    </PoeList>
                  </PoePanel>
                </PoePanel>
                <PoePanel frame="slim-dark-1" surface="solid-black-1" integration="raster" style={{ width: '100%' }}>
                  <PoePanelHeader><PoeText variant="heading">Activity Feed</PoeText></PoePanelHeader>
                  <PoePanel frame="thin-ornament-1">
                    <PoeList>
                      {activity.map(([who, what, when]) => (
                        <PoeListRow
                          key={who + what}
                          title={<><PoeText variant="body" as="span" style={{ color: 'var(--poe-magic, #4b8dff)' }}>{who}</PoeText><PoeText variant="body" as="span"> {what}</PoeText></>}
                          trailing={<PoeText variant="meta">{when}</PoeText>}
                        />
                      ))}
                    </PoeList>
                  </PoePanel>
                </PoePanel>
              </div>
            </div>

            {/* right */}
            <div style={{ flex: '0 0 340px', ...col }}>
              <PoePanel frame="slim-dark-4" surface="solid-black-1">
                <PoePanelHeader><PoeText variant="heading">Repo Overview</PoeText></PoePanelHeader>
                <PoePanel className="fill-content" frame="slim-dark-5" surface="solid-black-1" integration="raster" style={{ width: '100%', height: '200px'}}>
                  <div
                    className="poe-vignette"
                    data-vignette='strong'
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `url(${castleNight}) center / cover`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      font: '14px/1.4 system-ui',
                      color: '#e8e0cf',
                      padding: 24,
                    }}
                  >
                  </div>
                </PoePanel>
                <PoePanelHeader><PoeText variant="heading">...</PoeText></PoePanelHeader>
              </PoePanel>
              <PoePanel frame="slim-dark-1" surface="solid-black-1" integration="raster" style={{ width: '100%' }}>
                <PoePanelHeader><PoeText variant="heading">Pinned Repositories</PoeText></PoePanelHeader>
                <PoePanelBody>{pinned.map(([n, d, s]) => <div key={n} style={{ marginBottom: 8 }}><BodyRow><PoeText variant="label" as="span">{n}</PoeText><PoeText variant="number" as="span">★ {s}</PoeText></BodyRow><PoeText variant="meta">{d}</PoeText></div>)}</PoePanelBody>
              </PoePanel>
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
