import { useState, useEffect } from 'react';
import { CricketMatch } from '@/store/slices/cricketSlice';
import { transformLocalMatch } from '@/lib/cricket/match-utils';

interface UseLocalMatchesOptions {
  status?: 'live' | 'upcoming' | 'completed';
  city?: string;
  district?: string;
  area?: string;
  limit?: number;
  enabled?: boolean;
}

export function useLocalMatches(options: UseLocalMatchesOptions = {}) {
  const { status, city, district, area, limit = 50, enabled = true } = options;
  const [matches, setMatches] = useState<CricketMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchLocalMatches = async () => {
      setLoading(true);
      setError(null);

      try {
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const params = new URLSearchParams();

        if (status) params.append('status', status);
        if (city) params.append('city', city);
        if (district) params.append('district', district);
        if (area) params.append('area', area);
        if (limit) params.append('limit', limit.toString());

        const url = `${base}/api/v1/cricket/local/matches${params.toString() ? `?${params.toString()}` : ''}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch local matches: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          const transformed = data.data.map(transformLocalMatch);
          setMatches(transformed);
        } else {
          setMatches([]);
        }
      } catch (err) {
        console.error('Error fetching local matches:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch local matches');
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocalMatches();
  }, [status, city, district, area, limit, enabled]);

  return { matches, loading, error };
}

export function useLocalMatch(matchId: string | null) {
  const [match, setMatch] = useState<CricketMatch | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!matchId) return;

    const fetchMatch = async () => {
      setLoading(true);
      setError(null);

      try {
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const url = `${base}/api/v1/cricket/local/matches/${matchId}`;

        const response = await fetch(url);

        if (!response.ok) {
          if (response.status === 404) {
            setError('Match not found');
          } else {
            throw new Error(`Failed to fetch match: ${response.statusText}`);
          }
          return;
        }

        const data = await response.json();

        if (data.success && data.data) {
          const transformed = transformLocalMatch(data.data);
          setMatch(transformed);
        } else {
          setError('Invalid match data');
        }
      } catch (err) {
        console.error('Error fetching local match:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch match');
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [matchId]);

  return { match, loading, error };
}
