export type CommitVisibilityMode = "off" | "dim" | "hide";
export type ColorMode = "light" | "dark";
export type PopupThemeMode = "auto" | ColorMode;

export const COMMIT_VISIBILITY_MODE_STORAGE_KEY = "commitDisplayMode";
export const POPUP_THEME_MODE_STORAGE_KEY = "popupThemeMode";

export const DEFAULT_COMMIT_VISIBILITY_MODE: CommitVisibilityMode = "hide";
export const DEFAULT_POPUP_THEME_MODE: PopupThemeMode = "auto";

export type ExtensionMessage = {
  type: "SET_COMMIT_VISIBILITY_MODE";
  mode: CommitVisibilityMode;
};
