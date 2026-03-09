export { DEFAULT_SETTINGS } from './constants/settings';
export {
  CHROME_STORAGE_AREA,
  CHROME_STORAGE_KEY,
  LOCAL_STORAGE_KEY
} from './constants/storage';
export { UseChromeStorage } from './hooks/use-chrome-storage';
export { MergeSettings } from './lib/merge-settings';
export { HandleMessage } from './services/message-handler.service';
export type {
  GetSettingsMessage,
  GetSettingsResponse,
  IncomingMessage,
  SaveSettingsMessage,
  SaveSettingsResponse
} from './types/message';
export type { Settings, Statistics } from './types/settings';
