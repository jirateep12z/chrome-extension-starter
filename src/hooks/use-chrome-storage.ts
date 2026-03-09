import { DEFAULT_SETTINGS } from '@/constants/settings';
import {
  CHROME_STORAGE_AREA,
  CHROME_STORAGE_KEY,
  LOCAL_STORAGE_KEY
} from '@/constants/storage';
import { IsChromeExtension } from '@/lib/is-chrome-extension';
import { MergeSettings } from '@/lib/merge-settings';
import type { Settings } from '@/types/settings';
import { useCallback, useEffect, useRef, useState } from 'react';

function CacheLocalSettings(settings: Settings): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to cache settings locally:', error);
  }
}

export function UseChromeStorage() {
  const [settings, set_settings] = useState<Settings>(DEFAULT_SETTINGS);
  const [is_loading, set_is_loading] = useState(true);
  const settings_ref = useRef<Settings>(DEFAULT_SETTINGS);
  const save_in_flight = useRef<number>(0);
  const save_operation_id = useRef<number>(0);

  const LoadSettings = useCallback(async () => {
    set_is_loading(true);
    try {
      if (IsChromeExtension()) {
        const response = await chrome.runtime.sendMessage({
          action: 'get-settings'
        });
        const partial = response as Partial<Settings>;
        const merged_settings = MergeSettings(partial);
        CacheLocalSettings(merged_settings);
        set_settings(merged_settings);
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
    if (JSON.stringify(settings_ref.current) === JSON.stringify(new_settings))
      return;
    const previous_settings = settings_ref.current;
    const current_save_id = save_operation_id.current + 1;
    save_operation_id.current = current_save_id;
    settings_ref.current = new_settings;
    save_in_flight.current += 1;
    set_settings(new_settings);
    try {
      if (IsChromeExtension()) {
        const response = await chrome.runtime.sendMessage({
          action: 'save-settings',
          settings: new_settings
        });
        if (!response?.success) {
          console.error('Failed to save settings:', response?.error);
          if (save_operation_id.current === current_save_id) {
            settings_ref.current = previous_settings;
            set_settings(previous_settings);
          }
        } else {
          CacheLocalSettings(new_settings);
        }
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(new_settings));
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      if (save_operation_id.current === current_save_id) {
        settings_ref.current = previous_settings;
        set_settings(previous_settings);
      }
    } finally {
      save_in_flight.current -= 1;
    }
  }, []);

  useEffect(() => {
    settings_ref.current = settings;
  }, [settings]);

  useEffect(() => {
    LoadSettings();
  }, [LoadSettings]);

  useEffect(() => {
    if (!IsChromeExtension()) return;
    const HandleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      area_name: string
    ) => {
      if (save_in_flight.current > 0) return;
      if (area_name === CHROME_STORAGE_AREA && changes[CHROME_STORAGE_KEY]) {
        const new_value = changes[CHROME_STORAGE_KEY].newValue;
        if (new_value && typeof new_value === 'object') {
          const next = MergeSettings(new_value as Partial<Settings>);
          CacheLocalSettings(next);
          set_settings(current => {
            return JSON.stringify(current) === JSON.stringify(next)
              ? current
              : next;
          });
        } else {
          CacheLocalSettings(DEFAULT_SETTINGS);
          set_settings(DEFAULT_SETTINGS);
        }
      }
    };
    chrome.storage.onChanged.addListener(HandleStorageChange);
    return () => {
      chrome.storage.onChanged.removeListener(HandleStorageChange);
    };
  }, []);

  const GetLatestSettings = useCallback(() => settings_ref.current, []);

  return { settings, is_loading, SaveSettings, GetLatestSettings };
}
