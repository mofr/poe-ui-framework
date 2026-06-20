import React from 'react';
import '../src/styles/poe-core.css';
import grid from '../src/assets/backgrounds/blueprint-grid.png';
import refStone from '../src/assets/backgrounds/stone-lowfreq.png';
import userStone from '../src/assets/backgrounds/page-bg-user.png';

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
  userstone: {                             // user-made page background (ChatGPT) — 1:1, tiled (no stretch)
    backgroundColor: '#16110d',
    backgroundImage: `url(${userStone})`,
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
          { value: 'userstone', title: 'User stone' },
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
