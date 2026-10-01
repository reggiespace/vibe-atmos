import { useMemo } from 'react';
import type { CurrentWeatherResponse } from '../types/weather';
import { getWeatherTheme, isNightTime, formatTemperature, formatWindSpeed, formatPressure, formatHumidity, getWindDirection, formatTime, formatDate, getConditionDescription } from '../utils/weatherUtils';
import { CardContent } from './ui/Card';
import { Rain, Snow, Clouds, ClearSky, Stormy, Misty } from './WeatherAnimations';
import { clsx } from 'clsx';
import { 
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, 
  Droplets, Wind, Thermometer, Sunrise, Sunset, 
  MapPin, Calendar, Clock
} from 'lucide-react';

interface WeatherCardProps {
  weather: CurrentWeatherResponse;
  className?: string;
}

const conditionIconMap: Record<string, React.ReactNode> = {
  Thunderstorm: <CloudLightning className="w-8 h-8" />,
  Drizzle: <CloudRain className="w-8 h-8" />,
  Rain: <CloudRain className="w-8 h-8" />,
  Snow: <CloudSnow className="w-8 h-8" />,
  Clear: <Sun className="w-8 h-8" />,
  Clouds: <Cloud className="w-8 h-8" />,
  Mist: <CloudFog className="w-8 h-8" />,
  Smoke: <CloudFog className="w-8 h-8" />,
  Haze: <CloudFog className="w-8 h-8" />,
  Dust: <CloudFog className="w-8 h-8" />,
  Fog: <CloudFog className="w-8 h-8" />,
  Sand: <CloudFog className="w-8 h-8" />,
  Ash: <CloudFog className="w-8 h-8" />,
  Squall: <CloudLightning className="w-8 h-8" />,
  Tornado: <CloudLightning className="w-8 h-8" />,
};

const getAnimationComponent = (theme: string, isNight: boolean, temp?: number) => {
  switch (theme) {
    case 'rainy':
      return <Rain intensity="medium" />;
    case 'snowy':
      return <Snow intensity="medium" showSnowman={true} isNight={isNight} temperature={temp} />;
    case 'snowy-night':
      return <Snow intensity="medium" showSnowman={true} isNight={true} temperature={temp} />;
    case 'clear-day':
      return <ClearSky isNight={false} />;
    case 'clear-night':
      return <ClearSky isNight={true} />;
    case 'cloudy-day':
      return <Clouds coverage="scattered" isNight={false} />;
    case 'cloudy-night':
      return <Clouds coverage="broken" isNight={true} />;
    case 'stormy':
      return <Stormy isNight={isNight} />;
    case 'misty':
      return <Misty isNight={isNight} />;
    default:
      return <ClearSky isNight={isNight} />;
  }
};

export const WeatherCard = ({ weather, className }: WeatherCardProps) => {
  const { main, weather: conditions, wind, sys, dt, timezone, name, visibility } = weather;
  const condition = conditions[0];
  const isNight = isNightTime(dt, sys.sunrise, sys.sunset);
  
  const themeConfig = useMemo(
    () => getWeatherTheme(condition.main, isNight, main.temp),
    [condition.main, isNight, main.temp]
  );

  const themeClass = `theme-${themeConfig.theme.replace('-night', '-night').replace('-day', '-day')}`;
  const conditionIcon = conditionIconMap[condition.main] || <Cloud className="w-8 h-8" />;
  const conditionDesc = getConditionDescription(condition.main);

  return (
    <div className={clsx('relative min-h-[500px] max-w-md w-full mx-auto', themeClass, className)}>
      <CardContent className="relative z-10 p-6 pt-8">
        {getAnimationComponent(themeConfig.theme, themeConfig.isNight, main.temp)}

        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-[var(--color-text-secondary)] text-sm mb-1">
              <MapPin className="w-4 h-4" />
              <span>{name}, {sys.country}</span>
            </div>
            <p className="text-[var(--color-text-secondary)] text-sm">
              {formatDate(dt, timezone)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-5xl font-light text-[var(--color-text-primary)] tabular-nums">
              {formatTemperature(main.temp)}
            </p>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Sensação: {formatTemperature(main.feels_like)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[var(--color-accent)]/20 text-[var(--color-accent)]">
              {conditionIcon}
            </div>
            <div>
              <p className="text-xl font-medium text-[var(--color-text-primary)] capitalize">
                {conditionDesc}
              </p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Mín: {formatTemperature(main.temp_min)} • Máx: {formatTemperature(main.temp_max)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <WeatherDetail 
            icon={<Thermometer className="w-5 h-5" />}
            label="Umidade"
            value={formatHumidity(main.humidity)}
            color="var(--color-accent)"
          />
          <WeatherDetail 
            icon={<Wind className="w-5 h-5" />}
            label="Vento"
            value={`${formatWindSpeed(wind.speed)} ${getWindDirection(wind.deg)}`}
            color="var(--color-accent)"
          />
          <WeatherDetail 
            icon={<Droplets className="w-5 h-5" />}
            label="Pressão"
            value={formatPressure(main.pressure)}
            color="var(--color-accent)"
          />
          <WeatherDetail 
            icon={<Calendar className="w-5 h-5" />}
            label="Visibilidade"
            value={`${Math.round(visibility / 1000)} km`}
            color="var(--color-accent)"
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-bg-secondary)]/50 border border-[var(--color-border)]">
          <div className="flex items-center gap-3 text-[var(--color-text-secondary)]">
            <Sunrise className="w-5 h-5" />
            <div>
              <p className="text-xs uppercase tracking-wider">Nascer do sol</p>
              <p className="font-medium text-[var(--color-text-primary)]">
                {formatTime(sys.sunrise, timezone)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[var(--color-text-secondary)]">
            <Sunset className="w-5 h-5" />
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider">Pôr do sol</p>
              <p className="font-medium text-[var(--color-text-primary)]">
                {formatTime(sys.sunset, timezone)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--color-border)] flex items-center justify-center gap-4 text-sm text-[var(--color-text-secondary)]">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            Atualizado: {formatTime(dt, timezone)}
          </span>
          <span className="flex items-center gap-1.5">
            Coord: {weather.coord.lat.toFixed(2)}, {weather.coord.lon.toFixed(2)}
          </span>
        </div>
      </CardContent>
    </div>
  );
};

interface WeatherDetailProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

const WeatherDetail = ({ icon, label, value, color }: WeatherDetailProps) => (
  <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-secondary)]/30 border border-[var(--color-border)]">
    <div className="p-2 rounded-lg" style={{ background: `${color}20`, color }}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">{label}</p>
      <p className="text-sm font-medium text-[var(--color-text-primary)]">{value}</p>
    </div>
  </div>
);

export default WeatherCard;