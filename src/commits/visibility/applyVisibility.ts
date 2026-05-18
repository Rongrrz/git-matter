import type { CommitVisibilityMode } from '../../types';
import { CommitDom } from '../dom';
import type { CommitItem, CommitPanel } from '../types';
import { syncLastCommitStyling } from './lastCommitStyling';
import { dimRow, hideRow, resetRow } from './rowState';

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
    if (mode === 'hide') syncLastCommitStyling(panel.commits);
  });
}

export function applySingleCommitVisibility(commit: CommitItem, mode: CommitVisibilityMode): void {
  resetRow(commit.row);
  if (!commit.filtered || mode === 'off') return;
  if (mode === 'dim') return dimRow(commit.row);
  if (mode === 'hide') return hideRow(commit.row);
}

export function resetAllCommitVisibility(): void {
  const rows = [...CommitDom.rows.find(), ...CommitDom.page.findTimelineRows()];

  Array.from(new Set(rows)).forEach(resetRow);
}
