import type { Statistics } from '@/features/settings';
import type { Theme } from '@/features/theme';

export type SettingsPanelProps = {
  theme: Theme;
  is_enabled: boolean;
  OnEnabledChange: (value: boolean) => void;
  OnThemeChange: (theme: Theme) => void;
};

export type StatisticsCardProps = {
  statistics: Statistics;
};
