import { getFilteredCommitCount } from '../../utils/getFilteredCommitCount';
import { CommitPageSelectors } from '../selectors';
import type { CommitPanelItem, TimelineGroup } from '../types';
import { CommitVisibility } from '../visibility';
import { _controlRegistry } from './controlRegistry';
import { _mountStreak } from './mountStreak';
import { _mountToggle } from './mountToggle';

function render(items: CommitPanelItem[]): void {
  _controlRegistry.clearHiddenCommitControls();

  let streak: TimelineGroup[] = [];

  function flushStreak(): void {
    if (streak.length === 0) return;

    if (streak.length === 1) {
      const [group] = streak;
      const panel = group.commits[0].row.closest<HTMLElement>(CommitPageSelectors.commitGroupPanel);
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

export const HiddenCommitControls = {
  clear: _controlRegistry.clearHiddenCommitControls,
  render,
} as const;
