// ─────────────────────────────────────────────────────────────
// Engage feature — typed mock data
// Pulls from the colocated mock-data.json so the same payload
// can be swapped for an API response later without changing
// the component code.
// ─────────────────────────────────────────────────────────────
import raw from "./mock-data.json";
import type {
    FeedPost,
    InitialAccount,
    InitialKeyword,
    InitialSubreddit,
    Keyword,
    PriorityAccount,
    SentPost,
    Subreddit,
} from "./types";

export const INITIAL_KEYWORDS = raw.initialKeywords as InitialKeyword[];
export const INITIAL_ACCOUNTS = raw.initialAccounts as InitialAccount[];
export const INITIAL_SUBREDDITS = raw.initialSubreddits as InitialSubreddit[];

export const SEED_KEYWORDS = raw.keywords as Keyword[];
export const SEED_X_ACCOUNTS = raw.priorityAccounts as PriorityAccount[];
export const SEED_SUBREDDITS = raw.subreddits as Subreddit[];

export const FEED_DATA = raw.feed as FeedPost[];
export const SENT_DATA = raw.sent as SentPost[];

/** Used to size the keyword usage progress bars. */
export const MAX_WEEK = 600;
