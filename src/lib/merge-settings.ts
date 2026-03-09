import { DEFAULT_SETTINGS, VALID_THEMES } from '@/constants/settings';
import type { Settings } from '@/types/settings';

export function MergeSettings(partial: Partial<Settings>): Settings {
  const validated_theme =
    typeof partial?.theme === 'string' && VALID_THEMES.has(partial.theme)
      ? (partial.theme as Settings['theme'])
      : DEFAULT_SETTINGS.theme;

  const validated_count =
    typeof partial?.statistics?.total_count === 'number' &&
    Number.isFinite(partial.statistics.total_count) &&
    partial.statistics.total_count >= 0
      ? Math.floor(partial.statistics.total_count)
      : DEFAULT_SETTINGS.statistics.total_count;

  const raw_date = partial?.statistics?.last_date;
  const validated_date: string | null =
    raw_date === null
      ? null
      : typeof raw_date === 'string' && !isNaN(new Date(raw_date).getTime())
        ? raw_date
        : DEFAULT_SETTINGS.statistics.last_date;

  return {
    ...DEFAULT_SETTINGS,
    is_enabled:
      typeof partial?.is_enabled === 'boolean'
        ? partial.is_enabled
        : DEFAULT_SETTINGS.is_enabled,
    theme: validated_theme,
    statistics: {
      total_count: validated_count,
      last_date: validated_date
    }
  };
}
