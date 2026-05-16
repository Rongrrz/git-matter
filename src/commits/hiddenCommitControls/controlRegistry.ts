import type { Root } from "react-dom/client";
import { createReactMount } from "../../utils/createReactMount";
import { GitMatterSelectors } from "../selectors";

type MountedControl = {
  container: HTMLElement;
  root: Root;
};

const controls = new Set<MountedControl>();

function clearHiddenCommitControls(): void {
  controls.forEach(({ container, root }) => {
    root.unmount();
    container.remove();
  });
  controls.clear();
}

function mountControl(className: string, insert: (container: HTMLElement) => void): Root {
  const { container, root } = createReactMount(className);
  container.setAttribute(GitMatterSelectors.componentMarker, "");
  controls.add({ container, root });
  insert(container);
  return root;
}

export const _controlRegistry = {
  clearHiddenCommitControls,
  mountControl,
} as const;
