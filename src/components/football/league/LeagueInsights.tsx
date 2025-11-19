import { LeagueInsight } from '@/lib/football/types';

interface LeagueInsightsProps {
  insights: LeagueInsight[];
}

export function LeagueInsights({ insights }: LeagueInsightsProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-900">Notebook Insights</h2>
        <p className="text-sm text-gray-500">Tactical notes, injury tracker, and storylines worth monitoring</p>
      </div>
      <div className="grid gap-4 px-4 py-4 md:grid-cols-3">
        {insights.map((panel) => (
          <div key={panel.title} className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
            <h3 className="text-sm font-semibold text-gray-900">{panel.title}</h3>
            <ul className="mt-2 space-y-2 text-xs leading-relaxed text-gray-600">
              {panel.items.map((item, index) => (
                <li key={`${panel.title}-${index}`} className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

