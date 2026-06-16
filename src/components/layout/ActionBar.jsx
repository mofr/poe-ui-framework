import React from 'react';
import { AlertCircle, Eye, GitFork, Hammer, Search, Settings, Sparkles, Star } from 'lucide-react';

export function ActionBar() {
  const actions = ['Search', 'Mods', 'Craft', 'Sim', 'Plan', 'Filter', 'Compare', 'Export', 'Settings', 'Create'];
  const icons = [Search, Star, Hammer, Eye, Sparkles, AlertCircle, GitFork, Star, Settings, Sparkles];

  return (
    <nav className="poe-kbdbar">
      {actions.map((action, index) => {
        const Icon = icons[index];
        return (
          <button className="poe-skill" key={action}>
            <kbd>{(index + 1) % 10}</kbd>
            <Icon size={22} />
            <div>{action}</div>
          </button>
        );
      })}
    </nav>
  );
}
