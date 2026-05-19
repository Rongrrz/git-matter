import { createElement } from 'react';

import type { CommitPanelContent } from '../types';
import { setHiddenPanelGroupsExpanded } from '../visibility/expansionControls';
import { HiddenCommitsStreak } from './components/HiddenCommitsStreak';
import { getHiddenCommitCount } from './getHiddenCommitCount';
import { mountHiddenCommitUi } from './uiRegistry';

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
