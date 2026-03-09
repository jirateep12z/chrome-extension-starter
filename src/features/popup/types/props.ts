import type { Statistics } from '@/features/settings';
import type { Theme } from '@/features/theme';

export type SettingsPanelProps = {
  theme: Theme;
  is_enabled: boolean;
  OnThemeChange: (theme: Theme) => void;
  OnEnabledChange: (value: boolean) => void;
};

export type StatisticsCardProps = {
  statistics: Statistics;
};
