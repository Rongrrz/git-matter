import type { CommitItem, TimelineGroup } from '../types';
import { _lastCommitStyling } from './lastCommitStyling';
import { _rowState } from './rowState';

function setFilteredCommitsExpanded(commits: CommitItem[], expanded: boolean): void {
  const hiddenRows = commits.filter((commit) => commit.filtered).map((commit) => commit.row);
  _rowState.applyExpandedState(hiddenRows, expanded);

  if (expanded) {
    _lastCommitStyling.clear(commits);
  } else {
    _lastCommitStyling.sync(commits);
  }
}

function setHiddenPanelGroupsExpanded(groups: TimelineGroup[], expanded: boolean): void {
  groups.forEach((group) => {
    _rowState.applyExpandedState([group.timelineRow], expanded);
    setFilteredCommitsExpanded(group.commits, expanded);
  });
}

export const _expansionControls = {
  setFilteredCommitsExpanded,
  setHiddenPanelGroupsExpanded,
} as const;
