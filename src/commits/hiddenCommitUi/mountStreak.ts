import { createElement } from 'react';

import { HiddenCommitsStreak } from '../../components/HiddenCommitsStreak';
import { getFilteredCommitCount } from '../../utils/getFilteredCommitCount';
import type { CommitPanelContent } from '../types';
import { CommitVisibility } from '../visibility';
import { mountHiddenCommitUi } from './uiRegistry';

export function mountHiddenCommitStreakUi(groups: CommitPanelContent[]): void {
  const [firstGroup] = groups;
  const parent = firstGroup.timelineRow.parentElement;
  if (!parent) return;

  const root = mountHiddenCommitUi('git-matter-streak-root', (container) => {
    parent.insertBefore(container, firstGroup.timelineRow);
  });

  const hiddenCommitCount = getFilteredCommitCount(groups.flatMap((group) => group.commits));

  let expanded = false;
  const render = () => {
    root.render(
      createElement(HiddenCommitsStreak, {
        expanded,
        hiddenCommitCount,
        hiddenDayCount: groups.length,
        onToggle: () => {
          expanded = !expanded;
          CommitVisibility.setHiddenPanelGroupsExpanded(groups, expanded);
          render();
        },
      }),
    );
  };

  render();
}
