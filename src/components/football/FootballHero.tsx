'use client';

import { motion } from 'framer-motion';
import { Container, Button } from '@/components/ui';
import { PlayCircle } from 'lucide-react';

export function FootballHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-10 left-20 w-24 h-24 border border-white/60 rounded-full" />
        <div className="absolute top-32 right-24 w-20 h-20 border border-white/60 rounded-full" />
        <div className="absolute bottom-16 left-40 w-32 h-32 border border-white/60 rounded-full" />
      </div>

      <Container size="2xl" className="relative z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
            <PlayCircle className="w-4 h-4 text-primary-300" />
            Experience Football Differently
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            Live Coverage, Tactical Insight, and Storytelling from Every Football Theatre
          </h1>
          <p className="mt-4 text-lg text-blue-100 md:text-xl">
            Streamlined dashboards for matchdays, in-depth analysis for purists, and curated
            highlights for fans on the go.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-10 flex flex-col items-center gap-4"
        >
          <Button size="lg" className="bg-primary-500 hover:bg-primary-400">
            Explore Live Match Centre
            <PlayCircle className="ml-2 w-5 h-5" />
          </Button>
          <p className="text-sm text-blue-100/80">
            Follow Champions League nights, Premier League weekends, and continental showdowns in
            one place.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
