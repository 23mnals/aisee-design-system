// ─────────────────────────────────────────────────────────────
// Engage feature — shared domain types
// ─────────────────────────────────────────────────────────────

export type Platform = "x" | "reddit";
export type PlatformSource = Platform | "all";

// ── Initial Config (page 01) ─────────────────────────────────
export type KeywordTag = "brand" | "competitor" | null;

export interface InitialKeyword {
    id: string;
    text: string;
    checked: boolean;
    tag: KeywordTag;
}

export interface InitialAccount {
    id: string;
    handle: string;
    role: string;
    on: boolean;
}

export interface InitialSubreddit {
    id: string;
    name: string;
    members: string;
    on: boolean;
}

// ── Keywords & Accounts (page 03) ────────────────────────────
export type KeywordType = "core" | "brand" | "competitor";

export interface Keyword {
    id: string;
    text: string;
    type: KeywordType;
    on: boolean;
    /** matches detected this week */
    weekN: number;
    /** count of feed posts currently mapped to this keyword */
    posts: number;
}

export interface PriorityAccount {
    id: string;
    handle: string;
    role: string;
    on: boolean;
    initial: string;
}

export interface Subreddit {
    id: string;
    name: string;
    members: string;
    on: boolean;
}

// ── Signal Feed (page 02) ────────────────────────────────────
export type IntentVariant = "intent" | "opinion" | "discuss" | "compare" | "data";
export type Quality = "high" | "medium" | "low";
export type Recency = "fresh" | "recent" | "older";

export interface FeedUser {
    handle: string;
    avatar: string;
    name?: string;
    followers?: string;
    followersN: number;
}

export interface FeedStats {
    likes?: number;
    replies?: number;
    upvotes?: number;
    comments?: number;
}

export interface FeedPost {
    id: string;
    platform: Platform;
    intent: string;
    intentVariant: IntentVariant;
    subreddit?: string;
    actionTag?: string;
    time: string;
    score: number;
    user: FeedUser;
    body: string;
    tags: string[];
    extraTagClass?: string;
    stats: FeedStats;
    keywordQuality: Quality;
    platformHeat: Quality;
    accountInfluence: Quality;
    recency: Recency;
    isPriority: boolean;
    keywordHit: string;
}

export interface RefineFilters {
    keywordQuality: Quality | "all";
    platformHeat: Quality | "all";
    accountInfluence: Quality | "all";
    recency: Recency | "all";
    priority: "all" | "on";
}

export type SortMode = "relevance" | "newest" | "engagement";

// ── Sent (page 04) ───────────────────────────────────────────
export interface SentPostStats {
    impressions: string;
    likes: number;
    retweets: number;
    replies: number;
    bookmarks: number;
}

export interface SentPost {
    id: string;
    platform: Platform;
    user: { handle: string; name: string; avatar: string };
    time: string;
    replied: boolean;
    body: string;
    stats: SentPostStats;
    trafficIdx: number;
    strategy: string;
}

// ── Reply Panel ──────────────────────────────────────────────
export type ReplyStrategy = "expert" | "data" | "empathy";

export interface ReplyAccount {
    id: string;
    handle: string;
    role: string;
    followers: string;
}
