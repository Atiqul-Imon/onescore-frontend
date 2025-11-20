export const FEATURED_CRICKET_TEAM_SLUGS = [
  'india',
  'australia',
  'england',
  'pakistan',
  'new-zealand',
  'south-africa',
  'bangladesh',
  'sri-lanka',
  'west-indies',
  'afghanistan',
  'ireland',
  'zimbabwe',
] as const;

export type FeaturedCricketTeamSlug = typeof FEATURED_CRICKET_TEAM_SLUGS[number];

