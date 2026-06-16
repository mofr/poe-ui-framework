import React from 'react';
import { Sparkles } from 'lucide-react';
import { PoeButton } from '../primitives/PoeButton.jsx';
import { PoeFrame } from '../primitives/PoeFrame.jsx';
import { PoeTag } from '../primitives/PoeTag.jsx';

export function Inspector() {
  const stats = [
    ['Family', 'Base Maximum Life'],
    ['Tier Count', '13'],
    ['Item Level', '1-60'],
    ['Weight', '13000'],
    ['Domains', 'STR Armour'],
  ];

  return (
    <PoeFrame title="Selected Modifier" meta="Inspector">
      <h2 className="poe-inspector-title">+(70-149) to Maximum Life</h2>
      <div>
        <PoeTag type="life">Life</PoeTag>
        <PoeTag type="defence">Defence</PoeTag>
      </div>
      <div style={{ marginTop: 12 }}>
        {stats.map(([label, value]) => (
          <div className="poe-statline" key={label}>
            <span className="poe-subtle">{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <PoeButton style={{ marginTop: 12, width: '100%' }}><Sparkles size={15} /> Show related crafting paths</PoeButton>
    </PoeFrame>
  );
}
