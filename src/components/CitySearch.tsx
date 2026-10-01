import { useState, useRef, useEffect, useCallback } from 'react';
import type { GeocodingResult, RecentCity } from '../types/weather';
import { Input, Button } from './ui';
import { Search, X, MapPin, Loader2, Clock } from 'lucide-react';
import { useGeocoding } from '../hooks';

interface CitySearchWithGeocodingProps {
  onSearch: (city: GeocodingResult) => void;
  recentCities: RecentCity[];
  onRecentSelect: (city: RecentCity) => void;
  onClearRecent: () => void;
  disabled?: boolean;
}

export const CitySearchWithGeocoding = ({ 
  onSearch, 
  recentCities, 
  onRecentSelect, 
  onClearRecent,
  disabled = false 
}: CitySearchWithGeocodingProps) => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { suggestions, isLoading, clearSuggestions } = useGeocoding(query);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFocus = useCallback(() => {
    if (query.length >= 2) {
      setShowDropdown(true);
    } else if (recentCities.length > 0) {
      setShowDropdown(true);
    }
  }, [query, recentCities.length]);

  const handleSelectCity = (city: GeocodingResult) => {
    setQuery(`${city.name}${city.state ? `, ${city.state}` : ''}, ${city.country}`);
    setShowDropdown(false);
    onSearch(city);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setQuery('');
    setShowDropdown(false);
    clearSuggestions();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  const showRecent = query.length < 2 && recentCities.length > 0;
  const showSuggestions = query.length >= 2;

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Digite o nome de uma cidade..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          icon={<Search className="w-5 h-5" />}
          className="pr-12"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={handleClear}
            aria-label="Limpar busca"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {showDropdown && (showRecent || showSuggestions) && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 rounded-xl bg-[var(--color-card-bg)] border border-[var(--color-border)] shadow-xl overflow-hidden animate-slide-up"
          role="listbox"
        >
          {showRecent && (
            <div className="p-3 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-[var(--color-text-secondary)] flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Recentes
                </p>
                {recentCities.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearRecent}
                    className="text-xs text-[var(--color-text-secondary)] hover:text-red-500"
                  >
                    Limpar
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {recentCities.slice(0, 5).map((city, index) => (
                  <button
                    key={`${city.lat}-${city.lon}-${index}`}
                    onClick={() => onRecentSelect(city)}
                    className="px-3 py-1.5 text-sm rounded-lg bg-[var(--color-bg-secondary)] hover:bg-[var(--color-border)] text-[var(--color-text-primary)] border border-[var(--color-border)] transition-colors flex items-center gap-1.5"
                    role="option"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                    <span>{city.name}{city.state && `, ${city.state}`}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showSuggestions && (
            <div className="max-h-60 overflow-y-auto">
              {suggestions.length === 0 && !isLoading && (
                <div className="p-6 text-center text-[var(--color-text-secondary)]">
                  <p>Nenhuma cidade encontrada</p>
                  <p className="text-sm mt-1">Tente buscar por "São Paulo, BR" ou "Toronto, CA"</p>
                </div>
              )}
              {isLoading && (
                <div className="p-6 text-center text-[var(--color-text-secondary)] flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Buscando...</span>
                </div>
              )}
              {suggestions.map((city, index) => (
                <button
                  key={`${city.lat}-${city.lon}-${index}`}
                  onClick={() => handleSelectCity(city)}
                  className="w-full px-4 py-3 text-left hover:bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] last:border-0 transition-colors flex items-center gap-3"
                  role="option"
                >
                  <MapPin className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[var(--color-text-primary)] truncate">{city.name}</p>
                    <p className="text-xs text-[var(--color-text-secondary)] truncate">
                      {city.state ? `${city.state}, ${city.country}` : city.country}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CitySearchWithGeocoding;