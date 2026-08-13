/* global React */
/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// PlanCard — pricing / subscription tier card (Figma family "套餐_mo_starter",
// "套餐_mo_dev", "套餐_mo_pro" + "plan" / "price"). One column of the pricing
// grid: package icon + price, name + "For …" tag, credits line, CTA, then
// grouped feature sections with lime check ticks and MAX / trial / unlimited
// meta pills.
//
// Structure + tokens lifted verbatim from my-account.main.css `.plan-card` and
// the plan data shape in my-account.plans.js, so a card rendered here is 1:1
// with the My Account / Pricing pages. Self-contained (literal repo hex).
//
// Usage:
//   <PlanCard plan={PLAN_STARTER} />
//   <PlanCard plan={PLAN_PRO} onCta={() => upgrade('pro')} />
//
// `plan` shape:
//   { id, name, tag, price, priceUnit?, credits?, badge?, featured?,
//     icon?: ReactNode|htmlString,
//     cta: { label, kind: 'current'|'upgrade'|'primary' },
//     sections: [ { title, items: [ { label, meta?, metaKind?, dash? } ] } ] }
// Feature labels may contain inline HTML (<b>, <br>, <span>) — rendered as-is.
// ─────────────────────────────────────────────────────────────────────────────

const T = {
  black: '#111111',
  muted: 'rgba(17,17,17,0.6)',
  faint: 'rgba(17,17,17,0.4)',
  border: 'rgba(17,17,17,0.06)',
  limeBright: '#C9FE12',
  yellow: '#FFE253',
  cream: '#F7F6E9',
  orange: '#EC5212',
  orangeSoft: '#FFE9D9',
};

export const META_STYLES = {
  max:       { background: T.orangeSoft, color: T.orange, fontWeight: 600 },
  trial:     { background: '#FFE5E0',    color: T.orange, fontWeight: 600 },
  unlimited: { background: 'rgba(17,17,17,0.05)', color: T.muted },
  default:   { background: 'rgba(17,17,17,0.05)', color: T.muted },
};

export const CTA_STYLES = {
  current: { background: '#E9E9E9', color: T.black, cursor: 'default' },
  upgrade: { background: '#E9E9E9', color: T.black, cursor: 'pointer' },
  primary: { background: T.black,   color: '#fff',  cursor: 'pointer' },
};

function CheckTick({ dash }) {
  if (dash) {
    return (
      <span style={{ width: 16, height: 16, display: 'inline-flex', alignItems: 'center',
        justifyContent: 'center', flexShrink: 0, marginTop: 2, color: T.faint, fontWeight: 700 }}>−</span>
    );
  }
  return (
    <span style={{ width: 16, height: 16, borderRadius: 4, background: T.limeBright,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, marginTop: 2 }}>
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 6.2l2.4 2.4 4.6-5.2" stroke={T.black} strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function FeatureItem({ item }) {
  const label = typeof item === 'string' ? item : item.label;
  const meta = typeof item === 'string' ? null : item.meta;
  const metaStyle = META_STYLES[(item && item.metaKind) || 'default'] || META_STYLES.default;
  return (
    <li style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13.5, lineHeight: 1.45 }}>
      <CheckTick dash={item && item.dash} />
      <span dangerouslySetInnerHTML={{ __html: label }} />
      {meta && (
        <span style={{ marginLeft: 'auto', alignSelf: 'center', fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10.5, padding: '2px 6px', borderRadius: 9999, whiteSpace: 'nowrap', ...metaStyle }}>
          {meta}
        </span>
      )}
    </li>
  );
}

export function PlanCard({ plan, onCta, style }) {
  if (!plan) return null;
  const cta = plan.cta || { label: 'Choose', kind: 'upgrade' };
  const ctaStyle = CTA_STYLES[cta.kind] || CTA_STYLES.upgrade;
  return (
    <div style={{
      position: 'relative',
      background: '#FAFAFA',
      border: `1px solid ${T.border}`,
      borderRadius: 18,
      padding: '28px 24px',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Karla', sans-serif",
      color: T.black,
      width: 300,
      ...style,
    }}>
      {plan.badge && (
        <div style={{
          position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
          background: T.yellow, color: T.black, fontSize: 11, fontWeight: 700,
          letterSpacing: '0.04em', textTransform: 'uppercase',
          padding: '4px 12px', borderRadius: 9999, whiteSpace: 'nowrap',
        }}>{plan.badge}</div>
      )}

      {/* Top: icon + price */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ width: 48, height: 48, borderRadius: 10, background: T.cream,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {typeof plan.icon === 'string'
            ? <span dangerouslySetInnerHTML={{ __html: plan.icon }} />
            : plan.icon}
        </div>
        <div style={{ fontFamily: "'Karla', sans-serif", fontSize: 36, fontWeight: 600, lineHeight: 1 }}>
          {plan.price}
          <small style={{ fontFamily: "'Karla', sans-serif", fontSize: 13, color: T.muted, fontWeight: 400, marginLeft: 2 }}>
            {plan.priceUnit || '/ Month'}
          </small>
        </div>
      </div>

      {/* Name + tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <h4 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{plan.name}</h4>
        {plan.tag && (
          <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
            color: T.muted, background: 'rgba(17,17,17,0.04)', padding: '3px 8px', borderRadius: 9999 }}>
            {plan.tag}
          </span>
        )}
      </div>

      {plan.desc && (
        <p style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.55, margin: '0 0 14px' }}>{plan.desc}</p>
      )}

      {plan.credits && (
        <div style={{ fontSize: 14, marginBottom: 16 }}>
          <b style={{ fontSize: 18 }}>{plan.credits}</b>
          <small style={{ color: T.muted, fontSize: 13, marginLeft: 4 }}>credits / mo</small>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={cta.kind === 'current' ? undefined : onCta}
        style={{
          height: 44, borderRadius: 10, border: 0, marginBottom: 20,
          fontFamily: "'Karla', sans-serif", fontSize: 14, fontWeight: 600,
          width: '100%', ...ctaStyle,
        }}>
        {cta.label}
      </button>

      {/* Feature sections */}
      <div style={{ paddingTop: 4 }}>
        {(plan.sections || []).map((sec, si) => (
          <div key={si}>
            <div style={{
              fontSize: 11, fontWeight: 600, color: T.orange,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              margin: si === 0 ? '0 0 10px' : '14px 0 10px',
            }}>{sec.title}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(sec.items || []).map((it, ii) => <FeatureItem key={ii} item={it} />)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
