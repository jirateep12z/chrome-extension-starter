import type { Theme } from '@/types/common';
import type { Statistics } from '@/types/settings';

export type SettingsPanelProps = {
  theme: Theme;
  is_enabled: boolean;
  OnThemeChange: (theme: Theme) => void;
  OnEnabledChange: (value: boolean) => void;
};

export type StatisticsCardProps = {
  statistics: Statistics;
};
