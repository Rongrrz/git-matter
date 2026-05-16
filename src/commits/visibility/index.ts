import { _applyVisibility } from "./applyVisibility";
import { _expansionControls } from "./expansionControls";

export const CommitVisibility = {
  applyPanel: _applyVisibility.applyPanel,
  applySingle: _applyVisibility.applySingle,
  resetAll: _applyVisibility.resetAll,
  setFilteredCommitsExpanded: _expansionControls.setFilteredCommitsExpanded,
  setHiddenPanelGroupsExpanded: _expansionControls.setHiddenPanelGroupsExpanded,
} as const;
