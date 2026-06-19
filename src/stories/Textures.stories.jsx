import React from 'react';

export default { title: 'Foundations/Textures', parameters: { layout: 'fullscreen' } };

const TEXTURES = [
  ['Stone (surface-stone)', '/src/assets/backgrounds/surface-stone.png'],
  ['Leather (surface-leather)', '/src/assets/backgrounds/surface-leather.png'],
];

// Each swatch tiles the texture at a fixed pixel scale (matches how panel bodies use it),
// so you can see the real grain rather than a stretched fit.
export const Textures = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 16 }}>
      {TEXTURES.map(([label, url]) => (
        <div key={label}>
          <div className="poe-text-meta" style={{ fontFamily: 'var(--poe-font-number)', fontSize: 11, marginBottom: 6 }}>{label}</div>
          <div style={{ height: 240, border: '1px solid rgba(201,162,94,.3)', background: `#0e0c0a url(${url}) center / 480px repeat` }} />
        </div>
      ))}
    </div>
  ),
};
