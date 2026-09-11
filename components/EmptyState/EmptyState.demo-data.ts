import type { EmptyStateIllustrationName } from '../../src/components/EmptyStateIllustration';

export interface EmptyStateExampleCopy {
  title: string;
  description: string;
  primaryAction: string;
  secondaryAction?: string;
}

/** Demo scenarios only. Product copy remains owned by the calling application. */
export const emptyStateExampleCopy: Record<EmptyStateIllustrationName, EmptyStateExampleCopy> = {
  'no-event': {
    title: 'No matching posts available yet',
    description: 'We’re looking for relevant posts for this task. Check back later or update your keywords and accounts.',
    primaryAction: 'Update keywords', secondaryAction: 'Refresh',
  },
  'no-account': {
    title: 'No accounts tracked',
    description: 'Track the creators and publishers in your space — everything they post reaches your feed.',
    primaryAction: 'Track an account',
  },
  'no-time-slot': {
    title: 'No time slots available',
    description: 'Add an available time slot before scheduling your next post.',
    primaryAction: 'Add time slot',
  },
  nothing: {
    title: 'No results found',
    description: 'Nothing matches your current filters. Adjust your search or clear the filters to try again.',
    primaryAction: 'Clear filters', secondaryAction: 'Edit search',
  },
  'no-report': {
    title: 'No report yet',
    description: 'Run a brand analysis to see your visibility, insights and recommended next steps.',
    primaryAction: 'Run analysis',
  },
  'no-credit': {
    title: 'No credits available',
    description: 'Add credits before starting your next analysis or content task.',
    primaryAction: 'View credit options',
  },
  'no-media': {
    title: 'No media added',
    description: 'Upload an image or video to include media in your post.',
    primaryAction: 'Upload media',
  },
  'free-use': {
    title: 'This feature is not included in your plan',
    description: 'Review the available plans to find the features you need.',
    primaryAction: 'View plans',
  },
  bound: {
    title: 'Account connected',
    description: 'Your account is connected and ready to use. Manage the connection whenever you need to.',
    primaryAction: 'Manage connection',
  },
  nobody: {
    title: 'No team members yet',
    description: 'Invite teammates to collaborate on your workspace and share progress.',
    primaryAction: 'Invite teammates',
  },
  link: {
    title: 'Your link is ready',
    description: 'Review the link before sharing it with your team or audience.',
    primaryAction: 'View link',
  },
  plugin: {
    title: 'Plugin not connected',
    description: 'Install and connect the browser plugin to use AISEE in your workflow.',
    primaryAction: 'Set up plugin',
  },
  successful: {
    title: 'All set',
    description: 'Your setup is complete. You can continue to your workspace.',
    primaryAction: 'Continue',
  },
  unlock: {
    title: 'Feature unlocked',
    description: 'This feature is now available. Open it to get started.',
    primaryAction: 'Explore feature',
  },
};
