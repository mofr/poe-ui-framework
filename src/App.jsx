import React from 'react';
import { createRoot } from 'react-dom/client';
import { PoeApp, PoeHeader, PoeTabs, PoeFrame, PoeSegmentBar, ModifierTable, Inspector, ActionBar, sampleRows } from './components/PoeUI.jsx';
import { PoeDivider, PoeNodePreview } from './components/PoeAssets.jsx';

function Demo(){
 const tabs=[{label:'STR Armour',count:550},{label:'DEX Armour',count:543},{label:'INT Armour',count:540},{label:'Axes',count:243},{label:'Rings',count:240},{label:'Waystones',count:58}];
 return <PoeApp><PoeHeader/><PoeFrame title="Item Class Atlas" meta="310 families"><PoeTabs items={tabs} active="STR Armour"/></PoeFrame><div className="poe-layout" style={{marginTop:12}}><PoeFrame title="Explorer" meta="Filters"><input className="poe-search" placeholder="Filter repositories..."/><div style={{marginTop:10,lineHeight:1.9}}><div>▸ Armour</div><div>▸ Weapons</div><div>▸ Off-hands</div><div>▸ Other</div></div></PoeFrame><main className="poe-grid"><PoeFrame title="Contribution Health" meta="100% Vitality"><PoeSegmentBar/></PoeFrame><PoeFrame title="Atlas Assets" meta="nodes + sockets"><PoeNodePreview/><PoeDivider/></PoeFrame><PoeFrame title="Arcane Energy" meta="18 Day Streak"><PoeSegmentBar blue/></PoeFrame><div className="poe-grid" style={{gridTemplateColumns:'1fr 1fr'}}><ModifierTable title="Prefix" rows={sampleRows}/><ModifierTable title="Suffix" rows={sampleRows}/></div></main><Inspector/></div><ActionBar/></PoeApp>
}
createRoot(document.getElementById('root')).render(<Demo/>);
