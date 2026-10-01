import { useState, useCallback, useEffect } from 'react';
import { openWeatherService } from '../services/openweather';
import type { GeocodingResult } from '../types/weather';
import { useDebounce } from './useDebounce';

export function useGeocoding(query: string) {
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setSuggestions([]);
      setError(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    openWeatherService
      .searchCities(debouncedQuery)
      .then((results) => {
        if (!cancelled) {
          setSuggestions(results);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setSuggestions([]);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
  }, []);

  return { suggestions, isLoading, error, clearSuggestions };
}