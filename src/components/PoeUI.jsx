import React from 'react';
import { Search, Star, GitFork, AlertCircle, Sparkles, Settings, Hammer, Eye } from 'lucide-react';
import '../styles/poe-core.css';
import { PoeAssetIcon } from './PoeAssets.jsx';

export function PoeApp({children}) { return <div className="poe-app">{children}</div>; }
export function PoeFrame({title, meta, children, className=''}) {
  return <section className={`poe-frame poe-ornate ${className}`}><header className="poe-panel-header"><span>{title}</span>{meta && <span className="poe-subtle">{meta}</span>}</header><div className="poe-panel-body">{children}</div></section>;
}
export function PoeHeader({title='PoE2 Modifier Browser', subtitle='Arcane Cartographer UI'}) {
  return <header className="poe-frame poe-header"><div><h1 className="poe-title" style={{margin:0,fontSize:22}}>{title}</h1><div className="poe-subtle">{subtitle}</div></div><div style={{flex:1}}><input className="poe-search poe-search--ornate" placeholder="Search modifiers, tags, item classes..." /></div><button className="poe-button poe-button--ornate"><Settings size={15}/> Settings</button></header>;
}
export function PoeTabs({items, active}) { return <div className="poe-tabs">{items.map(i => <button key={i.label} className="poe-tab" data-active={i.label===active}>{i.label} <span className="poe-subtle">{i.count}</span></button>)}</div>; }
export function PoeTag({children, type=''}) { return <span className={`poe-tag ${type}`}>{type && <PoeAssetIcon name={type === 'defence' ? 'armour' : type} alt=''/>}{children}</span>; }
export function PoeBadge({children, type='corrupt'}) { return <span className={`poe-badge ${type}`}>{children}</span>; }
export function PoeSegmentBar({count=36, blue=false}) { return <div className="poe-segment-bar">{Array.from({length:count}).map((_,i)=><span key={i} className={`poe-segment ${blue?'blue':''}`} />)}</div>; }

export function ModifierTable({title='Prefix', meta='135 mods', rows=[]}) {
  return <PoeFrame title={title} meta={meta}><table className="poe-table"><thead><tr><th>Modifier</th><th>Tiers</th><th>iLvl</th><th>Weight</th></tr></thead><tbody>{rows.map((r,i)=><tr key={i} data-selected={i===1 || undefined}><td>{r.badge && <PoeBadge type={r.badgeType}>{r.badge}</PoeBadge>} {' '}{r.mod} {r.tags?.map(t=><PoeTag key={t} type={tagType(t)}>{t}</PoeTag>)}</td><td>{r.tiers}</td><td>{r.ilvl}</td><td>{r.weight}</td></tr>)}</tbody></table></PoeFrame>;
}
function tagType(t){ const x=t.toLowerCase(); if(x.includes('life')) return 'life'; if(x.includes('attack')||x.includes('damage')) return 'attack'; if(x.includes('defence')||x.includes('armour')) return 'defence'; if(['cold','fire','lightning','elemental'].some(v=>x.includes(v))) return 'elemental'; if(x.includes('chaos')) return 'chaos'; return ''; }

export function Inspector() {
  return <PoeFrame title="Selected Modifier" meta="Inspector"><h2 className="poe-inspector-title">+(70–149) to Maximum Life</h2><div><PoeTag type="life">Life</PoeTag><PoeTag type="defence">Defence</PoeTag></div><div style={{marginTop:12}}>{[['Family','Base Maximum Life'],['Tier Count','13'],['Item Level','1–60'],['Weight','13000'],['Domains','STR Armour']].map(([a,b])=><div className="poe-statline" key={a}><span className="poe-subtle">{a}</span><strong>{b}</strong></div>)}</div><button className="poe-button" style={{marginTop:12,width:'100%'}}><Sparkles size={15}/> Show related crafting paths</button></PoeFrame>;
}
export function ActionBar(){ const actions=['Search','Mods','Craft','Sim','Plan','Filter','Compare','Export','Settings','Create']; const icons=[Search,Star,Hammer,Eye,Sparkles,AlertCircle,GitFork,Star,Settings,Sparkles]; return <nav className="poe-kbdbar">{actions.map((a,i)=>{const Icon=icons[i]; return <button className="poe-skill" key={a}><kbd>{(i+1)%10}</kbd><Icon size={22}/><div>{a}</div></button>})}</nav>; }
export const sampleRows = [
  {mod:'+(10–149) to maximum Life', tiers:13, ilvl:'1–60', weight:13000, tags:['Life']},
  {mod:'+(11–176) to Evasion Rating', tiers:11, ilvl:'1–54', weight:11000, tags:['Armour','Defence']},
  {mod:'Adds (1–39) to (4–66) Physical Damage', tiers:9, ilvl:'1–75', weight:7800, tags:['Damage','Attack']},
  {mod:'+(6–45)% to Fire Resistance', tiers:8, ilvl:'1–82', weight:8000, tags:['Elemental','Fire']},
  {mod:'Damage Penetrates (10–15)% Cold Resistance', tiers:1, ilvl:'65', weight:0, tags:['Damage','Cold'], badge:'C', badgeType:'corrupt'}
];
