// aisee Web App UI Kit — Shared Components
// Load via <script type="text/babel" src="Components.jsx">

// ─── Logo Mark ───────────────────────────────────────────────────
function LogoMark({ size = 25, darkFace = true }) {
  const h = size * 1.04;
  const eyeW = size * 0.4, eyeH = size * 0.32;
  return (
    <div style={{ position: 'relative', width: size, height: h, flexShrink: 0 }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: size, height: h, borderRadius: '320px 320px 0 0', background: '#CFF229' }} />
      <div style={{ position: 'absolute', left: 0, top: 1, width: size, height: size, borderRadius: '320px 320px 0 0', background: darkFace ? '#111' : '#333', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: '50%', top: '38%', transform: 'translateX(-50%)', width: eyeW, height: eyeH, borderRadius: '50%', background: '#fff' }} />
      </div>
    </div>
  );
}

// ─── App Header ──────────────────────────────────────────────────
function AppHeader({ activeNav = 'Dashboard', credits = 1825, module = 'Post Agent' }) {
  const navItems = ['Dashboard', 'Calendar', 'Channels', 'Post Agent', 'Models'];
  const modulePrimary = module === 'Analysis' ? '#CFFF29' : '#FFE253';
  return (
    <div style={{ width: '100%', height: 70, background: '#fff', borderBottom: '1px solid rgba(17,17,17,0.06)', display: 'flex', alignItems: 'center', padding: '0 24px', position: 'relative', flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 32 }}>
        <LogoMark size={25} />
        <span style={{ fontFamily: 'Karla', fontSize: 16, fontWeight: 500, color: '#111' }}>aisee</span>
      </div>
      {/* Nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {navItems.map(item => (
          <div key={item} style={{ padding: '6px 14px', borderRadius: 8, fontSize: 14, fontFamily: 'Karla', cursor: 'pointer', background: item === activeNav ? modulePrimary : 'transparent', color: '#111', fontWeight: item === activeNav ? 500 : 400 }}>
            {item}
          </div>
        ))}
      </div>
      {/* Right */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#FFFADD', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer' }}>
          <BellIcon />
          <div style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%', background: '#EC5212', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 9, color: '#fff', fontWeight: 600, fontFamily: 'Karla' }}>7</span>
          </div>
        </div>
        <div style={{ height: 32, borderRadius: 10, background: modulePrimary, display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', cursor: 'pointer' }}>
          <PlusIcon />
          <span style={{ fontSize: 14, fontWeight: 500, fontFamily: 'Karla', color: '#111' }}>New</span>
        </div>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E1E1E1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#111', fontFamily: 'Karla' }}>A</span>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────
function Sidebar({ activeItem = 'Dashboard', tab = 'Post Agent' }) {
  const modulePrimary = tab === 'Analysis' ? '#CFFF29' : '#FFE253';
  const navItems = [
    { label: 'Dashboard', icon: '▦' },
    { label: 'Calendar', icon: '▦' },
    { label: 'Channels', icon: '◎' },
    { label: 'Post Agent', icon: '▦' },
    { label: 'Models', icon: '▦' },
    { label: 'Media', icon: '▦' },
  ];
  return (
    <div style={{ width: 224, height: '100%', background: '#fff', borderRight: '1px solid rgba(17,17,17,0.05)', display: 'flex', flexDirection: 'column', padding: '12px 8px 16px', flexShrink: 0 }}>
      {/* Tab toggle */}
      <div style={{ background: 'rgba(17,17,17,0.02)', borderRadius: 8, padding: 4, display: 'flex', gap: 1, marginBottom: 12 }}>
        {['Analysis', 'Post Agent', 'Engage'].map(t => (
          <div key={t} style={{ flex: 1, padding: '3px 0', borderRadius: 8, background: t === tab ? '#FFFFFF' : 'transparent', boxShadow: t === tab ? 'inset 0 0 0 1px rgba(17,17,17,0.05), 0 1px 2px rgba(0,0,0,0.12)' : 'none', textAlign: 'center', fontSize: 13, fontWeight: 500, fontFamily: 'Karla', color: t === tab ? '#111' : 'rgba(17,17,17,0.5)', cursor: 'pointer' }}>
            {t}
          </div>
        ))}
      </div>
      {/* Nav items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {navItems.map(({ label, icon }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', borderRadius: 8, background: label === activeItem ? modulePrimary : 'transparent', cursor: 'pointer', fontSize: 14, fontFamily: 'Karla', color: '#111' }}>
            <div style={{ width: 18, height: 18, borderRadius: 4, background: 'rgba(17,17,17,0.1)', flexShrink: 0 }} />
            {label}
          </div>
        ))}
      </div>
      {/* Profile section */}
      <div style={{ border: '1px solid rgba(17,17,17,0.05)', borderRadius: 8, padding: '10px 8px 12px', background: '#FAFAFA' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#111', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#111', fontFamily: 'Karla' }}>ccbakala36@gmail…</div>
            <div style={{ fontSize: 11, color: 'rgba(17,17,17,0.6)', fontFamily: 'Karla' }}>Starter plan</div>
          </div>
        </div>
        <div style={{ borderTop: '1px dashed #E5E6EC', paddingTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#111', fontFamily: 'Karla' }}>1825 Credits</span>
          </div>
          <div style={{ height: 6, borderRadius: 4, background: 'rgba(17,17,17,0.05)', overflow: 'hidden' }}>
            <div style={{ width: '60%', height: '100%', background: '#CFF229', borderRadius: 4 }} />
          </div>
        </div>
        <div style={{ marginTop: 10, padding: '6px', borderRadius: 8, background: 'rgba(17,17,17,0.05)', textAlign: 'center', fontSize: 13, fontWeight: 500, fontFamily: 'Karla', color: '#111', cursor: 'pointer' }}>
          Logout
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────
function StatCard({ label, value, unit = '', sub = '', accent = false }) {
  return (
    <div style={{ background: accent ? '#CFF229' : '#fff', borderRadius: 12, padding: '14px 16px', minWidth: 160, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div style={{ fontSize: 11, color: accent ? 'rgba(17,17,17,0.6)' : 'rgba(17,17,17,0.5)', fontFamily: 'Karla', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: '#111', fontFamily: 'Karla' }}>{value}<span style={{ fontSize: 14, fontWeight: 400, color: 'rgba(17,17,17,0.5)' }}>{unit}</span></div>
      {sub && <div style={{ fontSize: 11, color: 'rgba(17,17,17,0.5)', fontFamily: 'Karla', marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

// ─── Post Card ───────────────────────────────────────────────────
function PostCard({ content, platform = 'X', status = 'Scheduled', time = 'Today 8:20 AM' }) {
  const statusColors = { Scheduled: '#FFF2B3', Sent: '#A5D500', Draft: 'rgba(17,17,17,0.06)', Failed: '#FFD0D0' };
  return (
    <div style={{ background: '#fff', borderRadius: 10, border: '1px solid rgba(17,17,17,0.07)', padding: '12px 14px', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#E1E1E1' }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: '#111', fontFamily: 'Karla' }}>@aisee_hq</span>
        <div style={{ width: 14, height: 14, borderRadius: 3, background: '#111', marginLeft: 2 }} />
      </div>
      <div style={{ fontSize: 13, color: '#111', lineHeight: 1.5, fontFamily: 'Karla', marginBottom: 10 }}>{content}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 999, background: statusColors[status] || '#f0f0f0', color: '#111', fontFamily: 'Karla' }}>{status}</span>
        <span style={{ fontSize: 11, color: 'rgba(17,17,17,0.5)', fontFamily: 'Karla' }}>{time}</span>
      </div>
    </div>
  );
}

// ─── Small Icons (inline SVG) ────────────────────────────────────
function BellIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
}
function PlusIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}
function CalIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
}
function XIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}
function CheckIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;
}

// ─── Channel Badge ────────────────────────────────────────────────
function ChannelBadge({ name, connected = true }) {
  const colors = { X: '#111', LinkedIn: '#0A66C2', Reddit: '#FF4500', TikTok: '#111', YouTube: '#FF0000' };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 10, background: '#fff', border: '1px solid rgba(17,17,17,0.08)', width: '100%' }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', background: colors[name] || '#E1E1E1', flexShrink: 0 }} />
      <span style={{ fontSize: 13, fontWeight: 500, color: '#111', fontFamily: 'Karla', flex: 1 }}>{name}</span>
      <div style={{ width: 20, height: 20, borderRadius: '50%', background: connected ? '#CFF229' : 'rgba(17,17,17,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {connected ? <CheckIcon /> : null}
      </div>
    </div>
  );
}

// ─── Calendar Day Cell ───────────────────────────────────────────
function CalDay({ day, hasPost = false, active = false }) {
  return (
    <div style={{ width: 40, height: 44, borderRadius: 8, background: active ? '#FFE253' : 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, cursor: 'pointer' }}>
      <span style={{ fontSize: 13, fontFamily: 'Karla', color: '#111' }}>{day}</span>
      {hasPost && <div style={{ width: 5, height: 5, borderRadius: '50%', background: active ? '#111' : '#CFF229' }} />}
    </div>
  );
}

// ─── Dropdown ────────────────────────────────────────────────────
function Dropdown({ items, selected }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #000', borderRadius: 8, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: 8, minWidth: 135 }}>
      {items.map(item => (
        <div key={item} style={{ padding: '6px 10px', borderRadius: 6, fontSize: 14, fontFamily: 'Karla', color: '#111', background: item === selected ? '#FFE253' : 'transparent', cursor: 'pointer' }}>{item}</div>
      ))}
    </div>
  );
}

// ─── Create Post Modal ───────────────────────────────────────────
function CreatePostModal({ onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.32)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: '16px 16px 0 0', width: '100%', maxWidth: 480, padding: 20, boxShadow: '0 20px 24px rgba(0,0,0,0.1)', marginBottom: 0 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Karla', color: '#111' }}>Create Post</span>
          <div style={{ cursor: 'pointer', padding: 4 }} onClick={onClose}><XIcon /></div>
        </div>
        {/* Platform row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {['X', 'LinkedIn', 'Reddit'].map(p => (
            <div key={p} style={{ width: 32, height: 32, borderRadius: '50%', background: '#E1E1E1', border: '1px solid #111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, fontFamily: 'Karla', color: '#111', cursor: 'pointer' }}>{p[0]}</div>
          ))}
          <div style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(17,17,17,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><PlusIcon /></div>
        </div>
        {/* Editor */}
        <div style={{ border: '1px solid rgba(17,17,17,0.05)', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
          <div style={{ background: '#F7F6E9', padding: '6px 12px', display: 'flex', gap: 8, borderBottom: '1px solid rgba(17,17,17,0.05)' }}>
            <span style={{ fontSize: 12, fontFamily: 'Karla', color: 'rgba(17,17,17,0.6)', cursor: 'pointer' }}>B</span>
            <span style={{ fontSize: 12, fontFamily: 'Karla', color: 'rgba(17,17,17,0.6)', cursor: 'pointer' }}>😊</span>
          </div>
          <div style={{ padding: '10px 12px', minHeight: 80, fontSize: 14, fontFamily: 'Karla', color: 'rgba(17,17,17,0.4)' }}>Start writing your post...</div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 12px 8px' }}>
            <div style={{ background: 'rgba(17,17,17,0.04)', border: '1px solid rgba(17,17,17,0.12)', borderRadius: 8, padding: '3px 8px', fontSize: 11, fontWeight: 500, fontFamily: 'Karla', color: '#111' }}>280</div>
          </div>
        </div>
        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, border: '1px solid rgba(17,17,17,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><XIcon /></div>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#CFF229', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><CheckIcon /></div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  LogoMark, AppHeader, Sidebar, StatCard, PostCard,
  ChannelBadge, CalDay, Dropdown, CreatePostModal,
  BellIcon, PlusIcon, CalIcon, XIcon, CheckIcon,
});
