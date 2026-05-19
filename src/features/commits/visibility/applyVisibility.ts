import { findCommitRows, findTimelineRows } from '@/features/commits/dom/commits';
import type { CommitItem, CommitPanel } from '@/features/commits/types';
import { syncLastCommitStyling } from '@/features/commits/visibility/lastCommitStyling';
import { dimRow, hideRow, resetRow } from '@/features/commits/visibility/rowState';
import {
  CommitVisibilityModeMap,
  type CommitVisibilityMode,
} from '@/shared/types/userPreferenceOptions';

export function applyPanelCommitVisibility(
  panels: CommitPanel[],
  mode: CommitVisibilityMode,
): void {
  panels.forEach((panel) => {
    resetRow(panel.timelineRow);

    panel.commits.forEach((commit) => {
      applySingleCommitVisibility(commit, mode);
    });

    // We need to check for an edge case where our current commit will be the "last child"
    // after filtering, so that we do not apply a bottom border.
    if (mode === CommitVisibilityModeMap.Dim) syncLastCommitStyling(panel.commits);
  });
}

export function applySingleCommitVisibility(commit: CommitItem, mode: CommitVisibilityMode): void {
  resetRow(commit.row);
  if (!commit.filtered || mode === CommitVisibilityModeMap.Off) return;
  if (mode === CommitVisibilityModeMap.Dim) return dimRow(commit.row);
  if (mode === CommitVisibilityModeMap.Hide) return hideRow(commit.row);
}

export function resetAllCommitVisibility(): void {
  const rows = [...findCommitRows(), ...findTimelineRows()];

  Array.from(new Set(rows)).forEach(resetRow);
}
