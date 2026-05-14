export type CommitVisibilityMode = "off" | "dim" | "hide";

export const COMMIT_VISIBILITY_MODE_STORAGE_KEY = "commitDisplayMode";

export const DEFAULT_COMMIT_VISIBILITY_MODE: CommitVisibilityMode = "hide";

export type CommitVisibilityMessage = {
  type: "SET_COMMIT_VISIBILITY_MODE";
  mode: CommitVisibilityMode;
};
