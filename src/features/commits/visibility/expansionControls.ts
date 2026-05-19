import type { CommitItem, CommitPanelContent } from '@/features/commits/types';
import {
  clearLastCommitStyling,
  syncLastCommitStyling,
} from '@/features/commits/visibility/lastCommitStyling';
import { applyExpandedState } from '@/features/commits/visibility/rowState';

export function setFilteredCommitsExpanded(commits: CommitItem[], expanded: boolean): void {
  const hiddenRows = commits.filter((commit) => commit.filtered).map((commit) => commit.row);
  applyExpandedState(hiddenRows, expanded);

  if (expanded) {
    clearLastCommitStyling(commits);
  } else {
    syncLastCommitStyling(commits);
  }
}

export function setHiddenPanelGroupsExpanded(
  groups: CommitPanelContent[],
  expanded: boolean,
): void {
  groups.forEach((group) => {
    applyExpandedState([group.timelineRow], expanded);
    setFilteredCommitsExpanded(group.commits, expanded);
  });
}
