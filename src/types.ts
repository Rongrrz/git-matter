export type CommitVisibilityMode = "off" | "dim" | "hide";
export type ThemeColor = "light" | "dark";
export type PopupTheme = "auto" | ThemeColor;

export type ExtensionMessage = {
  type: "SET_COMMIT_VISIBILITY_MODE";
  mode: CommitVisibilityMode;
};
