import { useState, useEffect, useCallback } from 'react';
import type { RecentCity } from '../types/weather';

const STORAGE_KEY = 'clima_recent_cities';
const MAX_RECENT = 5;

export function useLocalStorage() {
  const [recentCities, setRecentCities] = useState<RecentCity[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as RecentCity[];
        setRecentCities(parsed.slice(0, MAX_RECENT));
      }
    } catch {
      setRecentCities([]);
    }
  }, []);

  const addCity = useCallback((city: RecentCity) => {
    setRecentCities((prev) => {
      const filtered = prev.filter((c) => !(c.lat === city.lat && c.lon === city.lon));
      const updated = [city, ...filtered].slice(0, MAX_RECENT);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore localStorage errors (private browsing, quota exceeded)
      }
      return updated;
    });
  }, []);

  const removeCity = useCallback((lat: number, lon: number) => {
    setRecentCities((prev) => {
      const updated = prev.filter((c) => !(c.lat === lat && c.lon === lon));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setRecentCities([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  return { recentCities, addCity, removeCity, clearAll };
}