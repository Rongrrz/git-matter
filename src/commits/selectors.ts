// GitHub DOM selectors (used to find commit elements)
const github = {
  commitRow: '[data-testid="commit-row-item"]',
  timelineRow: 'div[class*="TimelineRow-module__timelineRowItem"]',
  commitGroupPanel: 'div[class*="CommitGroup-module__panel"]',
  commitAuthorAria: '[aria-label^="commits by "]',
} as const;

// GitMatter injected elements (used to find/reset our own components)
const gitMatter = {
  toggleRoot: ".git-matter-toggle-root",
  streakRoot: ".git-matter-streak-root",
  processedMarker: ".git-matter-processed",
} as const;

// Combined selector for cleanup
const allRows = `${github.commitRow}, ${github.timelineRow}`;

export const commitPageSelectors = {
  // GitHub elements
  commitRow: github.commitRow,
  timelineRow: github.timelineRow,
  commitGroupPanel: github.commitGroupPanel,
  commitAuthorAria: github.commitAuthorAria,

  // GitMatter elements
  gitMatterCommitComponent: `${gitMatter.toggleRoot}, ${gitMatter.streakRoot}, ${gitMatter.processedMarker}`,
  rowsToReset: allRows,
} as const;