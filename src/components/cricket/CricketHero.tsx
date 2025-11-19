'use client';

import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';
import { Container, Button } from '@/components/ui';

export function CricketHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-500 via-emerald-700 to-slate-900 text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 h-20 w-20 rounded-full border border-white/60" />
        <div className="absolute top-1/3 right-10 h-16 w-16 rounded-full border border-white/60" />
        <div className="absolute bottom-24 right-16 h-24 w-24 rounded-full border border-white/60" />
      </div>

      <Container size="2xl" className="relative z-10 py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-100 backdrop-blur">
            <Radio className="h-3.5 w-3.5" />
            Live Cricket Coverage
          </span>
          <h1 className="heading-1 text-white drop-shadow-lg">Cricket Hub</h1>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="/cricket/leagues" className="inline-flex">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-emerald-900 hover:bg-white/90 shadow-lg"
              >
                Explore League Hubs
              </Button>
            </a>
            <a href="/threads?topic=cricket" className="inline-flex">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 hover:text-white"
              >
                Join Crowd Threads
              </Button>
            </a>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
