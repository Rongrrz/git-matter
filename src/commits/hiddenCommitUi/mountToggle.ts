import { createElement } from 'react';

import { HiddenCommitsToggle } from '../../components/HiddenCommitsToggle';
import { getFilteredCommitCount } from '../../utils/getFilteredCommitCount';
import type { CommitItem } from '../types';
import { CommitVisibility } from '../visibility';
import { _hiddenCommitUiRegistry } from './uiRegistry';

function mountToggle(panel: HTMLElement, commits: CommitItem[], hasVisibleBelow: boolean): void {
  const hiddenCommitCount = getFilteredCommitCount(commits);
  const root = _hiddenCommitUiRegistry.mountHiddenCommitUi(
    'git-matter-toggle-root',
    (container) => {
      panel.insertBefore(container, panel.firstChild);
    },
  );

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

export const _mountToggle = {
  mount: mountToggle,
} as const;
