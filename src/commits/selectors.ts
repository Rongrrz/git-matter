// GitHub DOM selectors (used to find commit elements)
const github = {
  commitRow: '[data-testid="commit-row-item"]',
  timelineRow: 'div[class*="TimelineRow-module__timelineRowItem"]',
  commitGroupPanel: 'div[class*="CommitGroup-module__panel"]',
  commitAuthorAria: '[aria-label^="commits by "]',
} as const;

// GitMatter class names (used for injected UI and visual states)
const gitMatter = {
  dimmed: "git-matter-dimmed-commit",
  componentMarker: "data-git-matter-component",
} as const;

// Combined selectors
const allRows = `${github.commitRow}, ${github.timelineRow}`;

export const commitPageSelectors = {
  // GitHub elements
  commitRow: github.commitRow,
  timelineRow: github.timelineRow,
  commitGroupPanel: github.commitGroupPanel,
  commitAuthorAria: github.commitAuthorAria,

  // GitMatter elements
  rowsToReset: allRows,
} as const;

export const GIT_MATTER_CLASSES = gitMatter;
