import type { CommitVisibilityMode } from '../../types';
import { findCommitRows, findTimelineRows } from '../dom';
import type { CommitItem, CommitPanel } from '../types';
import { _lastCommitStyling } from './lastCommitStyling';
import { _rowState } from './rowState';

function applyPanelCommitVisibility(panels: CommitPanel[], mode: CommitVisibilityMode): void {
  panels.forEach((panel) => {
    _rowState.reset(panel.timelineRow);

    panel.commits.forEach((commit) => {
      applySingleCommitVisibility(commit, mode);
    });

    // We need to check for an edge case where our current commit will be the "last child"
    // after filtering, so that we do not apply a bottom border.
    if (mode === 'hide') _lastCommitStyling.sync(panel.commits);
  });
}

function applySingleCommitVisibility(commit: CommitItem, mode: CommitVisibilityMode): void {
  _rowState.reset(commit.row);
  if (!commit.filtered || mode === 'off') return;
  if (mode === 'dim') return _rowState.dim(commit.row);
  if (mode === 'hide') return _rowState.hide(commit.row);
}

function resetAllCommitVisibility(): void {
  const rows = [...findCommitRows(), ...findTimelineRows()];

  Array.from(new Set(rows)).forEach(_rowState.reset);
}

export const _applyVisibility = {
  applyPanel: applyPanelCommitVisibility,
  applySingle: applySingleCommitVisibility,
  resetAll: resetAllCommitVisibility,
} as const;
