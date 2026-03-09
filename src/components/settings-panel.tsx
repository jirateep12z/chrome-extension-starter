import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { VALID_THEMES } from '@/constants/settings';
import type { Theme } from '@/types/common';
import type { SettingsPanelProps } from '@/types/component-props';
import { Monitor, Moon, Power, Settings, Sun } from 'lucide-react';
import { memo } from 'react';

export const SettingsPanel = memo(function SettingsPanel({
  theme,
  is_enabled,
  OnThemeChange,
  OnEnabledChange
}: SettingsPanelProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Settings className="h-4 w-4" />
          Settings
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Monitor className="h-4 w-4" />
            Theme
          </Label>
          <Select
            value={theme}
            onValueChange={v => {
              if (VALID_THEMES.has(v)) {
                OnThemeChange(v as Theme);
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">
                <span className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  Light
                </span>
              </SelectItem>
              <SelectItem value="dark">
                <span className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Dark
                </span>
              </SelectItem>
              <SelectItem value="system">
                <span className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  System
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <Label
            htmlFor="extension-enabled"
            className="flex cursor-pointer items-center gap-2 text-sm font-medium"
          >
            <Power className="h-4 w-4" />
            Extension enabled
          </Label>
          <Switch
            id="extension-enabled"
            checked={is_enabled}
            onCheckedChange={OnEnabledChange}
            className="data-checked:bg-green-500 dark:data-checked:bg-green-500"
          />
        </div>
      </CardContent>
    </Card>
  );
});
