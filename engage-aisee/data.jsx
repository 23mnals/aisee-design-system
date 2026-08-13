/* global window */
/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// data.jsx → app/(pages)/engage/_lib/data.ts
// Sample fixture data. In the real repo this would be typed and likely fetched
// from an API endpoint; here it's static for the prototype.
// ─────────────────────────────────────────────────────────────────────────────

window.EngageData = {
  feed: [
    {
      id: "p1",
      platform: "x",
      intent: "Help-seeking",
      intentVariant: "intent",
      time: "1h",
      score: 94,
      user: { handle: "@seo_practitioner", followers: "12.4K followers", avatar: "M" },
      body: "Our brand is completely invisible on ChatGPT and Perplexity. We publish great content but AI never mentions us. How do you actually optimize for generative AI search? Anyone seen real results? #GEO",
      tags: ["GEO", "Pain-point hit"],
      stats: { likes: 234, replies: 45 },
      extraTagClass: "painpoint",
      keywordQuality: "high",
      platformHeat: "high",
      accountInfluence: "medium",
      recency: "fresh",
      isPriority: false,
    },
    {
      id: "p2",
      platform: "reddit",
      intent: "Discussion",
      intentVariant: "discuss",
      subreddit: "r/SEO",
      time: "3h",
      score: 87,
      actionTag: "Manual reply",
      user: { handle: "u/digital_mktg_pro", avatar: "d" },
      body: "Does GEO (Generative Engine Optimization) actually work? Been trying to get our SaaS mentioned by ChatGPT for months. Tried FAQ schema, structured data… nothing moves the needle. Anyone cracked this?",
      tags: ["GEO", "Hot 847↑"],
      stats: { upvotes: 847, comments: 156 },
      keywordQuality: "high",
      platformHeat: "high",
      accountInfluence: "low",
      recency: "fresh",
      isPriority: false,
    },
    {
      id: "p3",
      platform: "x",
      intent: "Hot take",
      intentVariant: "opinion",
      time: "5h",
      score: 82,
      user: { handle: "@ai_marketing_hub", followers: "45.2K followers", avatar: "A" },
      body: "Hot take: Traditional SEO is dead. AI search visibility will be the #1 marketing priority for B2B SaaS in 2025. Most companies have zero idea how AI perceives their brand right now.",
      tags: ["GEO", "Big account"],
      stats: { likes: 1200, replies: 89 },
      keywordQuality: "medium",
      platformHeat: "medium",
      accountInfluence: "high",
      recency: "recent",
      isPriority: true,
    },
    {
      id: "p4",
      platform: "reddit",
      intent: "Comparison",
      intentVariant: "compare",
      subreddit: "r/marketing",
      time: "6h",
      score: 76,
      actionTag: "Manual reply",
      user: { handle: "u/saas_founder_2024", avatar: "S" },
      body: "Has anyone compared tools for tracking AI search visibility? Looking for something that monitors how ChatGPT and Perplexity describe my brand. Semrush doesn't seem to cover this well.",
      tags: ["Competitor mention", "Decision stage"],
      extraTagClass: "competitor",
      stats: { upvotes: 156, comments: 43 },
      keywordQuality: "high",
      platformHeat: "medium",
      accountInfluence: "low",
      recency: "recent",
      isPriority: false,
    },
    {
      id: "p5",
      platform: "x",
      intent: "Data share",
      intentVariant: "data",
      time: "8h",
      score: 71,
      user: { handle: "@growth_metrics", followers: "8.9K followers", avatar: "g" },
      body: "Just analyzed 200 B2B brands across ChatGPT, Perplexity & Claude. Only 18% had consistent brand mentions across all 3. The gap between SEO presence and AI presence is wider than most realize.",
      tags: ["Data point"],
      stats: { likes: 412, replies: 28 },
      keywordQuality: "medium",
      platformHeat: "low",
      accountInfluence: "medium",
      recency: "older",
      isPriority: false,
    },
  ],

  seedKeywords: [
    { id: "k1", text: "GEO optimization",     type: "core",       on: true,  weekN: 234, posts: 2 },
    { id: "k2", text: "AI search visibility", type: "core",       on: true,  weekN: 189, posts: 2 },
    { id: "k3", text: "ChatGPT SEO",          type: "core",       on: true,  weekN: 445, posts: 1 },
    { id: "k4", text: "Perplexity marketing", type: "core",       on: true,  weekN: 123, posts: 0 },
    { id: "k5", text: "generative search",    type: "core",       on: true,  weekN: 567, posts: 0 },
    { id: "k6", text: "AISEE",                type: "brand",      on: true,  weekN: 12,  posts: 0 },
    { id: "k7", text: "Semrush AI",           type: "competitor", on: false, weekN: 89,  posts: 0 },
  ],

  seedAccounts: [
    { id: "a1", handle: "@KorayGubur",       role: "GEO expert",        on: true, initial: "K" },
    { id: "a2", handle: "@searchengineland", role: "SEO publication",   on: true, initial: "S" },
    { id: "a3", handle: "@aleyda",           role: "International SEO", on: true, initial: "A" },
  ],

  seedSubs: [
    { id: "s1", name: "SEO",            members: "1.2M",  on: true  },
    { id: "s2", name: "marketing",      members: "890K",  on: true  },
    { id: "s3", name: "ChatGPT",        members: "4.1M",  on: true  },
    { id: "s4", name: "SaaS",           members: "320K",  on: true  },
    { id: "s5", name: "artificial",     members: "960K",  on: false },
    { id: "s6", name: "GrowthHacking",  members: "270K",  on: false },
  ],

  sent: [
    {
      id: "snt1",
      platform: "x",
      user: { handle: "@viaOxgina",  name: "Francesca Illing", avatar: "F" },
      time: "16h",
      replied: false,
      body: '"This is one of the most common gaps we see — most brands score under 30 on AI Presence even with solid content. Three things that consistently move the needle…"',
      stats: { impressions: "18.0K", likes: 229, retweets: 43, replies: 66, bookmarks: 120 },
      trafficIdx: 630,
      strategy: "Expert answer",
    },
    {
      id: "snt2",
      platform: "x",
      user: { handle: "@via_HILY",  name: "HILY", avatar: "H" },
      time: "16h",
      replied: false,
      body: '"This is one of the most common gaps we see — most brands score under 30 on AI Presence even with solid content. Three things that consistently move the needle…"',
      stats: { impressions: "18.0K", likes: 229, retweets: 43, replies: 66, bookmarks: 120 },
      trafficIdx: 630,
      strategy: "Expert answer",
    },
    {
      id: "snt3",
      platform: "x",
      user: { handle: "@viaBerryxia", name: "Berryxia.AI", avatar: "B" },
      time: "16h",
      replied: true,
      body: '"This is one of the most common gaps we see — most brands score under 30 on AI Presence even with solid content. Three things that consistently move the needle…"',
      stats: { impressions: "18.0K", likes: 229, retweets: 43, replies: 66, bookmarks: 120 },
      trafficIdx: 630,
      strategy: "Expert answer",
    },
    {
      id: "snt4",
      platform: "reddit",
      user: { handle: "u/Viktor_Oddy", name: "Viktor Oddy", avatar: "V" },
      time: "16h",
      replied: true,
      body: '"This is one of the most common gaps we see — most brands score under 30 on AI Presence even with solid content. Three things that consistently move the needle…"',
      stats: { impressions: "18.0K", likes: 229, retweets: 43, replies: 66, bookmarks: 120 },
      trafficIdx: 630,
      strategy: "Expert answer",
    },
  ],

  strategies: [
    { id: "expert",  ttl: "Expert answer", sub: "Structured steps" },
    { id: "data",    ttl: "Data-backed",   sub: "Cite numbers" },
    { id: "empathy", ttl: "Empathetic",    sub: "Acknowledge pain first" },
  ],

  draftsByStrategy: {
    expert: `This is one of the most common gaps we see — most brands score under 30 on AI Presence even with solid content.

Three things that consistently move the needle:
① FAQ schema — Q&A format that AI loves to cite directly
② Topical depth — clusters of 5+ pages on one narrow concept
③ External validation — getting cited on high-authority sources AI actually reads (not just Google's top results)

Happy to share the audit framework we use — it's surfaced these patterns across 500+ B2B brands.`,
    data: `We analyzed 500+ B2B brands across ChatGPT, Perplexity and Claude — only 18% had consistent mentions across all three.

The single biggest predictor of AI visibility (r=0.71): structured FAQ markup. Brands with 20+ FAQ entries showed a 3.2× higher citation rate vs. those relying on traditional SEO content alone.

Schema alone won't fix invisibility, but it's the cheapest lever we've measured.`,
    empathy: `Totally feel this — we hear it from almost every brand we onboard. Months of content, zero AI surface area, and no clear feedback loop on what's actually wrong.

The honest answer: AI engines read your content very differently from Google. Most "SEO-optimized" pages are still invisible to them because the structure doesn't match how LLMs retrieve facts.

If it helps, we put together a short diagnostic — happy to share what we usually look at first.`,
  },

  postAccounts: [
    { id: "a1", handle: "@aisee_official", role: "Brand account",   followers: "8.2K" },
    { id: "a2", handle: "@geo_insights",   role: "Content account", followers: "3.1K" },
  ],

  filterOpts: {
    keywordQuality: [
      { id: "all", label: "Any" },
      { id: "high", label: "High", desc: "exact / brand" },
      { id: "medium", label: "Medium", desc: "topical match" },
      { id: "low", label: "Low", desc: "broad" },
    ],
    platformHeat: [
      { id: "all", label: "Any" },
      { id: "high", label: "Hot", desc: "500+ engagement" },
      { id: "medium", label: "Warm", desc: "100+ engagement" },
      { id: "low", label: "Cool", desc: "low engagement" },
    ],
    accountInfluence: [
      { id: "all", label: "Any" },
      { id: "high", label: "Big", desc: "10K+ followers" },
      { id: "medium", label: "Mid", desc: "1K–10K" },
      { id: "low", label: "Small", desc: "<1K" },
    ],
    recency: [
      { id: "all", label: "Any time" },
      { id: "fresh", label: "< 3h" },
      { id: "recent", label: "< 12h" },
      { id: "older", label: "12h+" },
    ],
    priority: [
      { id: "all", label: "All accounts" },
      { id: "on", label: "Priority only" },
    ],
  },
};
