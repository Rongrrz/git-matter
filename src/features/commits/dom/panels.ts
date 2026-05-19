import type { CommitItem, CommitPanel } from '../types';
import { getCommitAuthors, shouldFilterCommit } from './authors';
import { findCommitRows } from './commits';
import { queryRootAndDescendants, uniqueElements } from './rootInclusiveQuery';
import { GitHubCommitPageSelectors } from './selectors';

function findCommitGroupPanels(root: ParentNode = document): HTMLElement[] {
  const panels = queryRootAndDescendants(root, GitHubCommitPageSelectors.commitGroupPanel);
  if (panels.length > 0) return panels;

  return uniqueElements(
    findCommitRows(root)
      .map(findCommitGroupPanelForRow)
      .filter((panel): panel is HTMLElement => Boolean(panel)),
  );
}

export function findCommitGroupPanelForRow(row: HTMLElement): HTMLElement | null {
  return (
    row.closest<HTMLElement>(GitHubCommitPageSelectors.commitGroupPanel) ??
    row.closest<HTMLElement>('ol, ul, section, article') ??
    row.parentElement
  );
}

function findTimelineRowForPanel(panel: HTMLElement): HTMLElement | null {
  return (
    panel.closest<HTMLElement>(GitHubCommitPageSelectors.timelineRow) ??
    panel.closest<HTMLElement>('li, section, article') ??
    panel
  );
}

export function findTimelineRows(root: ParentNode = document): HTMLElement[] {
  return queryRootAndDescendants(root, GitHubCommitPageSelectors.timelineRow);
}

export function collectCommitPanels(): CommitPanel[] {
  const panels = findCommitGroupPanels();

  return panels.flatMap((panel) => {
    const timelineRow = findTimelineRowForPanel(panel);
    if (!timelineRow) return [];

    const commits: CommitItem[] = findCommitRows(panel).map((row) => {
      const authors = getCommitAuthors(row);
      return {
        row,
        authors,
        filtered: shouldFilterCommit(authors),
      };
    });

    if (commits.length === 0) return [];

    return [{ panel, timelineRow, commits }];
  });
}
