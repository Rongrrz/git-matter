import {
  applyPanelCommitVisibility,
  applySingleCommitVisibility,
  resetAllCommitVisibility,
} from './applyVisibility';
import { setFilteredCommitsExpanded, setHiddenPanelGroupsExpanded } from './expansionControls';

export const CommitVisibility = {
  applyPanel: applyPanelCommitVisibility,
  applySingle: applySingleCommitVisibility,
  resetAll: resetAllCommitVisibility,
  setFilteredCommitsExpanded,
  setHiddenPanelGroupsExpanded,
} as const;
