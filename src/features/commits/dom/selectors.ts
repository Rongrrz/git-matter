/**
 * This file contains useful DOM selectors for the project-name/commits page,
 * such that we don't have to see chaotic green strings in the main logic files.
 */

const GitHubCommitPageBaseSelectors = {
  timelineRow: [
    '[data-testid*="timeline"]',
    'div[class*="TimelineRow-module__timelineRowItem"]',
  ].join(', '),

  commitGroupPanel: [
    '[data-testid*="commit-group"]',
    'div[class*="CommitGroup-module__panel"]',
  ].join(', '),

  commitRow: '[data-testid="commit-row-item"]',
  commitLink: 'a[href*="/commit/"]',
  authorQueryLink: 'a[href*="author="]',
  authorHovercardLink: 'a[data-hovercard-url*="/users/"]',
  commitAuthorAria: '[aria-label^="commits by "]',
  commitAuthorText: '[data-testid*="author"], [class*="author"], [class*="Author"]',
} as const;

export const GitHubCommitPageSelectors = {
  ...GitHubCommitPageBaseSelectors,

  commitPageDom: [
    GitHubCommitPageBaseSelectors.commitRow,
    GitHubCommitPageBaseSelectors.commitLink,
    GitHubCommitPageBaseSelectors.commitGroupPanel,
    GitHubCommitPageBaseSelectors.timelineRow,
  ].join(', '),

  commitPageContainer: [
    GitHubCommitPageBaseSelectors.commitGroupPanel,
    GitHubCommitPageBaseSelectors.timelineRow,
  ].join(', '),

  authorSignal: [
    GitHubCommitPageBaseSelectors.authorQueryLink,
    GitHubCommitPageBaseSelectors.authorHovercardLink,
    GitHubCommitPageBaseSelectors.commitAuthorAria,
    GitHubCommitPageBaseSelectors.commitAuthorText,
  ].join(', '),
} as const;
