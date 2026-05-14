/**
 * This file contains useful DOM selectors for the project-name/commits page,
 * such that we don't have to see chaotic green strings in the main logic files.
 */

const BaseCommitPageSelectors = {
  commitRow: '[data-testid="commit-row-item"]',
  timelineRow: 'div[class*="TimelineRow-module__timelineRowItem"]',
  commitGroupPanel: 'div[class*="CommitGroup-module__panel"]',
  commitAuthorAria: '[aria-label^="commits by "]',
};

const allCommitPageRows = [BaseCommitPageSelectors.commitRow, BaseCommitPageSelectors.timelineRow].join(
  ", ",
);

const pageStructure = [
  BaseCommitPageSelectors.commitRow,
  BaseCommitPageSelectors.commitGroupPanel,
  BaseCommitPageSelectors.timelineRow,
].join(", ");

export const CommitPageSelectors = {
  ...BaseCommitPageSelectors,
  allCommitPageRows,
  pageStructure,
} as const;

// GitMatter class names selectors, used for injected UI and visual states
// TODO: Extract once we have features beyond commit-filtering.
export const GitMatterSelectosr = {
  dimmed: "git-matter-dimmed-commit",
  componentMarker: "data-git-matter-component",
} as const;
