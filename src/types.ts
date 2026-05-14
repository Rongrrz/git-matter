export type FilteredCommitDisplayMode = "off" | "dim" | "hide";

export const COMMIT_DISPLAY_MODE_STORAGE_KEY = "commitDisplayMode";

export const DEFAULT_COMMIT_DISPLAY_MODE: FilteredCommitDisplayMode = "hide";

export type DisplayModeMessage = {
  type: "SET_COMMIT_DISPLAY_MODE";
  mode: FilteredCommitDisplayMode;
}