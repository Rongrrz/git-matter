export type CommitVisibilityMode = "off" | "dim" | "hide";
export type ColorMode = "light" | "dark";

export const COMMIT_VISIBILITY_MODE_STORAGE_KEY = "commitDisplayMode";

export const DEFAULT_COMMIT_VISIBILITY_MODE: CommitVisibilityMode = "hide";

export type ExtensionMessage =
  | {
      type: "SET_COMMIT_VISIBILITY_MODE";
      mode: CommitVisibilityMode;
    }
  | {
      type: "GET_GITHUB_COLOR_MODE";
    };

export type GithubColorModeResponse = {
  mode: ColorMode | null;
};
