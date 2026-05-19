/**
 * This file contains useful DOM selectors for the project-name/commits page,
 * such that we don't have to see chaotic green strings in the main logic files.
 */

export const GitHubCommitPageSelectors = {
  commitRow: '[data-testid="commit-row-item"]',
  commitLink: 'a[href*="/commit/"]',
  authorQueryLink: 'a[href*="author="]',
  authorHovercardLink: 'a[data-hovercard-url*="/users/"]',
  timelineRow: [
    '[data-testid*="timeline"]',
    'div[class*="TimelineRow-module__timelineRowItem"]',
  ].join(', '),
  commitGroupPanel: [
    '[data-testid*="commit-group"]',
    'div[class*="CommitGroup-module__panel"]',
  ].join(', '),
  commitAuthorAria: '[aria-label^="commits by "]',
  commitAuthorText: '[data-testid*="author"], [class*="author"], [class*="Author"]',
} as const;
