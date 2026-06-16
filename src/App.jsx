import React from 'react';
import { createRoot } from 'react-dom/client';
import { ActionBar, Inspector, ModifierGroup, PoeApp, PoeButton, PoeFrame, PoeHeader, PoeTabs, itemClassTabs, modifierGroups } from './components';

function Demo() {
  const prefixGroups = modifierGroups.filter((group) => group.kind === 'prefix');
  const suffixGroups = modifierGroups.filter((group) => group.kind === 'suffix');

  return (
    <PoeApp>
      <PoeHeader title="PoE2 Modifier Browser" subtitle="Framework foundation playground" />
      <PoeFrame title="Item Class Atlas" meta="first foundation slice" material="metal">
        <PoeTabs items={itemClassTabs} active="STR Armour" compact />
      </PoeFrame>
      <div className="poe-mod-browser">
        <aside className="poe-browser-sidebar">
          <PoeFrame title="Spawn Filters" meta="compact" compact>
            <div className="poe-filter-stack">
              <PoeButton compact selected>All Mods</PoeButton>
              <PoeButton compact variant="ghost">Prefixes</PoeButton>
              <PoeButton compact variant="ghost">Suffixes</PoeButton>
              <PoeButton compact variant="danger">Blocked</PoeButton>
            </div>
          </PoeFrame>
          <PoeFrame title="Rules" meta="warning" material="inset" compact>
            <p className="poe-text-warning">Blocked rows remain visible so density and exclusion states can be reviewed together.</p>
          </PoeFrame>
        </aside>
        <main className="poe-mod-columns">
          <section className="poe-affix-column">
            <PoeFrame title="Prefixes" meta={`${prefixGroups.length} groups`} material="stone" selected>
              <div className="poe-group-stack">
                {prefixGroups.map((group) => <ModifierGroup key={group.title} {...group} />)}
              </div>
            </PoeFrame>
          </section>
          <section className="poe-affix-column">
            <PoeFrame title="Suffixes" meta={`${suffixGroups.length} groups`} material="stone">
              <div className="poe-group-stack">
                {suffixGroups.map((group) => <ModifierGroup key={group.title} {...group} />)}
              </div>
            </PoeFrame>
          </section>
        </main>
        <aside className="poe-browser-inspector">
          <Inspector />
        </aside>
      </div>
      <ActionBar />
    </PoeApp>
  );
}

createRoot(document.getElementById('root')).render(<Demo />);
