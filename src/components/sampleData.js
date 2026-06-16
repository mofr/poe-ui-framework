export const itemClassTabs = [
  { label: 'STR Armour', count: 550, icon: 'armour' },
  { label: 'DEX Armour', count: 543, icon: 'armour' },
  { label: 'INT Armour', count: 540, icon: 'mana' },
  { label: 'Axes', count: 243, icon: 'attack' },
  { label: 'Rings', count: 240, icon: 'currency' },
  { label: 'Waystones', count: 58, icon: 'waystone' },
];

export const modifierGroups = [
  {
    title: 'Life',
    kind: 'prefix',
    meta: '13 tiers \u00b7 13000 weight',
    rows: [
      { mod: '+(10-149) to maximum Life', tiers: 13, ilvl: '1-60', weight: 13000, tags: ['Life'], state: 'selected' },
      { mod: '+(4-6)% increased maximum Life', tiers: 3, ilvl: '35-75', weight: 1800, tags: ['Life', 'Defence'], state: 'required' },
    ],
  },
  {
    title: 'Defences',
    kind: 'prefix',
    meta: '11 tiers \u00b7 11000 weight',
    rows: [
      { mod: '+(11-176) to Evasion Rating', tiers: 11, ilvl: '1-54', weight: 11000, tags: ['Armour', 'Defence'] },
      { mod: '+(15-220) to Armour', tiers: 12, ilvl: '1-68', weight: 9500, tags: ['Armour', 'Defence'] },
    ],
  },
  {
    title: 'Elemental Resistance',
    kind: 'suffix',
    meta: '8 tiers \u00b7 8000 weight',
    rows: [
      { mod: '+(6-45)% to Fire Resistance', tiers: 8, ilvl: '1-82', weight: 8000, tags: ['Elemental', 'Fire'], state: 'magic' },
      { mod: '+(6-45)% to Cold Resistance', tiers: 8, ilvl: '1-82', weight: 8000, tags: ['Elemental', 'Cold'] },
    ],
  },
  {
    title: 'Corrupted Outcomes',
    kind: 'suffix',
    meta: 'blocked \u00b7 special',
    rows: [
      { mod: 'Damage Penetrates (10-15)% Cold Resistance', tiers: 1, ilvl: '65', weight: 0, tags: ['Damage', 'Cold'], badge: 'C', badgeType: 'corrupt', state: 'blocked' },
      { mod: 'Cannot roll attack modifiers', tiers: 1, ilvl: '1', weight: 0, tags: ['Craft'], badge: '!', badgeType: 'warning', state: 'warning' },
    ],
  },
];

export const sampleRows = modifierGroups.flatMap((group) => group.rows);
