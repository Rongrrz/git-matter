import { createElement } from 'react';

import { HiddenCommitsToggle } from '../../components/HiddenCommitsToggle';
import { getFilteredCommitCount } from '../../utils/getFilteredCommitCount';
import type { CommitItem } from '../types';
import { CommitVisibility } from '../visibility';
import { mountHiddenCommitUi } from './uiRegistry';

export function mountHiddenCommitToggleUi(
  panel: HTMLElement,
  commits: CommitItem[],
  hasVisibleBelow: boolean,
): void {
  const hiddenCommitCount = getFilteredCommitCount(commits);
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
          CommitVisibility.setFilteredCommitsExpanded(commits, expanded);
          render();
        },
      }),
    );
  };

  render();
}
