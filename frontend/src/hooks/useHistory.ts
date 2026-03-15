import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import type { AnalysisResult } from '../types';

export interface HistoryItem extends AnalysisResult {
  id: string;
  created_at: string;
  input_length?: number;
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export const useHistory = () => {
  const { user, isLoaded } = useUser();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/history?user_id=${user.id}`);
      if (!res.ok) throw new Error('Failed to load history.');
      const data: HistoryItem[] = await res.json();
      setItems(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isLoaded && user?.id) {
      void fetchHistory();
    }
  }, [isLoaded, user?.id, fetchHistory]);

  return { items, loading, error, refetch: fetchHistory };
};
