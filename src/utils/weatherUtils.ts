import type { WeatherTheme, ThemeConfig } from '../types/weather';

export const CONDITION_THEME_MAP: Record<string, { theme: WeatherTheme; showSnowman: boolean }> = {
  Thunderstorm: { theme: 'stormy', showSnowman: false },
  Drizzle: { theme: 'rainy', showSnowman: false },
  Rain: { theme: 'rainy', showSnowman: false },
  Snow: { theme: 'snowy', showSnowman: true },
  Clear: { theme: 'clear-day', showSnowman: false },
  Clouds: { theme: 'cloudy-day', showSnowman: false },
  Mist: { theme: 'misty', showSnowman: false },
  Smoke: { theme: 'misty', showSnowman: false },
  Haze: { theme: 'misty', showSnowman: false },
  Dust: { theme: 'misty', showSnowman: false },
  Fog: { theme: 'misty', showSnowman: false },
  Sand: { theme: 'misty', showSnowman: false },
  Ash: { theme: 'misty', showSnowman: false },
  Squall: { theme: 'stormy', showSnowman: false },
  Tornado: { theme: 'stormy', showSnowman: false },
};

export function getWeatherTheme(
  conditionMain: string,
  isNight: boolean,
  temp?: number
): ThemeConfig {
  const base = CONDITION_THEME_MAP[conditionMain] || { theme: 'clear-day', showSnowman: false };
  
  let theme = base.theme;
  let showSnowman = base.showSnowman;

  if (isNight) {
    switch (base.theme) {
      case 'clear-day':
        theme = 'clear-night';
        break;
      case 'cloudy-day':
        theme = 'cloudy-night';
        break;
      case 'snowy':
        theme = 'snowy-night';
        break;
      case 'rainy':
        theme = 'rainy';
        break;
      case 'misty':
        theme = 'misty';
        break;
      case 'stormy':
        theme = 'stormy';
        break;
    }
  }

  if (theme === 'snowy' && temp !== undefined && temp <= 0) {
    showSnowman = true;
  }

  return { theme, showSnowman, isNight };
}

export function isNightTime(dt: number, sunrise: number, sunset: number): boolean {
  return dt < sunrise || dt > sunset;
}

export function formatTemperature(temp: number, unit: 'C' | 'F' = 'C'): string {
  if (unit === 'F') {
    return `${Math.round(temp * 9/5 + 32)}°F`;
  }
  return `${Math.round(temp)}°C`;
}

export function formatWindSpeed(speed: number): string {
  return `${Math.round(speed * 3.6)} km/h`;
}

export function formatPressure(pressure: number): string {
  return `${pressure} hPa`;
}

export function formatHumidity(humidity: number): string {
  return `${humidity}%`;
}

export function getWindDirection(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}

export function formatTime(timestamp: number, timezone: number): string {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  });
}

export function formatDate(timestamp: number, timezone: number): string {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleDateString('pt-BR', { 
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC'
  });
}

export function getConditionDescription(condition: string, isPtBr: boolean = true): string {
  const descriptions: Record<string, { en: string; pt: string }> = {
    Thunderstorm: { en: 'Thunderstorm', pt: 'Tempestade' },
    Drizzle: { en: 'Drizzle', pt: 'Chuvisco' },
    Rain: { en: 'Rain', pt: 'Chuva' },
    Snow: { en: 'Snow', pt: 'Neve' },
    Clear: { en: 'Clear', pt: 'Céu limpo' },
    Clouds: { en: 'Clouds', pt: 'Nublado' },
    Mist: { en: 'Mist', pt: 'Névoa' },
    Smoke: { en: 'Smoke', pt: 'Fumaça' },
    Haze: { en: 'Haze', pt: 'Nevoeiro seco' },
    Dust: { en: 'Dust', pt: 'Poeira' },
    Fog: { en: 'Fog', pt: 'Nevoeiro' },
    Sand: { en: 'Sand', pt: 'Areia' },
    Ash: { en: 'Ash', pt: 'Cinzas' },
    Squall: { en: 'Squall', pt: 'Rajada' },
    Tornado: { en: 'Tornado', pt: 'Tornado' },
  };
  
  const desc = descriptions[condition];
  if (!desc) return condition;
  return isPtBr ? desc.pt : desc.en;
}