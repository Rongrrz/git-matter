import type { Root } from 'react-dom/client';

import { createReactMount } from '../../utils/createReactMount';
import { GitMatterSelectors } from '../selectors';

type MountedHiddenCommitUi = {
  container: HTMLElement;
  root: Root;
};

const mountedUi = new Set<MountedHiddenCommitUi>();

function clearHiddenCommitUi(): void {
  mountedUi.forEach(({ container, root }) => {
    root.unmount();
    container.remove();
  });
  mountedUi.clear();
}

function mountHiddenCommitUi(className: string, insert: (container: HTMLElement) => void): Root {
  const { container, root } = createReactMount(className);
  container.setAttribute(GitMatterSelectors.componentMarker, '');
  mountedUi.add({ container, root });
  insert(container);
  return root;
}

export const _hiddenCommitUiRegistry = {
  clearHiddenCommitUi,
  mountHiddenCommitUi,
} as const;
