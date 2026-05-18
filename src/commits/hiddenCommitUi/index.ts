import { getFilteredCommitCount } from '../../utils/getFilteredCommitCount';
import { findCommitGroupPanelForRow } from '../dom';
import type { CommitPanel, CommitPanelContent } from '../types';
import { CommitVisibility } from '../visibility';
import { _mountStreak } from './mountStreak';
import { _mountToggle } from './mountToggle';
import { _hiddenCommitUiRegistry } from './uiRegistry';

function render(items: CommitPanel[]): void {
  _hiddenCommitUiRegistry.clearHiddenCommitUi();

  let streak: CommitPanelContent[] = [];

  function flushStreak(): void {
    if (streak.length === 0) return;

    if (streak.length === 1) {
      const [group] = streak;
      const panel = findCommitGroupPanelForRow(group.commits[0].row);
      if (panel) {
        _mountToggle.mount(panel, group.commits, false);
      }
    } else {
      CommitVisibility.setHiddenPanelGroupsExpanded(streak, false);
      _mountStreak(streak);
    }

    streak = [];
  }

  items.forEach((item) => {
    const hiddenCommitCount = getFilteredCommitCount(item.commits);
    const visibleCount = item.commits.length - hiddenCommitCount;

    if (hiddenCommitCount === 0) {
      flushStreak();
      return;
    }

    if (visibleCount === 0) {
      streak.push({
        timelineRow: item.timelineRow,
        commits: item.commits,
      });
      return;
    }

    flushStreak();
    _mountToggle.mount(item.panel, item.commits, true);
  });

  flushStreak();
}

export const HiddenCommitUi = {
  clear: _hiddenCommitUiRegistry.clearHiddenCommitUi,
  render,
} as const;
