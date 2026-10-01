import { useState, useCallback } from 'react';
import { openWeatherService } from '../services/openweather';
import type { CurrentWeatherResponse } from '../types/weather';

export function useWeather() {
  const [weather, setWeather] = useState<CurrentWeatherResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchByCoords = useCallback(async (lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await openWeatherService.getCurrentWeatherByCoords(lat, lon);
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar clima');
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchByCity = useCallback(async (city: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await openWeatherService.getCurrentWeatherByCity(city);
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar clima');
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearWeather = useCallback(() => {
    setWeather(null);
    setError(null);
  }, []);

  return { weather, isLoading, error, fetchByCoords, fetchByCity, clearWeather };
}