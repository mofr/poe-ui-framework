import React from 'react';
import '../src/styles/poe-core.css';
import grid from '../src/assets/backgrounds/blueprint-grid.png';
import refStone from '../src/assets/backgrounds/stone-lowfreq.png';
import pageStone from '../src/assets/backgrounds/page-stone-tile.png';  // canonical page stone (also the page-stone surface)
import pageStone2 from '../src/assets/backgrounds/page-stone-2-tile.png';  // x2 super-res variant (page-stone-2 surface)

// Swappable review backdrops, chosen from the toolbar "Background" dropdown (globalTypes.bg below).
// A story can set its own default via parameters.bg; the toolbar overrides it when set.
const BACKGROUNDS = {
  blueprint: {
    backgroundColor: '#1a63ad',
    backgroundImage: `url(${grid}),
      radial-gradient(ellipse at 50% 30%, rgba(255,255,255,.10), rgba(0,0,0,0) 62%),
      linear-gradient(180deg, rgba(255,255,255,.05), rgba(0,0,0,.22))`,
    backgroundSize: '96px 96px, cover, cover',
    backgroundRepeat: 'repeat, no-repeat, no-repeat',
  },
  dark: { background: 'radial-gradient(circle at 50% 0%, #241a12 0, #0c0a08 70%)' },
  stone: { background: '#2a2520' },
  plain: { background: '#15171b' },
  // tileable stone extracted from the reference (tools/masks/backgrounds.json → make-bg-tiles.mjs)
  refstone: {
    backgroundColor: '#16110d',
    backgroundImage: `url(${refStone})`,   // low-frequency colour field from the reference page stone
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  },
  pagestone: {                             // canonical page stone (same file as the page-stone surface) — 1:1, tiled
    backgroundColor: '#16110d',
    backgroundImage: `url(${pageStone})`,
    backgroundSize: 'auto',
    backgroundRepeat: 'repeat',
  },
  pagestone2: {                            // x2 super-res variant (page-stone-2 surface) — 1:1, tiled
    backgroundColor: '#16110d',
    backgroundImage: `url(${pageStone2})`,
    backgroundSize: 'auto',
    backgroundRepeat: 'repeat',
  },
};

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    layout: 'fullscreen',
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { test: 'todo' },
    docs: { canvas: { className: 'poe-sb-canvas' } },
  },
  globalTypes: {
    bg: {
      description: 'Review backdrop',
      toolbar: {
        title: 'Background',
        icon: 'photo',
        dynamicTitle: true,
        items: [
          { value: 'blueprint', title: 'Blueprint' },
          { value: 'dark', title: 'Dark' },
          { value: 'stone', title: 'Stone' },
          { value: 'refstone', title: 'Ref stone' },
          { value: 'pagestone', title: 'Page stone' },
          { value: 'pagestone2', title: 'Page stone 2' },
          { value: 'plain', title: 'Plain' },
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
        <div className="poe-app" style={{ minHeight: '100vh', padding: 80, ...BACKGROUNDS[key] }}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
