import { useState, useEffect, useCallback } from 'react';
import type { GeocodingResult, RecentCity } from './types/weather';
import { WeatherCard } from './components/WeatherCard';
import { CitySearchWithGeocoding } from './components/CitySearch';
import { useWeather } from './hooks/useWeather';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Button } from './components/ui';
import { Sun, Cloud, CloudRain, CloudSnow, MapPin, Loader2, RefreshCw, AlertCircle, Info } from 'lucide-react';

function App() {
  const { weather, isLoading, error, fetchByCoords, clearWeather } = useWeather();
  const { recentCities, addCity, clearAll } = useLocalStorage();
  const [selectedCity, setSelectedCity] = useState<GeocodingResult | null>(null);
  const [showError, setShowError] = useState(false);

  const handleCitySearch = useCallback((city: GeocodingResult) => {
    setSelectedCity(city);
    fetchByCoords(city.lat, city.lon);
    addCity({
      name: city.name,
      country: city.country,
      state: city.state,
      lat: city.lat,
      lon: city.lon,
      timestamp: Date.now(),
    });
  }, [fetchByCoords, addCity]);

  const handleRecentSelect = useCallback((city: RecentCity) => {
    const geocodingCity: GeocodingResult = {
      name: city.name,
      country: city.country,
      state: city.state,
      lat: city.lat,
      lon: city.lon,
    };
    handleCitySearch(geocodingCity);
  }, [handleCitySearch]);

  const handleClearRecent = useCallback(() => {
    clearAll();
  }, [clearAll]);

  const handleRetry = useCallback(() => {
    if (selectedCity) {
      fetchByCoords(selectedCity.lat, selectedCity.lon);
    }
    setShowError(false);
  }, [selectedCity, fetchByCoords]);

  const handleDismissError = useCallback(() => {
    setShowError(false);
    clearWeather();
  }, [clearWeather]);

  useEffect(() => {
    if (error && !isLoading) {
      setShowError(true);
    }
  }, [error, isLoading]);

  const getEmptyStateIcon = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) return <Sun className="w-16 h-16 text-[var(--color-accent)]/50" />;
    return <Cloud className="w-16 h-16 text-[var(--color-accent)]/50" />;
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] transition-colors duration-500">
      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <header className="mb-8 sm:mb-12 animate-fade-in">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-light text-[var(--color-text-primary)] tracking-tight mb-2">
              Clima
            </h1>
            <p className="text-[var(--color-text-secondary)] text-sm sm:text-base">
              Tempo atual em qualquer cidade do mundo
            </p>
          </div>
        </header>

        <CitySearchWithGeocoding
          onSearch={handleCitySearch}
          recentCities={recentCities}
          onRecentSelect={handleRecentSelect}
          onClearRecent={handleClearRecent}
          disabled={isLoading}
        />

        {showError && error && (
          <div 
            className="mb-6 animate-slide-up"
            role="alert"
          >
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium">Erro ao buscar clima</p>
                <p className="text-sm mt-1 opacity-90">{error}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleRetry}>
                  <RefreshCw className="w-4 h-4" />
                  Tentar novamente
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDismissError}>
                  <Info className="w-4 h-4" />
                  Dispensar
                </Button>
              </div>
            </div>
          </div>
        )}

        {isLoading && !weather && (
          <div className="animate-fade-in" role="status" aria-live="polite">
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <Loader2 className="w-10 h-10 text-[var(--color-accent)] animate-spin mb-4" />
              <p className="text-[var(--color-text-secondary)] text-lg">Buscando informações do tempo...</p>
              <p className="text-[var(--color-text-secondary)] text-sm mt-1">Isso pode levar alguns segundos</p>
            </div>
          </div>
        )}

        {weather && !isLoading && (
          <WeatherCard weather={weather} className="animate-slide-up" />
        )}

        {!weather && !isLoading && !error && !selectedCity && (
          <div className="animate-fade-in">
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="mb-6">
                {getEmptyStateIcon()}
              </div>
              <h2 className="text-xl font-medium text-[var(--color-text-primary)] mb-2">
                Pronto para começar
              </h2>
              <p className="text-[var(--color-text-secondary)] max-w-sm mx-auto">
                Digite o nome de uma cidade acima para ver o clima atual com animações baseadas nas condições meteorológicas.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-[var(--color-text-secondary)]">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                  <CloudRain className="w-5 h-5 text-blue-500" />
                  <span>Chuva animada</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                  <CloudSnow className="w-5 h-5 text-blue-300" />
                  <span>Neve com boneco</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                  <Sun className="w-5 h-5 text-amber-500" />
                  <span>Dia/Noite dinâmico</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {recentCities.length > 0 && !selectedCity && !weather && !isLoading && (
          <div className="mt-8 animate-fade-in">
            <p className="text-sm text-[var(--color-text-secondary)] text-center mb-4">
              Ou escolha uma cidade recente:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {recentCities.slice(0, 5).map((city, index) => (
                <button
                  key={`${city.lat}-${city.lon}-${index}`}
                  onClick={() => handleRecentSelect(city)}
                  className="px-4 py-2 text-sm rounded-lg bg-[var(--color-bg-secondary)] hover:bg-[var(--color-border)] text-[var(--color-text-primary)] border border-[var(--color-border)] transition-colors flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-[var(--color-accent)]" />
                  <span>{city.name}{city.state && `, ${city.state}`}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-12 py-8 text-center">
        <p className="text-xs text-[var(--color-text-secondary)]">
          Dados meteorológicos por{' '}
          <a 
            href="https://openweathermap.org/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-[var(--color-accent)] transition-colors"
          >
            OpenWeatherMap
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;