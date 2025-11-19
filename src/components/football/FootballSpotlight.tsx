import { Container, Card, Button } from '@/components/ui';
import { Video, Mic2, Newspaper, PenSquare } from 'lucide-react';

const spotlightItems = [
  {
    title: 'Tactical Boardroom',
    description: 'Animated explainers on high-pressing systems, inverted full-backs, and upcoming trends reshaping football.',
    cta: 'Watch Latest Episode',
    icon: Video,
  },
  {
    title: 'Transfer Radar',
    description: 'Verified updates on top targets, contract situations, and scouting notes across Europe and South America.',
    cta: 'View Transfer Tracker',
    icon: PenSquare,
  },
  {
    title: 'Voices of the Game',
    description: 'Weekly podcasts featuring analysts, ex-players, and data scientists. Matchweek previews & fan debates.',
    cta: 'Listen to Podcast',
    icon: Mic2,
  },
  {
    title: 'Weekend Briefing',
    description: 'Concise prep guide covering form, injuries, referee assignments, and betting odds for marquee fixtures.',
    cta: 'Read Briefing',
    icon: Newspaper,
  },
];

export function FootballSpotlight() {
  return (
    <section className="section-padding bg-slate-950 text-gray-100">
      <Container size="xl">
        <div className="mb-10 text-center">
          <h2 className="heading-2 text-slate-50 drop-shadow-lg tracking-wide">Spotlight: Everything Football Fans Need</h2>
          <p className="text-base text-gray-100 leading-relaxed max-w-3xl mx-auto">
            Curated storytelling, analysis, and multimedia experiences tailored for supporters who refuse to miss a beat.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {spotlightItems.map((item) => (
            <Card
              key={item.title}
              variant="interactive"
              padding="lg"
              className="h-full border border-white/10 bg-white/5 text-gray-100 backdrop-blur-sm hover:border-emerald-400/70"
            >
              <item.icon className="w-7 h-7 text-emerald-400" />
              <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-300">{item.description}</p>
              <div className="mt-auto pt-4">
                <Button variant="outline" className="border-emerald-500 text-emerald-300 hover:bg-emerald-500 hover:text-white">
                  {item.cta}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

