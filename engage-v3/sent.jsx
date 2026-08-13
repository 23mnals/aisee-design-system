/* global React, icons, PlatformX, PlatformR */
const { useState: useStateSent } = React;

// Sample sent data
const SENT_DATA = [
  {
    id: "s1",
    platform: "x",
    user: { handle: "@viaOxgina", name: "Francesca Illing", avatar: "F" },
    time: "16h",
    replied: false,
    body: '"This is one of the most common gaps we see — most brands score under 30 on AI Presence even with solid content. Three things that consistently move the needle…"',
    stats: { impressions: "18.0K", likes: 229, retweets: 43, replies: 66, bookmarks: 120 },
    trafficIdx: 630,
    strategy: "Expert answer"
  },
  {
    id: "s2",
    platform: "x",
    user: { handle: "@via HILY", name: "HILY", avatar: "H" },
    time: "16h",
    replied: false,
    body: '"This is one of the most common gaps we see — most brands score under 30 on AI Presence even with solid content. Three things that consistently move the needle…"',
    stats: { impressions: "18.0K", likes: 229, retweets: 43, replies: 66, bookmarks: 120 },
    trafficIdx: 630,
    strategy: "Expert answer"
  },
  {
    id: "s3",
    platform: "x",
    user: { handle: "@viaOxgina", name: "Berryxia.AI", avatar: "B" },
    time: "16h",
    replied: true,
    body: '"This is one of the most common gaps we see — most brands score under 30 on AI Presence even with solid content. Three things that consistently move the needle…"',
    stats: { impressions: "18.0K", likes: 229, retweets: 43, replies: 66, bookmarks: 120 },
    trafficIdx: 630,
    strategy: "Expert answer"
  },
  {
    id: "s4",
    platform: "reddit",
    user: { handle: "u/Viktor_Oddy", name: "Viktor Oddy", avatar: "V" },
    time: "16h",
    replied: true,
    body: '"This is one of the most common gaps we see — most brands score under 30 on AI Presence even with solid content. Three things that consistently move the needle…"',
    stats: { impressions: "18.0K", likes: 229, retweets: 43, replies: 66, bookmarks: 120 },
    trafficIdx: 630,
    strategy: "Expert answer"
  }
];

function SentStatCard({ value, suffix, label }) {
  return (
    <div className="sent-stat">
      <div className="sent-stat-num">
        <span className="big">{value}</span>
        {suffix && <span className="suf">{suffix}</span>}
      </div>
      <div className="sent-stat-lbl">{label}</div>
    </div>
  );
}

function SentCard({ post }) {
  const isX = post.platform === "x";
  const traffic = post.trafficIdx;

  return (
    <article className="sent-card">
      <div className="sent-card-head">
        <span className="sent-av">{post.user.avatar}</span>
        <span className="sent-name">{post.user.name}</span>
        <span className="sent-handle">{post.user.handle}</span>
        <span className={`platform-pill ${isX ? "" : "r"}`}>
          {isX ? <PlatformX size={11} /> : <PlatformR />}
        </span>
        <div style={{ flex: 1 }}></div>
        {post.replied &&
          <span className="replied-pill">{icons.check(11)} Author replied</span>
        }
        <span className="sent-time">{post.time}</span>
      </div>

      <div className="sent-body">{post.body}</div>

      <div className="sent-stats">
        <span className="sent-stat-cell">
          <span className="sc-ico">{icons.bolt(13)}</span>
          <span className="sc-num">{post.stats.impressions}</span>
          <span className="sc-lbl">Impressions</span>
        </span>
        <span className="sent-stat-cell">
          <span className="sc-ico" style={{ color: "#EC5212" }}>{icons.heart(13)}</span>
          <span className="sc-num" style={{ color: "#EC5212" }}>{post.stats.likes}</span>
          <span className="sc-lbl">Likes</span>
        </span>
        <span className="sent-stat-cell">
          <span className="sc-ico">{icons.refreshSync(13)}</span>
          <span className="sc-num">{post.stats.retweets}</span>
          <span className="sc-lbl">Retweets</span>
        </span>
        <span className="sent-stat-cell">
          <span className="sc-ico">{icons.msgCount(13)}</span>
          <span className="sc-num">{post.stats.replies}</span>
          <span className="sc-lbl">Replies</span>
        </span>
        <span className="sent-stat-cell">
          <span className="sc-ico">{icons.bookmark(13)}</span>
          <span className="sc-num">{post.stats.bookmarks}</span>
          <span className="sc-lbl">Bookmarks</span>
        </span>
      </div>

      <div className="sent-foot">
        <div className="traffic-idx">
          <span className="lbl">{isX ? "X" : "Reddit"} Traffic Index</span>
          <span className="val">{traffic}</span>
          <span className="bar"><span style={{ width: `${Math.min(100, traffic / 10)}%` }}></span></span>
        </div>
        <span className="strategy-pill">{post.strategy}</span>
        <a href="#" className="view-post" onClick={(e) => e.preventDefault()}>
          View Post {icons.ext(12)}
        </a>
      </div>
    </article>
  );
}

window.SentPage = function SentPage() {
  const [plat, setPlat] = useStateSent("all"); // all | x | reddit
  const [range, setRange] = useStateSent("week"); // today | week | month

  const xCount = SENT_DATA.filter((p) => p.platform === "x").length;
  const rCount = SENT_DATA.filter((p) => p.platform === "reddit").length;

  const filtered = SENT_DATA.filter((p) => {
    if (plat === "x" && p.platform !== "x") return false;
    if (plat === "reddit" && p.platform !== "reddit") return false;
    return true;
  });

  return (
    <div className="sent-page">
      {/* Sub-filter row */}
      <div className="sent-filter-row">
        <div className="sent-filter-left">
          <button
            className={`sent-plat-pill ${plat === "x" ? "on" : ""}`}
            onClick={() => setPlat(plat === "x" ? "all" : "x")}>
            <span className="sent-plat-ico"><PlatformX size={11} /></span>
            <span>X</span>
            <span className="sent-plat-ct">{xCount}</span>
          </button>
          <button
            className={`sent-plat-pill r ${plat === "reddit" ? "on" : ""}`}
            onClick={() => setPlat(plat === "reddit" ? "all" : "reddit")}>
            <span className="sent-plat-ico"><PlatformR /></span>
            <span>Reddit</span>
            <span className="sent-plat-ct">{rCount}</span>
          </button>
        </div>
        <div className="sent-range">
          <button className={`sent-range-tab ${range === "today" ? "on" : ""}`} onClick={() => setRange("today")}>Today</button>
          <button className={`sent-range-tab ${range === "week" ? "on" : ""}`} onClick={() => setRange("week")}>This week</button>
          <button className={`sent-range-tab ${range === "month" ? "on" : ""}`} onClick={() => setRange("month")}>Month</button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="sent-stats-grid">
        <SentStatCard value="2" label="X replies sent" />
        <SentStatCard value="100" suffix="%" label="Author replied" />
        <SentStatCard value="18.9" suffix="K" label="Total impressions" />
        <SentStatCard value="118" label="Avg. likes" />
      </div>

      {/* History */}
      <div className="sent-history-head">
        <span className="sent-history-lbl">HISTORY</span>
        <span className="sent-history-ct">{filtered.length} replies</span>
      </div>

      <div className="sent-list">
        {filtered.map((p) => <SentCard key={p.id} post={p} />)}
      </div>
    </div>
  );
};
