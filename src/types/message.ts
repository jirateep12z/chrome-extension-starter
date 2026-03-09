import type { Settings } from '@/types/settings';

export type GetSettingsMessage = {
  action: 'get-settings';
};

export type SaveSettingsMessage = {
  action: 'save-settings';
  settings: Settings;
};

export type IncomingMessage = GetSettingsMessage | SaveSettingsMessage;
