import React from 'react';
import { PoePanel, PoePanelHeader, PoePanelBody } from '../components/primitives/PoePanel.tsx';
import { PoeText } from '../components/primitives/PoeText.tsx';
import { PoeSegmentBar } from '../components/primitives/PoeSegmentBar.tsx';
import { PoeButton } from '../components/primitives/PoeButton.tsx';
import { PoeBadge } from '../components/primitives/PoeBadge.tsx';
import { PoeInput } from '../components/primitives/PoeInput.tsx';
import { PoeList, PoeListRow } from '../components/primitives/PoeList.tsx';
import { GitCommitVertical } from 'lucide-react';
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

// Dumb placeholder for elements whose real components don't exist yet (avatar, level pill, XP bar,
// notification icons, user chip). Layout-only round — swap these for real components/rasters later.
const Ph = ({ w, h, r = 4, label, style, children }: { w: number | string; h: number | string; r?: number | string; label?: string; style?: React.CSSProperties; children?: React.ReactNode }) => (
  <div style={{ width: w, height: h, borderRadius: r, border: '1px dashed #6b5a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8a7645', fontSize: 10, fontFamily: 'system-ui', flex: 'none', whiteSpace: 'nowrap', ...style }}>{children ?? label}</div>
);

// Control-owned text stand-in: the label typography a real component (PoeTab, level orb, XP bar, user
// menu) would own internally — NOT a PoeText role. Values match the reference's color/size; the eventual
// component absorbs this styling. Fonts are a separate pass.
const ctrl = (fontSize: number, color: string, mono = false): React.CSSProperties => ({
  fontFamily: mono ? 'var(--poe-font-number)' : 'var(--poe-font-display)', fontSize, color, whiteSpace: 'nowrap',
});

const nav = ['Code', 'Issues', 'Pull Requests', 'Actions', 'Projects', 'Wiki', 'Security', 'Settings'];

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

      {/* header — outside stone bg, no frame, matte-stone-2 surface. Two rows: identity·search·actions, then nav rail. */}
      <PoePanel frame="none" integration="none" contentPad={0} surface="matte-stone-2" innerShadowSize={24} innerShadowColor="rgba(0,0,0,1.0)" style={{ width: '100%' }}>
        {/* full-bleed (no PoePanelBody comfort padding) so the user panel reaches the frame border.
            Left gutter for the avatar; right edge flush; small vertical gutter for the ~125px height. */}
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 16, padding: '6px 0 6px 22px' }}>
            {/* avatar = circular frame ring with the portrait image nested inside it */}
            <Ph w={122} h={122} r="50%" style={{ alignSelf: 'center' }}>
              <Ph w={90} h={90} r="50%" label="IMG" />
            </Ph>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>

              {/* top row — name/subtitle · search · notifications */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <PoeText variant="display" as="span">gaearon</PoeText>
                  <PoeText variant="subtitle" style={{ color: '#3fa2ed' }}>The Interface Mage</PoeText>
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <PoeInput ornate placeholder="Search or jump to..." style={{ width: '100%', maxWidth: 460 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                  <Ph w={44} h={40} r={6} label="BELL 3" />
                  <Ph w={44} h={40} r={6} label="MAIL" />
                  {/* user panel = portrait circle + name/status, matching the mask's taller box */}
                  <Ph w={240} h={64} r={6} style={{ justifyContent: 'flex-start', gap: 10, paddingLeft: 10 }}>
                    <Ph w={44} h={44} r="50%" label="IMG" />
                    <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={ctrl(15, '#fefefd')}>gaearon</span>
                      <span style={{ ...ctrl(12, '#459d33'), display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#459d33' }} />Online
                      </span>
                    </span>
                  </Ph>
                </div>
              </div>

              {/* bottom row — level + XP share the line with the nav rail. Nav buttons are placeholder
                  tabs (PoeButton is the wrong shape); they dock at the header's bottom edge. */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* level orb overlaps the left end of the xp bar (orb on top) */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Ph w={40} h={40} r="50%" style={{ position: 'relative', zIndex: 1, marginRight: -12 }}>
                    <span style={ctrl(18, '#e9e3bc', true)}>60</span>
                  </Ph>
                  <Ph w={178} h={24} r={4}><span style={ctrl(13, '#e5eaed', true)}>68,750 / 100,000 XP</span></Ph>
                </div>
                <div style={{ flex: 1, display: 'flex', gap: 8, flexWrap: 'nowrap' }}>
                  {nav.map((t, i) => (
                    <Ph
                      key={t}
                      w="auto"
                      h={42}
                      r={5}
                      style={{
                        padding: '0 20px',
                        gap: 8,
                        ...(i === 0 ? { borderColor: 'var(--poe-magic, #4b8dff)', boxShadow: 'inset 0 0 10px rgba(75,141,255,.35)' } : {}),
                      }}
                    >
                      <span style={{ opacity: 0.45, fontSize: 13 }}>◈</span>
                      <span style={ctrl(16, i === 0 ? 'var(--poe-magic, #4b8dff)' : '#e5e6e5')}>{t}</span>
                    </Ph>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
