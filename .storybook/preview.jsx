import React from 'react';
import '../src/styles/poe-core.css';
import '../src/styles/poe-vignette.css';
import grid from '../src/assets/backgrounds/blueprint-grid.png';
import crackedStone1 from '../src/assets/backgrounds/cracked-stone-1.png';
import wornLeather1 from '../src/assets/backgrounds/worn-leather-1.png';
import solidBlack1 from '../src/assets/backgrounds/solid-black-1.png';
import matteStone1 from '../src/assets/backgrounds/matte-stone-1.png';
import matteStone2 from '../src/assets/backgrounds/matte-stone-2.png';
import smoothSlate1 from '../src/assets/backgrounds/smooth-slate-1.png';
import matteStoneSoft from '../src/assets/backgrounds/matte-stone-soft.png';

// A tiled-surface backdrop — same file, tiled the same way PoePanel uses it as a surface.
const tile = (url) => ({ backgroundColor: '#16110d', backgroundImage: `url(${url})`, backgroundSize: 'auto', backgroundRepeat: 'repeat' });

// Review backdrops (toolbar "Backdrop" dropdown, globalTypes.bg). The surface keys are the EXACT
// PoePanel surface names (data-surface / Surface type) so you can review components on the real textures;
// the rest are abstract dev backdrops. A story can set parameters.bg; the toolbar overrides it.
const BACKDROPS = {
  none: {},
  blueprint: {
    backgroundColor: '#1a63ad',
    backgroundImage: `url(${grid}),
      radial-gradient(ellipse at 50% 30%, rgba(255,255,255,.10), rgba(0,0,0,0) 62%),
      linear-gradient(180deg, rgba(255,255,255,.05), rgba(0,0,0,.22))`,
    backgroundSize: '96px 96px, cover, cover',
    backgroundRepeat: 'repeat, no-repeat, no-repeat',
  },
  dark: { background: 'radial-gradient(circle at 50% 0%, #241a12 0, #0c0a08 70%)' },
  plain: { background: '#15171b' },
  'cracked-stone-1': tile(crackedStone1),
  'worn-leather-1': tile(wornLeather1),
  'solid-black-1': tile(solidBlack1),
  'matte-stone-1': tile(matteStone1),
  'matte-stone-2': tile(matteStone2),
  'smooth-slate-1': tile(smoothSlate1),
  // low-frequency colour field (blurred matte-stone), stretched to cover
  'matte-stone-soft': { backgroundColor: '#16110d', backgroundImage: `url(${matteStoneSoft})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' },
};

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    layout: 'fullscreen',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { test: 'todo' },
    docs: { canvas: { className: 'poe-sb-canvas' } },
    // Our "Backdrop" toolbar (below) is the single background control — disable Storybook's built-in
    // Backgrounds so the two don't both switch the canvas background.
    backgrounds: { disable: true },
  },
  globalTypes: {
    bg: {
      description: 'Review backdrop',
      toolbar: {
        title: 'Backdrop',
        icon: 'photo',
        dynamicTitle: true,
        items: [
          { value: 'none', title: 'None' },
          { value: 'blueprint', title: 'Blueprint' },
          { value: 'dark', title: 'Dark' },
          { value: 'plain', title: 'Plain' },
          { value: 'cracked-stone-1', title: 'cracked-stone-1' },
          { value: 'worn-leather-1', title: 'worn-leather-1' },
          { value: 'solid-black-1', title: 'solid-black-1' },
          { value: 'matte-stone-1', title: 'matte-stone-1' },
          { value: 'matte-stone-2', title: 'matte-stone-2' },
          { value: 'smooth-slate-1', title: 'smooth-slate-1' },
          { value: 'matte-stone-soft', title: 'matte-stone-soft' },
        ],
      },
    },
  },
  // One full-bleed wrapper on the dark-fantasy app surface; its background = toolbar choice,
  // else the story's parameters.bg, else blueprint.
  decorators: [
    (Story, ctx) => {
      const key = ctx.globals.bg || ctx.parameters.bg || 'blueprint';
      return (
        <div className="poe-app" style={{ minHeight: '100vh', padding: 80, ...BACKDROPS[key] }}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
