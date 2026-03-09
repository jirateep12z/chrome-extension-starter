import type { Settings } from '@/types/settings';

export const VALID_THEMES = new Set<string>(['light', 'dark', 'system']);

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  is_enabled: true,
  statistics: {
    total_count: 0,
    last_date: null
  }
};
