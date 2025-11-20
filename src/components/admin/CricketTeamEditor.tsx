'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { getAuthHeaders } from '@/lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type KeyPlayer = {
  name: string;
  role: string;
  spotlight?: string;
  image?: string;
  stats?: {
    matches?: number;
    runs?: number;
    wickets?: number;
    average?: number;
    strikeRate?: number;
  };
};

type StatLeader = {
  name: string;
  runs?: number;
  wickets?: number;
  innings?: number;
  average?: number;
  strikeRate?: number;
  economy?: number;
  description?: string;
};

export type AdminCricketTeam = {
  slug: string;
  name: string;
  shortName: string;
  matchKey: string;
  flag: string;
  crest?: string;
  heroImage?: string;
  summary?: string;
  board?: string;
  coach?: string;
  captains?: { test?: string; odi?: string; t20?: string };
  ranking?: { test?: number; odi?: number; t20?: number };
  firstTestYear?: number;
  colors?: { primary?: string; secondary?: string; accent?: string };
  fanPulse?: { rating?: number; votes?: number };
  iccTitles?: Array<{ name?: string; year?: number; result?: string }>;
  keyPlayers?: KeyPlayer[];
  statLeaders?: {
    batting?: StatLeader[];
    bowling?: StatLeader[];
  };
  recordLinks?: Array<{ label?: string; format?: string; url?: string }>;
  timeline?: Array<{ year?: number; title?: string; description?: string }>;
  newsTags?: string[];
};

const EMPTY_TEAM: AdminCricketTeam = {
  slug: '',
  name: '',
  shortName: '',
  matchKey: '',
  flag: '',
  summary: '',
  board: '',
  coach: '',
  heroImage: '',
  captains: {},
  ranking: {},
  colors: { primary: '#0f172a', secondary: '#1e293b', accent: '#22c55e' },
  fanPulse: { rating: 4, votes: 0 },
  iccTitles: [],
  keyPlayers: [],
  statLeaders: { batting: [], bowling: [] },
  recordLinks: [],
  timeline: [],
  newsTags: [],
};

type CricketTeamEditorProps = {
  slug?: string;
  mode: 'create' | 'edit';
};

export function CricketTeamEditor({ slug, mode }: CricketTeamEditorProps) {
  const router = useRouter();
  const [team, setTeam] = useState<AdminCricketTeam>(EMPTY_TEAM);
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (mode === 'edit' && slug) {
      async function loadTeam() {
        try {
          setLoading(true);
          const res = await fetch(`${API_BASE}/api/admin/cricket/teams/${slug}`, {
            cache: 'no-store',
            headers: getAuthHeaders(),
          });
          if (!res.ok) {
            throw new Error('Unable to load team');
          }
          const json = await res.json();
          setTeam({
            ...EMPTY_TEAM,
            ...json.data,
            captains: json.data.captains || {},
            ranking: json.data.ranking || {},
            colors: json.data.colors || EMPTY_TEAM.colors,
            fanPulse: json.data.fanPulse || EMPTY_TEAM.fanPulse,
            iccTitles: json.data.iccTitles || [],
            keyPlayers: json.data.keyPlayers || [],
            statLeaders: {
              batting: json.data.statLeaders?.batting || [],
              bowling: json.data.statLeaders?.bowling || [],
            },
            recordLinks: json.data.recordLinks || [],
            timeline: json.data.timeline || [],
            newsTags: json.data.newsTags || [],
          });
        } catch (error) {
          console.error(error);
          setStatus({ type: 'error', message: 'Failed to load team data.' });
        } finally {
          setLoading(false);
        }
      }
      loadTeam();
    }
  }, [mode, slug]);

  const newsTagsValue = useMemo(() => (team.newsTags || []).join(', '), [team.newsTags]);

  const updateField = <K extends keyof AdminCricketTeam>(field: K, value: AdminCricketTeam[K]) => {
    setTeam((prev) => ({ ...prev, [field]: value }));
  };

  const updateNested = <T extends object>(field: keyof AdminCricketTeam, pathKey: string, value: any) => {
    setTeam((prev) => {
      const current = (prev[field] as T) || ({} as T);
      return { ...prev, [field]: { ...current, [pathKey]: value } };
    });
  };

  const updateArrayItem = <T extends any[]>(field: keyof AdminCricketTeam, index: number, value: Record<string, any>) => {
    setTeam((prev) => {
      const arr = ([...(prev[field] as T) || []] as any[]);
      arr[index] = { ...arr[index], ...value };
      return { ...prev, [field]: arr };
    });
  };

  const removeArrayItem = (field: keyof AdminCricketTeam, index: number) => {
    setTeam((prev) => {
      const arr = ([...(prev[field] as any[]) || []]);
      arr.splice(index, 1);
      return { ...prev, [field]: arr };
    });
  };

  const handleSave = async () => {
    if (!team.slug) {
      setStatus({ type: 'error', message: 'Slug is required.' });
      return;
    }

    try {
      setSaving(true);
      setStatus(null);
      const payload = {
        ...team,
        newsTags: (team.newsTags || []).map((tag) => tag.trim()).filter(Boolean),
      };
      const endpoint = mode === 'create'
        ? `${API_BASE}/api/admin/cricket/teams`
        : `${API_BASE}/api/admin/cricket/teams/${slug}`;
      const method = mode === 'create' ? 'POST' : 'PUT';
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Save failed');
      }

      const json = await res.json();
      setTeam({
        ...team,
        ...json.data,
      });
      setStatus({ type: 'success', message: 'Team saved successfully.' });

      if (mode === 'create') {
        router.push(`/admin/teams/${json.data.slug}`);
      }
    } catch (error: any) {
      console.error(error);
      setStatus({ type: 'error', message: error?.message || 'Failed to save team.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-gray-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading team data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-gray-500">{mode === 'edit' ? 'Edit team' : 'Create team'}</p>
          <h1 className="text-2xl font-semibold text-gray-900">Cricket team hub</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save changes
        </button>
      </div>

      {status && (
        <div className={`rounded-lg border px-4 py-3 text-sm ${status.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-red-200 bg-red-50 text-red-700'}`}>
          {status.message}
        </div>
      )}

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Identity</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-700">Slug</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={team.slug}
              disabled={mode === 'edit'}
              onChange={(e) => updateField('slug', e.target.value.toLowerCase())}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Match Key</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={team.matchKey}
              onChange={(e) => updateField('matchKey', e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Team Name</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={team.name}
              onChange={(e) => updateField('name', e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Short Name</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={team.shortName}
              onChange={(e) => updateField('shortName', e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Flag (emoji or URL)</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={team.flag}
              onChange={(e) => updateField('flag', e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Hero Image URL</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={team.heroImage || ''}
              onChange={(e) => updateField('heroImage', e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Board</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={team.board || ''}
              onChange={(e) => updateField('board', e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Coach</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={team.coach || ''}
              onChange={(e) => updateField('coach', e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">First Test Year</label>
            <input
              type="number"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={team.firstTestYear || ''}
              onChange={(e) => updateField('firstTestYear', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">News Tags (comma separated)</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={newsTagsValue}
              onChange={(e) => updateField('newsTags', e.target.value.split(',').map((tag) => tag.trim()))}
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700">Summary</label>
          <textarea
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            rows={3}
            value={team.summary || ''}
            onChange={(e) => updateField('summary', e.target.value)}
          />
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Leadership & rankings</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {(['test', 'odi', 't20'] as const).map((format) => (
            <div key={format}>
              <label className="text-sm font-medium text-gray-700">{format.toUpperCase()} Captain</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={team.captains?.[format] || ''}
                onChange={(e) => updateNested('captains', format, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {(['test', 'odi', 't20'] as const).map((format) => (
            <div key={`rank-${format}`}>
              <label className="text-sm font-medium text-gray-700">{format.toUpperCase()} Ranking</label>
              <input
                type="number"
                min={1}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={team.ranking?.[format] ?? ''}
                onChange={(e) => updateNested('ranking', format, e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Colors & fan pulse</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {(['primary', 'secondary', 'accent'] as const).map((key) => (
            <div key={key}>
              <label className="text-sm font-medium text-gray-700 capitalize">{key} color</label>
              <input
                type="color"
                className="mt-1 h-10 w-full rounded border border-gray-300"
                value={team.colors?.[key] || '#0f172a'}
                onChange={(e) => updateNested('colors', key, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-700">Fan rating (0-5)</label>
            <input
              type="number"
              min={0}
              max={5}
              step={0.1}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={team.fanPulse?.rating ?? ''}
              onChange={(e) => updateNested('fanPulse', 'rating', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Fan votes</label>
            <input
              type="number"
              min={0}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={team.fanPulse?.votes ?? ''}
              onChange={(e) => updateNested('fanPulse', 'votes', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>
      </section>

      <ArraySection
        title="ICC titles"
        description="Major trophies with year and optional description."
        items={team.iccTitles || []}
        onAdd={() => updateField('iccTitles', [...(team.iccTitles || []), { name: '', year: new Date().getFullYear(), result: '' }])}
        renderItem={(item, index) => (
          <div className="grid gap-3 md:grid-cols-3" key={`title-${index}`}>
            <input
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Tournament"
              value={item.name || ''}
              onChange={(e) => updateArrayItem('iccTitles', index, { name: e.target.value })}
            />
            <input
              type="number"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Year"
              value={item.year || ''}
              onChange={(e) => updateArrayItem('iccTitles', index, { year: e.target.value ? Number(e.target.value) : undefined })}
            />
            <input
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Result"
              value={item.result || ''}
              onChange={(e) => updateArrayItem('iccTitles', index, { result: e.target.value })}
            />
          </div>
        )}
        onRemove={(index) => removeArrayItem('iccTitles', index)}
      />

      <ArraySection
        title="Key players"
        description="Players highlighted on the team hub."
        items={team.keyPlayers || []}
        onAdd={() => updateField('keyPlayers', [...(team.keyPlayers || []), { name: '', role: '' }])}
        renderItem={(player, index) => (
          <div className="space-y-3" key={`player-${index}`}>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Name"
                value={player.name || ''}
                onChange={(e) => updateArrayItem('keyPlayers', index, { name: e.target.value })}
              />
              <input
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Role"
                value={player.role || ''}
                onChange={(e) => updateArrayItem('keyPlayers', index, { role: e.target.value })}
              />
            </div>
            <textarea
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Spotlight"
              value={player.spotlight || ''}
              onChange={(e) => updateArrayItem('keyPlayers', index, { spotlight: e.target.value })}
            />
          </div>
        )}
        onRemove={(index) => removeArrayItem('keyPlayers', index)}
      />

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Stat leaders</h2>
        {(['batting', 'bowling'] as const).map((category) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium uppercase tracking-wide text-gray-500">{category}</p>
              <button
                className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-600"
                onClick={() => updateField('statLeaders', {
                  ...team.statLeaders,
                  [category]: [...(team.statLeaders?.[category] || []), { name: '' }],
                })}
              >
                <Plus className="h-3 w-3" /> Add
              </button>
            </div>
            <div className="space-y-3">
              {(team.statLeaders?.[category] || []).map((leader, index) => (
                <div key={`${category}-${index}`} className="rounded-md border border-gray-200 p-3">
                  <div className="flex items-center justify-between">
                    <input
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                      placeholder="Name"
                      value={leader.name || ''}
                      onChange={(e) => {
                        const updated = {
                          ...(team.statLeaders || {}),
                        };
                        const arr = [...(updated[category] || [])];
                        arr[index] = { ...arr[index], name: e.target.value };
                        updated[category] = arr;
                        updateField('statLeaders', updated);
                      }}
                    />
                    <button
                      className="ml-2 rounded-md border border-gray-200 p-2 text-gray-500 hover:text-red-600"
                      onClick={() => {
                        const updated = {
                          ...(team.statLeaders || {}),
                        };
                        const arr = [...(updated[category] || [])];
                        arr.splice(index, 1);
                        updated[category] = arr;
                        updateField('statLeaders', updated);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 grid gap-2 md:grid-cols-3">
                    {['runs', 'wickets', 'average', 'strikeRate', 'economy'].map((field) => (
                      <input
                        key={`${category}-${index}-${field}`}
                        type="number"
                        step="0.1"
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                        placeholder={field}
                        value={(leader as any)[field] ?? ''}
                        onChange={(e) => {
                          const updated = { ...(team.statLeaders || {}) };
                          const arr = [...(updated[category] || [])];
                          arr[index] = {
                            ...arr[index],
                            [field]: e.target.value ? Number(e.target.value) : undefined,
                          };
                          updated[category] = arr;
                          updateField('statLeaders', updated);
                        }}
                      />
                    ))}
                  </div>
                  <textarea
                    className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Description"
                    value={leader.description || ''}
                    onChange={(e) => {
                      const updated = { ...(team.statLeaders || {}) };
                      const arr = [...(updated[category] || [])];
                      arr[index] = { ...arr[index], description: e.target.value };
                      updated[category] = arr;
                      updateField('statLeaders', updated);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <ArraySection
        title="Record links"
        description="Links to deep-dive features or record pages."
        items={team.recordLinks || []}
        onAdd={() => updateField('recordLinks', [...(team.recordLinks || []), { label: '', url: '' }])}
        renderItem={(record, index) => (
          <div className="grid gap-3 md:grid-cols-3" key={`record-${index}`}>
            <input
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Label"
              value={record.label || ''}
              onChange={(e) => updateArrayItem('recordLinks', index, { label: e.target.value })}
            />
            <input
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Format (optional)"
              value={record.format || ''}
              onChange={(e) => updateArrayItem('recordLinks', index, { format: e.target.value })}
            />
            <input
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="URL"
              value={record.url || ''}
              onChange={(e) => updateArrayItem('recordLinks', index, { url: e.target.value })}
            />
          </div>
        )}
        onRemove={(index) => removeArrayItem('recordLinks', index)}
      />

      <ArraySection
        title="Timeline"
        description="Historical milestones shown on the team hub."
        items={team.timeline || []}
        onAdd={() => updateField('timeline', [...(team.timeline || []), { year: new Date().getFullYear(), title: '' }])}
        renderItem={(event, index) => (
          <div className="grid gap-3 md:grid-cols-4" key={`timeline-${index}`}>
            <input
              type="number"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Year"
              value={event.year || ''}
              onChange={(e) => updateArrayItem('timeline', index, { year: e.target.value ? Number(e.target.value) : undefined })}
            />
            <input
              className="rounded-md border border-gray-300 px-3 py-2 text-sm md:col-span-3"
              placeholder="Title"
              value={event.title || ''}
              onChange={(e) => updateArrayItem('timeline', index, { title: e.target.value })}
            />
            <textarea
              className="md:col-span-4 mt-2 rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Description"
              value={event.description || ''}
              onChange={(e) => updateArrayItem('timeline', index, { description: e.target.value })}
            />
          </div>
        )}
        onRemove={(index) => removeArrayItem('timeline', index)}
      />
    </div>
  );
}

type ArraySectionProps<T> = {
  title: string;
  description?: string;
  items: T[];
  onAdd: () => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  onRemove: (index: number) => void;
};

function ArraySection<T>({ title, description, items, onAdd, renderItem, onRemove }: ArraySectionProps<T>) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
      {items.length === 0 ? (
        <p className="rounded-md border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500">No entries yet.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="rounded-lg border border-gray-200 p-4">
              <div className="space-y-3">{renderItem(item, index)}</div>
              <div className="mt-3 text-right">
                <button
                  className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:text-red-600 hover:border-red-200"
                  onClick={() => onRemove(index)}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

