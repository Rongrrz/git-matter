import { createElement } from 'react';

import { HiddenCommitsStreak } from '@/features/commits/hiddenCommitUi/components/HiddenCommitsStreak';
import { getHiddenCommitCount } from '@/features/commits/hiddenCommitUi/getHiddenCommitCount';
import { mountHiddenCommitUi } from '@/features/commits/hiddenCommitUi/uiRegistry';
import type { CommitPanelContent } from '@/features/commits/types';
import { setHiddenPanelGroupsExpanded } from '@/features/commits/visibility/expansionControls';

export function mountHiddenCommitStreakUi(groups: CommitPanelContent[]): void {
  const [firstGroup] = groups;
  const parent = firstGroup.timelineRow.parentElement;
  if (!parent) return;

  const root = mountHiddenCommitUi('git-matter-streak-root', (container) => {
    parent.insertBefore(container, firstGroup.timelineRow);
  });

  const hiddenCommitCount = getHiddenCommitCount(groups.flatMap((group) => group.commits));

  let expanded = false;
  const render = () => {
    root.render(
      createElement(HiddenCommitsStreak, {
        expanded,
        hiddenCommitCount,
        hiddenDayCount: groups.length,
        onToggle: () => {
          expanded = !expanded;
          setHiddenPanelGroupsExpanded(groups, expanded);
          render();
        },
      }),
    );
  };

  render();
}
