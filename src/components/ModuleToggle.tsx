export type AiseeTheme = 'analysis' | 'post-agent' | 'engage';
export interface ModuleToggleProps { value: AiseeTheme; onValueChange: (value: AiseeTheme) => void; }
const modules: Array<{ id: AiseeTheme; icon: string; label: string }> = [
  { id: 'analysis', icon: '◫', label: 'Analysis' },
  { id: 'post-agent', icon: '✦', label: 'Post Agent' },
  { id: 'engage', icon: '◎', label: 'Engage' },
];
export function ModuleToggle({ value, onValueChange }: ModuleToggleProps) {
  return <div className="aisee-module-toggle" aria-label="功能模块">
    {modules.map((item) => <button key={item.id} className="aisee-module-toggle__item" type="button" aria-pressed={value === item.id} aria-label={item.label} onClick={() => onValueChange(item.id)}><span aria-hidden="true">{item.icon}</span><span>{item.label}</span></button>)}
  </div>;
}
