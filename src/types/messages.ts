import type { CommitVisibilityMode } from './userPreferenceOptions';

export type ExtensionMessage = {
  type: 'SET_COMMIT_VISIBILITY_MODE';
  mode: CommitVisibilityMode;
};
