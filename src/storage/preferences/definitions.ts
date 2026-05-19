import {
  CommitVisibilityModeMap,
  PopupThemeMap,
  type CommitVisibilityMode,
  type PopupTheme,
} from '../../types/userPreferenceOptions';
import { UserPreference } from './userPreference';

const CommitVisibilityPreference = new UserPreference<CommitVisibilityMode>({
  storageKey: 'commitVisibilityMode',
  defaultValue: CommitVisibilityModeMap.Dim,
  validValues: Object.values(CommitVisibilityModeMap),
});

const PopupThemePreference = new UserPreference<PopupTheme>({
  storageKey: 'popupThemeMode',
  defaultValue: PopupThemeMap.Auto,
  validValues: Object.values(PopupThemeMap),
});

export const UserPreferences = {
  commitVisibility: CommitVisibilityPreference,
  popupTheme: PopupThemePreference,
};
