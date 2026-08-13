/* global React, icons, PlatformX, PlatformR */
// ─── Tracking feature components for the Replies page ───────────
// Loaded before engage-replies-tracking.jsx; exposes components on window.

const { useState: useTState, useEffect: useTEffect } = React;

// Hosted-tracking monitoring schedule (the rule the credit cost follows)
// `perDay` is the credits spent on each day inside that age band.
const TRACK_SCHEDULE = [
  { window: "0 – 24 h",  freq: "Every 1 h",       days: [0],          perDay: 5 },
  { window: "24 – 48 h", freq: "Every 12 h",      days: [1],          perDay: 3 },
  { window: "48 – 72 h", freq: "Every 24 h",      days: [2],          perDay: 2 },
  { window: "Day 4 – 7", freq: "Every 24 h",      days: [3, 4, 5, 6], perDay: 1 },
  { window: "Day 8 +",   freq: "Monitoring ends", days: [],           perDay: 0 },
];
const HOSTED_RATE = 5; // Credits / reply / day on day 0 (peak window)

// Cost for a single tracked reply on a given day index (0-based). Single source
// of truth so the estimate and the schedule table can never drift (§A5).
function dayCost(dayIndex) {
  const band = TRACK_SCHEDULE.find((b) => b.days.includes(dayIndex));
  return band ? band.perDay : 0;
}
// Sum of the first N days of one reply's monitoring. Days 0–6 → 5+3+2+1+1+1+1 = 14.
function replyEstimate(daysCount) {
  let sum = 0;
  for (let d = 0; d < daysCount; d++) sum += dayCost(d);
  return sum;
}
const HOSTED_7DAY_ESTIMATE = replyEstimate(7); // 14 — derived, not hard-coded

// ─── Animated tracking eye (inline) ─────────────────────────────
let _eyeSeq = 0;
function TrackEye({ size = 22 }) {
  const idRef = React.useRef(null);
  if (!idRef.current) idRef.current = `te-${++_eyeSeq}`;
  const u = idRef.current;
  const h = Math.round(size * 56 / 80);
  return (
    <span className="aisee-eye" role="img" aria-label="Tracking" style={{ width: size, height: h, display: "inline-block", lineHeight: 0 }}>
      <svg viewBox="0 0 80 56" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id={`${u}-o`}><ellipse cx="39.76" cy="28" rx="39.76" ry="28" /></clipPath>
          <clipPath id={`${u}-r`}><rect x="27.0015" y="18.5996" width="26.2682" height="11.6658" /></clipPath>
          <clipPath id={`${u}-a`}><path d="M27.0015 24.4125 C35.7612 16.662 44.5209 16.662 53.2806 24.4125 C44.5209 32.163 35.7612 32.163 27.0015 24.4125 Z" /></clipPath>
          <clipPath id={`${u}-d`}><path d="M17.0737 32.0633 C17.0737 19.3258 27.3995 9 40.137 9 C52.8745 9 63.2003 19.3258 63.2003 32.0633 V57 H17.0737 Z" /></clipPath>
        </defs>
        <ellipse cx="39.76" cy="28" rx="39.76" ry="28" fill="#111111" />
        <g clipPath={`url(#${u}-o)`}>
          <path d="M17.0737 32.0633 C17.0737 19.3258 27.3995 9 40.137 9 C52.8745 9 63.2003 19.3258 63.2003 32.0633 V57 H17.0737 Z" fill="#FFE253" />
          <g clipPath={`url(#${u}-r)`}>
            <g clipPath={`url(#${u}-a)`}>
              <rect x="27.0015" y="18.5996" width="26.2682" height="11.6658" fill="#FFFFFF" />
              <rect className="aisee-pupil" x="34.3008" y="14.6548" width="11.7675" height="11.6658" rx="5.83288" fill="#111111" />
            </g>
          </g>
          <g clipPath={`url(#${u}-d)`}>
            <rect className="aisee-lid" x="27" y="16" width="26.27" height="15" fill="#FFE253" />
          </g>
        </g>
      </svg>
    </span>
  );
}

// ─── The two-option chooser (shared by popover + success modal) ──
function TrackChooser({ mode, setMode, compact }) {
  return (
    <div className={`track-opts ${compact ? "compact" : ""}`}>
      <button className={`track-opt ${mode === "plugin" ? "on" : ""}`} onClick={() => setMode("plugin")}>
        <span className="opt-top">
          <span className={`opt-radio ${mode === "plugin" ? "on" : ""}`}>{mode === "plugin" && <span className="dot"></span>}</span>
          <span className="opt-ico plugin">{icons.ext(14)}</span>
          <span className="opt-name">Plugin tracking</span>
          <span className="opt-free">Free</span>
        </span>
        <span className="opt-desc">Refreshes only when the aisee browser extension opens the page.</span>
        {!compact && (
          <ul className="opt-checks">
            <li>{icons.check(11)} No credits used</li>
            <li>{icons.check(11)} Best for everyday tracking</li>
          </ul>
        )}
      </button>

      <button className={`track-opt hosted ${mode === "hosted" ? "on" : ""}`} onClick={() => setMode("hosted")}>
        <span className="opt-top">
          <span className={`opt-radio ${mode === "hosted" ? "on" : ""}`}>{mode === "hosted" && <span className="dot"></span>}</span>
          <span className="opt-ico hosted">{icons.cloud ? icons.cloud(14) : icons.refreshSync(13)}</span>
          <span className="opt-name">Hosted tracking</span>
          <span className="opt-rec">Recommended</span>
        </span>
        <span className="opt-desc">aisee monitors this reply 24/7 in the cloud — you never miss interaction data.</span>
        {!compact && (
          <ul className="opt-checks hosted">
            <li>{icons.check(11)} 24/7 cloud monitoring</li>
            <li>{icons.check(11)} No browser needed</li>
            <li>{icons.check(11)} Never miss interaction data</li>
          </ul>
        )}
        <span className="opt-price">{HOSTED_RATE} Credits <span className="u">/ reply / day</span></span>
      </button>
    </div>
  );
}

// ─── Billing affordability (drives every credit boundary) ────────
// Returns the billing posture for starting/continuing hosted tracking given a
// live credit balance. Single helper so every dialog agrees (§A2, §A3, §D).
function billingState(balance, replyCount = 1) {
  const tomorrow = HOSTED_RATE * replyCount;          // worst-case next-day cost
  const week = HOSTED_7DAY_ESTIMATE * replyCount;     // first-week cost (tapers)
  const runwayDays = Math.floor(balance / Math.max(tomorrow, 1));
  let level;
  if (balance < tomorrow) level = "blocked";          // can't even cover tomorrow
  else if (balance < week) level = "warn";            // covers a few days, not the week
  else level = "ok";
  return { tomorrow, week, runwayDays, level, balance };
}

// Shared estimate + pre-check strip used by both start dialogs.
function BillingPanel({ balance, pool, onRecharge, single = true }) {
  const b = billingState(balance, 1);
  return (
    <div className={`track-estimate billing ${b.level}`}>
      <div className="te-row">
        <span className="te-lbl">Estimated spend · first 7 days</span>
        <span className="te-val">~{HOSTED_7DAY_ESTIMATE} Credits</span>
      </div>
      <div className="bp-pool">
        {icons.info(11)} Charged <b>per day</b> from {pool && pool.subscription > 0 ? "subscription credits, then top-up" : "your top-up balance"} — never prepaid.
      </div>

      {b.level === "ok" && (
        <div className="bp-note ok">
          {icons.check(12)} Balance covers the full first week. Cost tapers daily (5 → 1 cr).
        </div>
      )}
      {b.level === "warn" && (
        <div className="bp-note warn">
          {icons.info(12)}
          <span>Your <b>{balance.toLocaleString()} cr</b> covers about <b>{b.runwayDays} day{b.runwayDays === 1 ? "" : "s"}</b>. When it runs out we auto-switch this reply to <b>free plugin tracking</b> — the data line never breaks.</span>
        </div>
      )}
      {b.level === "blocked" && (
        <div className="bp-note blocked">
          {icons.info(12)}
          <span>Not enough credits to start hosted tracking (needs <b>{HOSTED_RATE} cr</b> for today). Add credits, or use free plugin tracking instead.</span>
        </div>
      )}

      {(b.level === "warn" || b.level === "blocked") && (
        <button className="bp-recharge" onClick={onRecharge}>{icons.plus(12)} Add credits</button>
      )}
    </div>
  );
}

// ─── Scenario 1: Track dialog (choose how to track) ────────────
function TrackPopover({ onClose, onStartHosted, onUseFree, balance = 9999, pool, onRecharge }) {
  const [mode, setMode] = useTState("hosted");
  const blocked = mode === "hosted" && billingState(balance, 1).level === "blocked";
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="track-pop dialog" role="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="track-pop-head">
          <div>
            <div className="tph-ttl">Track this reply</div>
            <div className="tph-sub">Choose how aisee follows this reply's performance.</div>
          </div>
          <button className="modal-close" onClick={onClose}>{icons.x(15)}</button>
        </div>

        <TrackChooser mode={mode} setMode={setMode} />

        {mode === "hosted" ? (
          <BillingPanel balance={balance} pool={pool} onRecharge={onRecharge} />
        ) : (
          <div className="track-estimate free">
            <div className="te-foot">{icons.info(11)} No credits used. Data updates whenever the extension is open.</div>
          </div>
        )}

        <div className="track-foot">
          <button className="modal-cancel" onClick={onClose}>Cancel</button>
          <button
            className="modal-submit"
            disabled={blocked}
            onClick={() => { if (blocked) return; mode === "hosted" ? onStartHosted() : onUseFree(); }}
          >
            {mode === "hosted" ? <>{icons.cloud(14)} Start hosted tracking</> : <>{icons.ext(13)} Use free plugin tracking</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Scenario 2: post-publish success modal w/ track upsell ──────
function TrackChoiceModal({ rec, onClose, onStartHosted, onUseFree, balance = 9999, pool, onRecharge }) {
  const [mode, setMode] = useTState("hosted");
  const plat = rec && rec.platform === "reddit" ? "Reddit" : "X";
  const blocked = mode === "hosted" && billingState(balance, 1).level === "blocked";
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal track-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close tm-close" onClick={onClose}>{icons.x(15)}</button>
        <div className="tm-celebrate">
          <span className="tm-check">{icons.check(26)}</span>
          <span className="confetti c1"></span><span className="confetti c2"></span>
          <span className="confetti c3"></span><span className="confetti c4"></span>
          <span className="confetti c5"></span><span className="confetti c6"></span>
        </div>
        <h2 className="tm-ttl">Reply published!</h2>
        <p className="tm-sub">Want aisee to track how this reply on {plat} performs?</p>

        <TrackChooser mode={mode} setMode={setMode} />

        {mode === "hosted" && (
          <BillingPanel balance={balance} pool={pool} onRecharge={onRecharge} />
        )}

        <div className="tm-actions">
          <button className="modal-cancel" onClick={onUseFree}>Use free</button>
          <button className="modal-submit" disabled={blocked} onClick={() => { if (blocked) return; onStartHosted(); }}>{icons.cloud(14)} Start hosted tracking</button>
        </div>
      </div>
    </div>
  );
}

// ─── Scenario 3: status chip shown on a tracked card ─────────────
function TrackingStatusChip({ tracking }) {
  if (!tracking) return null;
  if (tracking.mode === "hosted") {
    return (
      <span className="track-chip hosted">
        <span className="live-dot"></span>
        Hosted tracking
      </span>
    );
  }
  return (
    <span className="track-chip plugin">
      {icons.ext(11)} Plugin tracking · Free
    </span>
  );
}

// ─── Scenario 3: tracking-details dialog (manage a tracked reply) ─
function TrackingDetailsPopover({ rec, onClose, onSwitchPlugin, onStop, onStartHosted, onResumeHosted, balance = 9999 }) {
  const t = rec.tracking;
  const hosted = t && t.mode === "hosted";
  const downgraded = t && t.mode === "downgraded";
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="track-pop dialog details" role="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="track-pop-head">
          <div className="tph-ttl">Tracking details</div>
          <button className="modal-close" onClick={onClose}>{icons.x(15)}</button>
        </div>

        {downgraded && (
          <div className="bp-note blocked" style={{ marginTop: -2 }}>
            {icons.info(12)}
            <span>Credits ran out on <b>{t.downgradedAt}</b> — this reply auto-switched to <b>free plugin tracking</b>. No data was lost. Add credits to resume hosted monitoring.</span>
          </div>
        )}

        <div className="td-rows">
          <div className="td-row">
            <span className="td-lbl">Method</span>
            <span className="td-val">
              {hosted ? <><TrackEye size={16} /> Hosted</> : downgraded ? <>{icons.ext(12)} Plugin (auto)</> : <>{icons.ext(12)} Plugin (free)</>}
            </span>
          </div>
          <div className="td-row">
            <span className="td-lbl">Started</span>
            <span className="td-val">{t.startedAt}</span>
          </div>
          <div className="td-row">
            <span className="td-lbl">Frequency</span>
            <span className="td-val">{hosted ? "Smart · auto-adjusts" : "On extension visit"}</span>
          </div>
          <div className="td-row">
            <span className="td-lbl">Spent today</span>
            <span className="td-val">{hosted ? `${t.todaySpent} Credits` : "0 Credits"}</span>
          </div>
          <div className="td-row">
            <span className="td-lbl">Total spent · {t.days} days</span>
            <span className="td-val">{hosted ? `${t.totalSpent} Credits` : `${t.totalSpent || 0} Credits`}</span>
          </div>
          {hosted && (
            <div className="td-row">
              <span className="td-lbl">Charged from</span>
              <span className="td-val">Subscription → Top-up</span>
            </div>
          )}
        </div>

        {hosted && (
          <div className="td-foot-note">{icons.info(11)} Billed <b>per day</b>, never prepaid — stopping makes today the last charge, so there's nothing to refund.</div>
        )}

        <div className="td-actions">
          {hosted ? (
            <>
              <button className="td-link" onClick={onSwitchPlugin}>{icons.ext(12)} Switch to plugin tracking (free)</button>
              <button className="td-link danger" onClick={onStop}>{icons.x(12)} Stop hosted tracking</button>
            </>
          ) : downgraded ? (
            <>
              <button className="td-link primary" onClick={onResumeHosted}>{icons.cloud(14)} Resume hosted tracking</button>
              <button className="td-link" onClick={onStop}>{icons.x(12)} Stop tracking entirely</button>
            </>
          ) : (
            <button className="td-link primary" onClick={onStartHosted}>{icons.cloud(14)} Upgrade to hosted tracking</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Scenario 3: account-level tracking overview (click-triggered drawer) ──
// Account-level AGGREGATE across all hosted-tracked replies (not a single reply).
function TrackingOverview({ stats, tracked = [], onRecharge, onClose, onManage, pool, downgradedCount = 0, balanceDemo = "healthy", setBalanceDemo }) {
  const bs = billingState(stats.remaining, Math.max(stats.hostedCount, 1));
  return (
    <div className="tov-overlay" onClick={onClose}>
      <aside className="track-aside drawer" onClick={(e) => e.stopPropagation()}>
        <div className="tov-drawer-head">
          <div className="tdh-l">
            <TrackEye size={24} />
            <div>
              <div className="tov-ttl">Tracking overview</div>
              <div className="tov-sub">Hosted monitoring across your account</div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>{icons.x(15)}</button>
        </div>

        {downgradedCount > 0 && (
          <div className="tov-banner amber">
            {icons.info(13)}
            <span><b>{downgradedCount}</b> repl{downgradedCount === 1 ? "y" : "ies"} auto-switched to free when credits ran out. Add credits to resume hosted monitoring.</span>
          </div>
        )}
        {downgradedCount === 0 && bs.level === "warn" && (
          <div className="tov-banner amber">
            {icons.info(13)}
            <span>Balance covers about <b>{bs.runwayDays} day{bs.runwayDays === 1 ? "" : "s"}</b> at this rate. When it runs out, tracked replies auto-switch to free — never interrupted.</span>
          </div>
        )}
        {bs.level === "blocked" && stats.hostedCount > 0 && (
          <div className="tov-banner red">
            {icons.info(13)}
            <span>Balance won't cover tomorrow's <b>{bs.tomorrow} cr</b>. Hosted replies will auto-switch to free unless you add credits today.</span>
          </div>
        )}

      <div className="tov-card">
        <div className="tov-stats">
          <div className="tov-stat">
            <span className="lbl">Hosted-tracked replies</span>
            <span className="val">{stats.hostedCount}</span>
          </div>
          <div className="tov-stat">
            <span className="lbl">Estimated spend</span>
            <span className="val">{stats.estPerDay}<span className="u"> / day</span></span>
          </div>
          <div className="tov-stat">
            <span className="lbl">Spent today</span>
            <span className="val">{stats.spentToday}<span className="u"> Credits</span></span>
          </div>
          <div className="tov-stat">
            <span className="lbl">Credits remaining</span>
            <span className="val">{stats.remaining.toLocaleString()}</span>
          </div>
          <div className="tov-stat">
            <span className="lbl">Covers about</span>
            <span className={`val ${bs.level === "ok" ? "" : bs.level === "warn" ? "warn" : "danger"}`}>{bs.runwayDays.toLocaleString()}<span className="u"> days</span></span>
          </div>
        </div>
        {pool && (
          <div className="tov-pool">
            <span className="tov-pool-row"><span>Subscription</span><span>{pool.subscription.toLocaleString()} cr</span></span>
            <span className="tov-pool-bar"><span style={{ width: `${Math.round(100 * pool.subscription / Math.max(stats.remaining, 1))}%` }}></span></span>
            <span className="tov-pool-row"><span>Top-up</span><span>{pool.topup.toLocaleString()} cr</span></span>
            <span className="tov-pool-foot">{icons.info(10)} Hosted tracking draws from subscription first, then top-up.</span>
          </div>
        )}
        <button className="tov-recharge" onClick={onRecharge}>{icons.plus(13)} Top up credits</button>
      </div>

      <div className="tov-card">
        <div className="tov-list-head">
          <span className="sched-ttl">Tracked replies</span>
          <span className="tov-list-ct">{tracked.length}</span>
        </div>
        {tracked.length === 0 ? (
          <div className="tov-empty">No replies are being tracked yet.</div>
        ) : (
          <div className="tov-replies">
            {tracked.map((r) => {
              const hosted = r.tracking.mode === "hosted";
              return (
                <button className="tov-reply" key={r.id} onClick={() => onManage && onManage(r.id)}>
                  <span className={`tov-reply-plat ${r.platform}`}>{r.platform === "reddit" ? "r" : "X"}</span>
                  <span className="tov-reply-mid">
                    <span className="tov-reply-who">{r.target.name}</span>
                    <span className="tov-reply-txt">{r.reply}</span>
                  </span>
                  <span className="tov-reply-right">
                    {hosted ? (
                      <span className="track-chip hosted sm"><span className="live-dot"></span>{r.tracking.todaySpent || 0} cr</span>
                    ) : (
                      <span className="track-chip plugin sm">Free</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="tov-card">
        <div className="sched-head">
          <span className="sched-ttl">Monitoring frequency</span>
          <span className="sched-tag"><TrackEye size={14} /> Hosted</span>
        </div>
        <div className="sched-table">
          <div className="sched-row sched-h">
            <span>Age</span><span>Check rate</span><span className="r">Cost / day</span>
          </div>
          {TRACK_SCHEDULE.map((s, i) => (
            <div className="sched-row" key={i}>
              <span className="sw">{s.window}</span>
              <span className="sf">{s.freq}</span>
              <span className="sc r">{s.perDay > 0 ? `${s.perDay} cr` : "—"}</span>
            </div>
          ))}
        </div>
        <a href="#" className="sched-link" onClick={(e) => e.preventDefault()}>
          Learn more about monitoring rules {icons.arrowR(12)}
        </a>
      </div>

      {setBalanceDemo && (
        <div className="tov-demo">
          <span className="tov-demo-lbl">{icons.info(10)} Preview billing state</span>
          <div className="tov-demo-seg">
            {[["healthy", "Healthy"], ["low", "Low"], ["empty", "Empty"]].map(([k, lbl]) => (
              <button key={k} className={balanceDemo === k ? "on" : ""} onClick={() => setBalanceDemo(k)}>{lbl}</button>
            ))}
          </div>
        </div>
      )}
      </aside>
    </div>
  );
}

Object.assign(window, {
  TRACK_SCHEDULE, HOSTED_RATE, HOSTED_7DAY_ESTIMATE, dayCost, replyEstimate, billingState,
  TrackEye, TrackChooser, BillingPanel, TrackPopover, TrackChoiceModal,
  TrackingStatusChip, TrackingDetailsPopover, TrackingOverview,
});
