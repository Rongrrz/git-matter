import { findCommitGroupPanelForRow } from '../dom/panels';
import type { CommitPanel, CommitPanelContent } from '../types';
import { setHiddenPanelGroupsExpanded } from '../visibility/expansionControls';
import { getHiddenCommitCount } from './getHiddenCommitCount';
import { mountHiddenCommitStreakUi } from './mountStreak';
import { mountHiddenCommitToggleUi } from './mountToggle';
import { clearMountedHiddenCommitUi } from './uiRegistry';

export function renderHiddenCommitUi(items: CommitPanel[]): void {
  clearMountedHiddenCommitUi();

  let streak: CommitPanelContent[] = [];

  function flushStreak(): void {
    if (streak.length === 0) return;

    if (streak.length === 1) {
      const [group] = streak;
      const panel = findCommitGroupPanelForRow(group.commits[0].row);
      if (panel) {
        mountHiddenCommitToggleUi(panel, group.commits, false);
      }
    } else {
      setHiddenPanelGroupsExpanded(streak, false);
      mountHiddenCommitStreakUi(streak);
    }

    streak = [];
  }

  items.forEach((item) => {
    const hiddenCommitCount = getHiddenCommitCount(item.commits);
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
