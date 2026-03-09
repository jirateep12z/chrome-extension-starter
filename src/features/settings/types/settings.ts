import type { Theme } from '@/features/theme';

export type Statistics = {
  total_count: number;
  last_date: string | null;
};

export type Settings = {
  theme: Theme;
  is_enabled: boolean;
  statistics: Statistics;
};
