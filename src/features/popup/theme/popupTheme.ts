import { getCurrentSiteColorMode } from '@/features/popup/theme/siteColorMode';
import {
  type PopupTheme,
  PopupThemeMap,
  ThemeColorMap,
  type ThemeColor,
} from '@/shared/types/userPreferenceOptions';

export function resolvePopupThemeColor(mode: PopupTheme): ThemeColor {
  if (mode === PopupThemeMap.Auto) return getCurrentSiteColorMode();
  if (mode === PopupThemeMap.Light) return ThemeColorMap.Light;
  return ThemeColorMap.Dark;
}

export function getPopupThemeClasses(mode: ThemeColor) {
  if (mode === ThemeColorMap.Dark) {
    return {
      shell: 'w-64 bg-[#0d1117] p-4 font-sans text-sm text-[#e6edf3]',
      mutedText: 'text-[#8b949e]',
      border: 'border-[#30363d]',
      selected: 'bg-[#21262d] text-[#e6edf3]',
    };
  }

  return {
    shell: 'w-64 bg-white p-4 font-sans text-sm text-[#24292f]',
    mutedText: 'text-[#57606a]',
    border: 'border-[#d0d7de]',
    selected: 'bg-[#f6f8fa] text-[#24292f]',
  };
}
