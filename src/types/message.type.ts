import type { Settings } from '@/types/settings.type';

export type GetSettingsMessage = {
  action: 'get-settings';
};

export type SaveSettingsMessage = {
  action: 'save-settings';
  settings: Settings;
};
