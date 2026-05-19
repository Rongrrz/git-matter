import type { CommitItem, CommitPanel } from '../types';
import { CommitAuthors } from './authors';
import {
  findCommitGroupPanels,
  findCommitRowsWithinNode,
  findTimelineRowForPanel,
  CommitRows,
} from './commits';

function collectCommitPanels(): CommitPanel[] {
  const panels = findCommitGroupPanels();

  return panels.flatMap((panel) => {
    const timelineRow = findTimelineRowForPanel(panel);
    if (!timelineRow) return [];

    const commits: CommitItem[] = CommitRows.find(panel).map((row) => {
      const authors = CommitAuthors.get(row);
      return {
        row,
        authors,
        filtered: CommitAuthors.shouldFilter(authors),
      };
    });

    if (commits.length === 0) return [];

    return [{ panel, timelineRow, commits }];
  });
}

function collectCommitRowsFromNode(node: HTMLElement): HTMLElement[] {
  return findCommitRowsWithinNode(node);
}

export const CommitPanels = {
  collect: collectCommitPanels,
  collectRowsFromNode: collectCommitRowsFromNode,
} as const;
