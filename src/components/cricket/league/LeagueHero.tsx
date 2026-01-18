'use client';

import { motion } from 'framer-motion';
import { Container, Button } from '@/components/ui';
import { CricketLeagueMeta, CricketFixture } from '@/lib/cricket/types';
import { CalendarDays, MapPin, Trophy } from 'lucide-react';

interface CricketLeagueHeroProps {
  meta: CricketLeagueMeta;
  nextFixture?: CricketFixture;
}

export function CricketLeagueHero({ meta, nextFixture }: CricketLeagueHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-slate-900 to-blue-900 text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-10 left-10 h-24 w-24 rounded-full border border-white/60" />
        <div className="absolute top-32 right-16 h-20 w-20 rounded-full border border-white/60" />
        <div className="absolute bottom-16 left-1/3 h-28 w-28 rounded-full border border-white/60" />
      </div>

      <Container size="2xl" className="relative z-10 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="space-y-5 max-w-2xl">
            <div className="flex items-center gap-3">
              <img src={meta.crest} alt={meta.name} className="h-16 w-16 rounded-full bg-white p-2 shadow-inner" />
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide backdrop-blur">
                  <Trophy className="h-3.5 w-3.5 text-primary-300" />
                  {meta.format} · {meta.nation}
                </span>
                <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{meta.name}</h1>
              </div>
            </div>
            <p className="text-lg text-primary-100/80">{meta.description}</p>
            {meta.founded && (
              <p className="text-sm text-primary-100/70">
                Established {meta.founded}. Follow every innings, partnership, and tactical twist.
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-primary-500 hover:bg-primary-400">
                View Points Table
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Full Fixture List
              </Button>
            </div>
          </div>

          {nextFixture && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-full max-w-md rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm"
            >
              <p className="text-xs uppercase tracking-wide text-primary-200">Next Highlighted Match</p>
              <h3 className="mt-3 text-xl font-semibold text-white">
                {nextFixture.homeTeam} vs {nextFixture.awayTeam}
              </h3>
              <p className="text-sm text-primary-100/80">
                {nextFixture.matchNumber} · {nextFixture.format} {nextFixture.dayNight ? '· Day/Night' : ''}
              </p>
              <div className="mt-4 space-y-2 text-sm text-primary-100/80">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary-300" />
                  {new Date(nextFixture.kickoff).toLocaleString('en-IN', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary-300" />
                  {nextFixture.venue}
                </div>
                {nextFixture.broadcast && (
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary-300" />
                    Live on {nextFixture.broadcast}
                  </div>
                )}
              </div>
              <p className="mt-4 text-xs text-primary-100/70">
                Get ball-by-ball commentary, wagon wheels, Manhattan charts, and post-match analysis.
              </p>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </section>
  );
}

