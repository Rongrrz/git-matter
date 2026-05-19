import { findCommitGroupPanelForRow } from '@/features/commits/dom/commits';
import { getHiddenCommitCount } from '@/features/commits/hiddenCommitUi/getHiddenCommitCount';
import { mountHiddenCommitStreakUi } from '@/features/commits/hiddenCommitUi/mountStreak';
import { mountHiddenCommitToggleUi } from '@/features/commits/hiddenCommitUi/mountToggle';
import { clearMountedHiddenCommitUi } from '@/features/commits/hiddenCommitUi/uiRegistry';
import type { CommitPanel, CommitPanelContent } from '@/features/commits/types';
import { setHiddenPanelGroupsExpanded } from '@/features/commits/visibility/expansionControls';

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
