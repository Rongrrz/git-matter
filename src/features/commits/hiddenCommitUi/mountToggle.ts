import { createElement } from 'react';

import { HiddenCommitsToggle } from '@/features/commits/hiddenCommitUi/components/HiddenCommitsToggle';
import { getHiddenCommitCount } from '@/features/commits/hiddenCommitUi/getHiddenCommitCount';
import { mountHiddenCommitUi } from '@/features/commits/hiddenCommitUi/uiRegistry';
import type { CommitItem } from '@/features/commits/types';
import { setFilteredCommitsExpanded } from '@/features/commits/visibility/expansionControls';

export function mountHiddenCommitToggleUi(
  panel: HTMLElement,
  commits: CommitItem[],
  hasVisibleBelow: boolean,
): void {
  const hiddenCommitCount = getHiddenCommitCount(commits);
  const root = mountHiddenCommitUi('git-matter-toggle-root', (container) => {
    panel.insertBefore(container, panel.firstChild);
  });

  let expanded = false;
  const render = () => {
    root.render(
      createElement(HiddenCommitsToggle, {
        expanded,
        hiddenCommitCount,
        hasVisibleBelow,
        onToggle: () => {
          expanded = !expanded;
          setFilteredCommitsExpanded(commits, expanded);
          render();
        },
      }),
    );
  };

  render();
}
