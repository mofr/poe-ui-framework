import React from 'react';
import '../styles/poe-core.css';
import '../styles/rpg-text.css';

export const PoeAssetPaths = {
  icons: {
    life: '/src/assets/icons/life.svg', mana: '/src/assets/icons/mana.svg', armour: '/src/assets/icons/armour.svg', attack: '/src/assets/icons/attack.svg',
    elemental: '/src/assets/icons/elemental.svg', chaos: '/src/assets/icons/chaos.svg', corruption: '/src/assets/icons/corruption.svg', essence: '/src/assets/icons/essence.svg',
    socket: '/src/assets/icons/socket.svg', currency: '/src/assets/icons/currency.svg', prefix: '/src/assets/icons/prefix.svg', suffix: '/src/assets/icons/suffix.svg',
    filter: '/src/assets/icons/filter.svg', search: '/src/assets/icons/search.svg', craft: '/src/assets/icons/craft.svg', simulate: '/src/assets/icons/simulate.svg',
    settings: '/src/assets/icons/settings.svg', warning: '/src/assets/icons/warning.svg', check: '/src/assets/icons/check.svg', pin: '/src/assets/icons/pin.svg',
    waystone: '/src/assets/icons/waystone.svg', atlas: '/src/assets/icons/atlas.svg', export: '/src/assets/icons/export.svg',
    socketRed: '/src/assets/icons/socket-red.svg', socketGreen: '/src/assets/icons/socket-green.svg', socketBlue: '/src/assets/icons/socket-blue.svg', socketWhite: '/src/assets/icons/socket-white.svg', socketPurple: '/src/assets/icons/socket-purple.svg'
  },
  nodes: {
    passive: '/src/assets/nodes/passive-node.svg', notable: '/src/assets/nodes/notable-node.svg', keystone: '/src/assets/nodes/keystone-node.svg', link: '/src/assets/nodes/node-link.svg'
  },
};

export function PoeAssetIcon({name, group='icons', size='', alt}) {
  const src = PoeAssetPaths[group]?.[name];
  if (!src) return null;
  // `??` (not `||`) so an explicit alt="" (decorative icon beside a text label) is honoured
  // and not replaced by the icon name; only an omitted alt falls back to the name.
  return <img className={`poe-asset-icon ${size}`} src={src} alt={alt ?? name} loading="lazy" />;
}

export function PoeNodePreview(){
  return <div className="poe-node-preview">
    <div className="poe-node-tile"><PoeAssetIcon group="nodes" name="passive" size="xl"/></div>
    <div className="poe-node-tile"><PoeAssetIcon group="nodes" name="notable" size="xl"/></div>
    <div className="poe-node-tile"><PoeAssetIcon group="nodes" name="keystone" size="xl"/></div>
  </div>;
}
