import { createElement } from 'react';

import type { CommitItem } from '../types';
import { setFilteredCommitsExpanded } from '../visibility/expansionControls';
import { HiddenCommitsToggle } from './components/HiddenCommitsToggle';
import { getHiddenCommitCount } from './getHiddenCommitCount';
import { mountHiddenCommitUi } from './uiRegistry';

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
