import { UserPreference } from '@/shared/storage/preferences/userPreference';
import {
  CommitVisibilityModeMap,
  PopupThemeMap,
  type CommitVisibilityMode,
  type PopupTheme,
} from '@/shared/types/userPreferenceOptions';

export const commitVisibilityPreference = new UserPreference<CommitVisibilityMode>({
  storageKey: 'commitVisibilityMode',
  defaultValue: CommitVisibilityModeMap.Dim,
  validValues: Object.values(CommitVisibilityModeMap),
});

export const popupThemePreference = new UserPreference<PopupTheme>({
  storageKey: 'popupThemeMode',
  defaultValue: PopupThemeMap.Auto,
  validValues: Object.values(PopupThemeMap),
});
