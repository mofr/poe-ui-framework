import React from 'react';
import '../src/styles/poe-core.css';

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: { test: 'todo' },
    docs: { canvas: { className: 'poe-sb-canvas' } },
  },
  // Render every story on the dark-fantasy app surface so components are
  // reviewed in their real context (fonts, background, grid).
  decorators: [
    (Story) => (
      <div className="poe-app" style={{ minHeight: 'auto', padding: 28 }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
