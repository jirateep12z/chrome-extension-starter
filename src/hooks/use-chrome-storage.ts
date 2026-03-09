import {
  CHROME_STORAGE_AREA,
  CHROME_STORAGE_KEY,
  DEFAULT_SETTINGS,
  LOCAL_STORAGE_KEY
} from '@/constants';
import type { Settings } from '@/types';
import { IsChromeExtension, MergeSettings } from '@/utils';
import { useCallback, useEffect, useState } from 'react';

export function UseChromeStorage() {
  const [settings, set_settings] = useState<Settings>(DEFAULT_SETTINGS);
  const [is_loading, set_is_loading] = useState(true);

  const LoadSettings = useCallback(async () => {
    set_is_loading(true);
    try {
      if (IsChromeExtension()) {
        const response = await chrome.runtime.sendMessage({
          action: 'get-settings'
        });
        const partial = response as Partial<Settings>;
        set_settings(MergeSettings(partial));
      } else {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === 'object') {
            set_settings(MergeSettings(parsed as Partial<Settings>));
          }
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      set_is_loading(false);
    }
  }, []);

  const SaveSettings = useCallback(async (new_settings: Settings) => {
    let previous_settings: Settings = DEFAULT_SETTINGS;
    set_settings(current => {
      previous_settings = current;
      return new_settings;
    });
    try {
      if (IsChromeExtension()) {
        const response = await chrome.runtime.sendMessage({
          action: 'save-settings',
          settings: new_settings
        });
        if (!response?.success) {
          console.error('Failed to save settings:', response?.error);
          set_settings(previous_settings);
        }
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(new_settings));
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      set_settings(previous_settings);
    }
  }, []);

  useEffect(() => {
    LoadSettings();
  }, [LoadSettings]);

  useEffect(() => {
    if (!IsChromeExtension()) return;
    const HandleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      area_name: string
    ) => {
      if (area_name === CHROME_STORAGE_AREA && changes[CHROME_STORAGE_KEY]) {
        const new_value = changes[CHROME_STORAGE_KEY].newValue;
        if (new_value && typeof new_value === 'object') {
          set_settings(current => {
            const next = MergeSettings(new_value as Partial<Settings>);
            return JSON.stringify(current) === JSON.stringify(next)
              ? current
              : next;
          });
        } else {
          set_settings(DEFAULT_SETTINGS);
        }
      }
    };
    chrome.storage.onChanged.addListener(HandleStorageChange);
    return () => {
      chrome.storage.onChanged.removeListener(HandleStorageChange);
    };
  }, []);

  return { settings, is_loading, SaveSettings };
}
