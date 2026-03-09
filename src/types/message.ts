import type { Settings } from '@/types/settings';

export type GetSettingsMessage = {
  action: 'get-settings';
};

export type SaveSettingsMessage = {
  action: 'save-settings';
  settings: Partial<Settings>;
};

export type IncomingMessage = GetSettingsMessage | SaveSettingsMessage;

export type GetSettingsResponse = Settings;

export type SaveSettingsResponse =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };
