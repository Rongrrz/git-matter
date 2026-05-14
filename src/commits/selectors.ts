const commitRow = '[data-testid="commit-row-item"]';
const timelineRow = 'div[class*="TimelineRow-module__timelineRowItem"]';
const allGitHubRows = `${commitRow}, ${timelineRow}`;

const commitGroupPanelSelector = 'div[class*="CommitGroup-module__panel"]';

const gitMatterCommitComponent =
  ".git-matter-toggle-root, .git-matter-streak-root, .git-matter-processed";

const commitAuthorAriaSelector = '[aria-label^="commits by "]';

export const commitPageSelectors = {
  commitRow: commitRow,
  timelineRow: timelineRow,
  rowsToReset: allGitHubRows,
  commitGroupPanel: commitGroupPanelSelector,
  gitMatterCommitComponent: gitMatterCommitComponent,
  commitRowAria: commitAuthorAriaSelector,
};
