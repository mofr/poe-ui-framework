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
    <PoeFrame title="Selected Modifier" meta="Inspector" material="metal" active>
      <h2 className="poe-inspector-title">+(70-149) to Maximum Life</h2>
      <p className="poe-text-body poe-inspector-copy">A high-weight life prefix used as the selected state benchmark for dense modifier browsing.</p>
      <div className="poe-tag-row">
        <PoeTag type="life">Life</PoeTag>
        <PoeTag type="defence">Defence</PoeTag>
        <PoeTag type="elemental" state="required">Required</PoeTag>
      </div>
      <div className="poe-stat-stack">
        {stats.map(([label, value]) => (
          <div className="poe-statline" key={label}>
            <span className="poe-text-label">{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <PoeButton variant="magic" style={{ marginTop: 12, width: '100%' }}><Sparkles size={15} /> Show related paths</PoeButton>
    </PoeFrame>
  );
}
