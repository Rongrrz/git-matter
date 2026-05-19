import type { ThemeColor } from '../../types';

export function getBrowserColorMode(): ThemeColor {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getCurrentSiteColorMode(): ThemeColor {
  const colorScheme = getComputedStyle(document.documentElement).colorScheme;
  if (colorScheme.includes('dark')) return 'dark';
  if (colorScheme.includes('light')) return 'light';

  const colorMode = document.documentElement.getAttribute('data-color-mode');
  if (colorMode === 'dark' || colorMode === 'light') return colorMode;

  return getBrowserColorMode();
}
