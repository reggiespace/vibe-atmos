import type { GeocodingResult, CurrentWeatherResponse } from '../types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'http://api.openweathermap.org/geo/1.0';

if (!API_KEY) {
  console.warn('VITE_OPENWEATHER_API_KEY not set. Please add it to your .env file.');
}

class OpenWeatherService {
  private async fetchWithError<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP error ${response.status}`);
    }
    return response.json();
  }

  async searchCities(query: string, limit: number = 5): Promise<GeocodingResult[]> {
    if (!query.trim() || query.length < 2) return [];
    
    const url = `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${API_KEY}`;
    return this.fetchWithError<GeocodingResult[]>(url);
  }

  async getCurrentWeatherByCoords(lat: number, lon: number): Promise<CurrentWeatherResponse> {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${API_KEY}`;
    return this.fetchWithError<CurrentWeatherResponse>(url);
  }

  async getCurrentWeatherByCity(city: string): Promise<CurrentWeatherResponse> {
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&lang=pt_br&appid=${API_KEY}`;
    return this.fetchWithError<CurrentWeatherResponse>(url);
  }
}

export const openWeatherService = new OpenWeatherService();