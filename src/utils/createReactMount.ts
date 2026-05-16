import { createRoot } from 'react-dom/client';

/**
 * The container gives React a stable element to render into and lets us
 * cleanly unmount/remove the UI later.
 *
 * Since it is inserted into the target layout, the mounted UI can naturally
 * inherit surrounding layout and styling.
 */
export function createReactMount(className: string) {
  const container = document.createElement('div');
  container.className = className;
  const root = createRoot(container);
  return { container, root };
}
