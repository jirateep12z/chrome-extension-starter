import { DEFAULT_SETTINGS } from '@/constants/settings';
import { CHROME_STORAGE_KEY } from '@/constants/storage';
import { MergeSettings } from '@/lib/merge-settings';
import type { SaveSettingsMessage } from '@/types/message';
import type { Settings } from '@/types/settings';

function IsRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function IsGetSettingsMessage(message: unknown): boolean {
  return IsRecord(message) && message.action === 'get-settings';
}

function IsSaveSettingsMessage(
  message: unknown
): message is SaveSettingsMessage {
  return (
    IsRecord(message) &&
    message.action === 'save-settings' &&
    IsRecord(message.settings)
  );
}

export function HandleMessage(
  message: unknown,
  sender: chrome.runtime.MessageSender,
  SendResponse: (response: unknown) => void
): boolean {
  if (sender.id !== chrome.runtime.id) return false;
  if (IsGetSettingsMessage(message)) {
    chrome.storage.sync
      .get(CHROME_STORAGE_KEY)
      .then(data => {
        const stored = data[CHROME_STORAGE_KEY] as
          | Partial<Settings>
          | undefined;
        SendResponse(MergeSettings(stored ?? {}));
      })
      .catch(error => {
        console.error(
          '[background] Failed to read settings from storage:',
          error
        );
        SendResponse(DEFAULT_SETTINGS);
      });
    return true;
  }
  if (IsRecord(message) && message.action === 'save-settings') {
    if (!IsSaveSettingsMessage(message)) {
      SendResponse({
        success: false,
        error: 'Invalid settings payload.'
      });
      return false;
    }
    const validated = MergeSettings(message.settings);
    chrome.storage.sync
      .set({ [CHROME_STORAGE_KEY]: validated })
      .then(() => {
        SendResponse({ success: true });
      })
      .catch(error => {
        console.error('[background] Failed to save settings:', error);
        SendResponse({
          success: false,
          error: 'Unable to save settings. Please try again.'
        });
      });
    return true;
  }
  return false;
}
