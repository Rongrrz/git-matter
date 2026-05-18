import { getFilteredCommitCount } from '../../utils/getFilteredCommitCount';
import { CommitDom } from '../dom';
import type { CommitPanel, CommitPanelContent } from '../types';
import { CommitVisibility } from '../visibility';
import { mountHiddenCommitStreakUi } from './mountStreak';
import { mountHiddenCommitToggleUi } from './mountToggle';
import { clearMountedHiddenCommitUi } from './uiRegistry';

function render(items: CommitPanel[]): void {
  clearMountedHiddenCommitUi();

  let streak: CommitPanelContent[] = [];

  function flushStreak(): void {
    if (streak.length === 0) return;

    if (streak.length === 1) {
      const [group] = streak;
      const panel = CommitDom.rows.findGroupPanel(group.commits[0].row);
      if (panel) {
        mountHiddenCommitToggleUi(panel, group.commits, false);
      }
    } else {
      CommitVisibility.setHiddenPanelGroupsExpanded(streak, false);
      mountHiddenCommitStreakUi(streak);
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
    mountHiddenCommitToggleUi(item.panel, item.commits, true);
  });

  flushStreak();
}

export const HiddenCommitUi = {
  clear: clearMountedHiddenCommitUi,
  render,
} as const;
