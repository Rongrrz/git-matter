import type { ValueOf } from '@/shared/types/helpers';

export const CommitVisibilityModeMap = {
  Off: 'off',
  Dim: 'dim',
  Hide: 'hide',
} as const;
export type CommitVisibilityMode = ValueOf<typeof CommitVisibilityModeMap>;

export const ThemeColorMap = {
  Light: 'light',
  Dark: 'dark',
} as const;
export type ThemeColor = ValueOf<typeof ThemeColorMap>;

export const PopupThemeMap = {
  Auto: 'auto',
  Light: 'light',
  Dark: 'dark',
} as const;
export type PopupTheme = ValueOf<typeof PopupThemeMap>;
