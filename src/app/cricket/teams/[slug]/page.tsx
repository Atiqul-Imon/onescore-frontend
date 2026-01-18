import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Award, CalendarDays, Newspaper, Trophy, Users, Flame, Star } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { FEATURED_CRICKET_TEAM_SLUGS } from '@/lib/cricket/teams';

type TeamDetailPayload = {
  team: {
    slug: string;
    name: string;
    shortName: string;
    matchKey: string;
    flag: string;
    heroImage?: string;
    summary?: string;
  firstTestYear?: number;
    board?: string;
    coach?: string;
    captains?: { test?: string; odi?: string; t20?: string };
    ranking?: { test?: number; odi?: number; t20?: number };
    fanPulse?: { rating: number; votes: number };
    colors?: { primary?: string; secondary?: string; accent?: string };
    iccTitles?: Array<{ name: string; year: number; result?: string }>;
    keyPlayers?: Array<{
      name: string;
      role: string;
      spotlight?: string;
      image?: string;
      stats?: { matches?: number; runs?: number; wickets?: number; average?: number; strikeRate?: number };
    }>;
    statLeaders?: {
      batting?: Array<{ name: string; runs?: number; innings?: number; average?: number; strikeRate?: number; description?: string }>;
      bowling?: Array<{ name: string; wickets?: number; innings?: number; average?: number; economy?: number; description?: string }>;
    };
    recordLinks?: Array<{ label: string; format?: string; url?: string }>;
    timeline?: Array<{ year: number; title: string; description?: string }>;
  };
  news: {
    featured: Article | null;
    items: Article[];
  };
  fixtures: {
    upcoming: CricketMatch[];
    results: CricketMatch[];
  };
  stats: {
    ranking?: TeamDetailPayload['team']['ranking'];
    fanPulse?: TeamDetailPayload['team']['fanPulse'];
    keyPlayers?: TeamDetailPayload['team']['keyPlayers'];
    statLeaders?: TeamDetailPayload['team']['statLeaders'];
    recordLinks?: TeamDetailPayload['team']['recordLinks'];
    iccTitles?: TeamDetailPayload['team']['iccTitles'];
  };
  timeline?: TeamDetailPayload['team']['timeline'];
  updatedAt: string;
};

type Article = {
  title: string;
  slug: string;
  summary?: string;
  heroImage?: string;
  type: string;
  publishedAt?: string;
  readingTimeMinutes?: number;
  tags?: string[];
};

type CricketMatch = {
  _id: string;
  series: string;
  status: 'live' | 'completed' | 'upcoming' | 'cancelled';
  format: string;
  startTime: string;
  venue?: { name?: string; city?: string };
  teams: {
    home: { name: string; shortName: string; flag?: string };
    away: { name: string; shortName: string; flag?: string };
  };
  currentScore?: {
    home: { runs: number; wickets: number; overs: number };
    away: { runs: number; wickets: number; overs: number };
  };
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const revalidate = 300;

const TEAM_NAME_MAP: Record<string, string> = {
  india: 'India',
  australia: 'Australia',
  england: 'England',
  pakistan: 'Pakistan',
  'sri-lanka': 'Sri Lanka',
  'south-africa': 'South Africa',
  'new-zealand': 'New Zealand',
  'west-indies': 'West Indies',
  bangladesh: 'Bangladesh',
  afghanistan: 'Afghanistan',
  ireland: 'Ireland',
  zimbabwe: 'Zimbabwe',
};

function buildPlaceholderTeam(slug: string): TeamDetailPayload {
  const name = TEAM_NAME_MAP[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  return {
    team: {
      slug,
      name,
      shortName: name.split(' ').map((word) => word[0]).join('').slice(0, 3).toUpperCase(),
      matchKey: slug,
      flag: '🏏',
      summary: `${name} team hub placeholder. Connect the backend to see live data.`,
      board: `${name} Cricket Board`,
      coach: 'TBD',
      firstTestYear: 1900,
      captains: {},
      ranking: {},
      fanPulse: { rating: 4.2, votes: 0 },
      colors: {
        primary: '#0f172a',
        secondary: '#1e293b',
        accent: '#22c55e',
      },
      iccTitles: [],
      keyPlayers: [],
      statLeaders: {},
      recordLinks: [],
      timeline: [],
    },
    news: {
      featured: null,
      items: [],
    },
    fixtures: {
      upcoming: [],
      results: [],
    },
    stats: {},
    timeline: [],
    updatedAt: new Date().toISOString(),
  };
}

async function fetchTeamDetail(slug: string): Promise<TeamDetailPayload> {
  try {
    const response = await fetch(`${API_BASE}/api/cricket/teams/${slug}`, {
      next: { revalidate },
    });

    if (response.status === 404) {
      notFound();
    }

    const json = await response.json();

    if (!json.success || !json.data) {
      return buildPlaceholderTeam(slug);
    }

    return json.data as TeamDetailPayload;
  } catch (error) {
    console.warn(`Failed to load team data for ${slug}, using placeholder.`, error);
    return buildPlaceholderTeam(slug);
  }
}

export async function generateStaticParams() {
  return FEATURED_CRICKET_TEAM_SLUGS.map((slug) => ({ slug }));
}

type TeamDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function TeamDetailPage({ params }: TeamDetailPageProps) {
  const { slug } = await params;
  const data = await fetchTeamDetail(slug);
  const { team, news, fixtures, stats, timeline } = data;

  const gradientStyle = {
    background: `linear-gradient(135deg, ${team.colors?.primary ?? '#0f172a'}, ${team.colors?.secondary ?? '#1e293b'})`,
  };

  return (
    <div className="bg-slate-950 text-white">
      <section className="relative overflow-hidden" style={gradientStyle}>
        <Container size="2xl" className="relative py-16 sm:py-20">
          <Link href="/cricket/teams" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition-standard hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            All teams
          </Link>
          <div className="grid gap-12 lg:grid-cols-[1.5fr,1fr]">
            <div>
              <div className="flex items-center gap-4">
                <span className="text-4xl">{team.flag}</span>
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/60">{team.shortName}</p>
                  <h1 className="heading-1 !text-white">{team.name}</h1>
                </div>
              </div>
              <p className="mt-6 text-base sm:text-lg text-white/85">{team.summary}</p>
              <div className="mt-8 flex flex-wrap gap-4 text-sm">
                <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">Board</p>
                  <p className="text-white font-semibold">{team.board ?? '—'}</p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">Coach</p>
                  <p className="text-white font-semibold">{team.coach ?? 'To be confirmed'}</p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">Fan pulse</p>
                  <p className="text-white font-semibold">
                    {stats.fanPulse?.rating?.toFixed(1) ?? '4.0'} / 5
                    <span className="ml-1 text-white/70">({stats.fanPulse?.votes ?? '—'} votes)</span>
                  </p>
                </div>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {(['test', 'odi', 't20'] as const).map((format) => (
                  <div key={format} className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center">
                    <p className="text-xs uppercase tracking-[0.4em] text-white/60">{format.toUpperCase()}</p>
                    <p className="mt-2 text-3xl font-semibold text-white">#{stats.ranking?.[format] ?? '—'}</p>
                    <p className="text-xs text-white/70">ICC ranking</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
              {team.heroImage ? (
                <div className="relative h-56 overflow-hidden rounded-2xl">
                  <Image
                    src={team.heroImage}
                    alt={team.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-56 rounded-2xl bg-slate-900" />
              )}
              <div className="mt-6 space-y-4 text-sm text-white/80">
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-primary-300" />
                  Captains: Tests {team.captains?.test ?? '—'} · ODIs {team.captains?.odi ?? '—'} · T20Is {team.captains?.t20 ?? '—'}
                </div>
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-4 w-4 text-primary-300" />
                  First Test appearance: {team.firstTestYear ?? '—'}
                </div>
                <div className="flex items-center gap-3">
                  <Trophy className="h-4 w-4 text-primary-300" />
                  ICC titles: {stats.iccTitles?.length ?? 0}
                </div>
                <p className="text-xs text-white/60">Updated {new Date(data!.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-padding bg-white text-slate-900">
        <Container size="2xl" className="grid gap-10 lg:grid-cols-[1.7fr,1fr]">
          <div className="space-y-8">
            <SectionHeading icon={<Newspaper className="h-4 w-4" />} title="Top stories" subtitle="Latest editorial coverage" />
            <div className="grid gap-6">
              {news.items.length === 0 ? (
                <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6 text-sm text-slate-600">
                  No recent news yet. We'll publish the latest updates as soon as the newsroom tags this team.
                </div>
              ) : (
                news.items.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/${article.slug}`}
                    className="group flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-standard hover:border-primary-200 hover:shadow-md sm:flex-row"
                  >
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-[0.3em] text-primary-600">{article.type.replace('_', ' ')}</p>
                      <h2 className="mt-2 text-lg font-semibold text-slate-900 group-hover:text-primary-700">{article.title}</h2>
                      <p className="mt-2 text-sm text-slate-600 line-clamp-3">{article.summary}</p>
                      <div className="mt-3 text-xs text-slate-500">
                        {article.publishedAt && new Date(article.publishedAt).toLocaleString(undefined, { dateStyle: 'medium' })}
                        {article.readingTimeMinutes ? ` • ${article.readingTimeMinutes} min read` : null}
                      </div>
                    </div>
                    {article.heroImage && (
                      <div className="relative h-32 w-full overflow-hidden rounded-2xl bg-slate-100 sm:h-40 sm:w-44">
                        <Image src={article.heroImage} alt={article.title} fill sizes="200px" className="object-cover" />
                      </div>
                    )}
                  </Link>
                ))
              )}
            </div>

            <SectionHeading icon={<CalendarDays className="h-4 w-4" />} title="Fixtures & results" subtitle="Synced from Onescore match lake" />
            <div className="grid gap-6 lg:grid-cols-2">
              <FixtureColumn title="Upcoming fixtures" matches={fixtures.upcoming} emptyMessage="All caught up for now." />
              <FixtureColumn title="Recent results" matches={fixtures.results} emptyMessage="No recent matches recorded." />
            </div>

            <SectionHeading icon={<Star className="h-4 w-4" />} title="Key performers" subtitle="Editorial spotlight + stat leaders" />
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">Key players</h3>
                <div className="mt-4 space-y-4">
                {stats.keyPlayers?.length ? (
                    stats.keyPlayers.map((player) => (
                      <div key={player.name} className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">{player.name}</p>
                          <p className="text-xs text-slate-500 uppercase tracking-[0.3em]">{player.role}</p>
                          <p className="mt-2 text-sm text-slate-600">{player.spotlight}</p>
                          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
                            {player.stats?.matches && <StatTile label="Matches" value={player.stats.matches} />}
                            {player.stats?.runs && <StatTile label="Runs" value={player.stats.runs} />}
                            {player.stats?.wickets && <StatTile label="Wickets" value={player.stats.wickets} />}
                            {player.stats?.average && <StatTile label="Average" value={player.stats.average} />}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">Player spotlights coming soon.</p>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-primary-600">Batting leaders</p>
                  <div className="mt-3 space-y-3">
                {stats.statLeaders?.batting?.length ? (
                      stats.statLeaders.batting.map((leader) => (
                        <LeaderRow key={`bat-${leader.name}`} leader={leader} />
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">Stats syncing soon.</p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-600">Bowling leaders</p>
                  <div className="mt-3 space-y-3">
                {stats.statLeaders?.bowling?.length ? (
                      stats.statLeaders.bowling.map((leader) => (
                        <LeaderRow key={`bowl-${leader.name}`} leader={leader} />
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">Stats syncing soon.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <SectionHeading icon={<Award className="h-4 w-4 text-slate-500" />} title="ICC cabinet" subtitle="Trophies & milestones" compact />
              <div className="mt-4 space-y-3">
                {stats.iccTitles?.length ? (
                  stats.iccTitles.map((title) => (
                    <div key={`${title.name}-${title.year}`} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                      <div>
                        <p className="font-semibold text-slate-900">{title.name}</p>
                        <p className="text-xs text-slate-500">{title.result ?? 'Champions'}</p>
                      </div>
                      <span className="text-base font-semibold text-slate-900">{title.year}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No ICC titles listed.</p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <SectionHeading icon={<Flame className="h-4 w-4 text-slate-500" />} title="Timeline" subtitle="Key chapters" compact />
              <div className="mt-4 space-y-4">
                {timeline?.length ? (
                  timeline.map((event) => (
                    <div key={`${event.year}-${event.title}`} className="border-l-2 border-slate-200 pl-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{event.year}</p>
                      <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                      <p className="text-xs text-slate-600">{event.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">Timeline data is being curated.</p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <SectionHeading icon={<Trophy className="h-4 w-4 text-slate-500" />} title="Record index" subtitle="Quick links" compact />
              <div className="mt-4 space-y-3">
                {stats.recordLinks?.length ? (
                  stats.recordLinks.map((record) => (
                    <Link
                      key={record.label}
                      href={record.url ?? '/records'}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3 text-sm font-medium text-slate-700 transition-standard hover:border-primary-200 hover:text-primary-700"
                    >
                      {record.label}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">Records index launching soon.</p>
                )}
              </div>
            </div>
          </aside>
        </Container>
      </section>
    </div>
  );
}

type SectionHeadingProps = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  compact?: boolean;
};

function SectionHeading({ icon, title, subtitle, compact }: SectionHeadingProps) {
  return (
    <div className={compact ? 'space-y-1' : 'mb-2 space-y-2'}>
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-500">
        {icon}
        {title}
      </div>
      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
    </div>
  );
}

function FixtureColumn({ title, matches, emptyMessage }: { title: string; matches: CricketMatch[]; emptyMessage: string }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <div className="mt-4 space-y-3">
        {matches.length === 0 ? (
          <p className="text-sm text-slate-500">{emptyMessage}</p>
        ) : (
          matches.map((match) => (
            <div key={match._id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="uppercase tracking-[0.3em]">{match.format.toUpperCase()}</span>
                <span>{new Date(match.startTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </div>
              <div className="mt-2 flex items-center justify-between font-semibold text-slate-900">
                <span>{match.teams.home.shortName}</span>
                <span>vs</span>
                <span>{match.teams.away.shortName}</span>
              </div>
              {match.venue?.name && (
                <p className="text-xs text-slate-500">{match.venue.name}{match.venue.city ? `, ${match.venue.city}` : ''}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function LeaderRow({ leader }: { leader: Record<string, any> & { name: string; description?: string } }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
      <p className="font-semibold text-slate-900">{leader.name}</p>
      {leader.description && <p className="text-xs text-slate-500">{leader.description}</p>}
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-500">
        {'runs' in leader && <StatTile label="Runs" value={leader.runs} />}
        {'wickets' in leader && <StatTile label="Wickets" value={leader.wickets} />}
        {'average' in leader && <StatTile label="Avg" value={leader.average} />}
        {'strikeRate' in leader && <StatTile label="SR" value={leader.strikeRate} />}
        {'economy' in leader && <StatTile label="Eco" value={leader.economy} />}
      </div>
    </div>
  );
}

function StatTile({ label, value }:{ label: string; value?: number }) {
  if (value === undefined || value === null) return null;
  return (
    <div>
      <p className="text-slate-900 font-semibold">{value}</p>
      <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">{label}</p>
    </div>
  );
}

