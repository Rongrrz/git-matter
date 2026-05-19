import type { CommitVisibilityMode } from '@/shared/types/userPreferenceOptions';

export type ExtensionMessage = {
  type: 'SET_COMMIT_VISIBILITY_MODE';
  mode: CommitVisibilityMode;
};
