import type { Theme } from '@/types/common.type';
import type { Statistics } from '@/types/settings.type';

export type SettingsPanelProps = {
  theme: Theme;
  is_enabled: boolean;
  OnThemeChange: (theme: Theme) => void;
  OnEnabledChange: (value: boolean) => void;
};

export type StatisticsCardProps = {
  statistics: Statistics;
};
