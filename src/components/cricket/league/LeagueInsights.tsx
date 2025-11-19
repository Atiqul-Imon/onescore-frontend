import { CricketInsightPanel } from '@/lib/cricket/types';
import { Lightbulb } from 'lucide-react';

interface CricketLeagueInsightsProps {
  insights: CricketInsightPanel[];
}

export function CricketLeagueInsights({ insights }: CricketLeagueInsightsProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Insight Desk</h2>
          <p className="text-sm text-gray-500">Pitch preview, team whispers, and tactical cues</p>
        </div>
      </div>
      <div className="grid gap-4 p-4 lg:grid-cols-2">
        {insights.map((panel) => (
          <div key={panel.title} className="rounded-xl border border-gray-100 bg-emerald-50/40 p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Lightbulb className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">{panel.title}</h3>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              {panel.items.map((item, index) => (
                <li key={index} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

