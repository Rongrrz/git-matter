import { ThemeColorMap, type ThemeColor } from '@/shared/types/userPreferenceOptions';

export function getBrowserColorMode(): ThemeColor {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? ThemeColorMap.Dark
    : ThemeColorMap.Light;
}

export function getCurrentSiteColorMode(): ThemeColor {
  const colorScheme = getComputedStyle(document.documentElement).colorScheme;
  if (colorScheme.includes(ThemeColorMap.Dark)) return ThemeColorMap.Dark;
  if (colorScheme.includes(ThemeColorMap.Light)) return ThemeColorMap.Light;

  const colorMode = document.documentElement.getAttribute('data-color-mode');
  if (colorMode === ThemeColorMap.Dark || colorMode === ThemeColorMap.Light) return colorMode;

  return getBrowserColorMode();
}
