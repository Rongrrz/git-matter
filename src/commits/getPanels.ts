import { CommitPageSelectors } from "./selectors";
import { getCommitAuthors, shouldFilterCommit } from "./authorFiltering";
import type { CommitItem, CommitPanelItem } from "./types";

export function getCommitPanels(): CommitPanelItem[] {
  const panels = document.querySelectorAll<HTMLElement>(CommitPageSelectors.commitGroupPanel);

  return Array.from(panels).flatMap((panel) => {
    const timelineRow = panel.closest<HTMLElement>(CommitPageSelectors.timelineRow);
    if (!timelineRow) return [];

    const commitRows = panel.querySelectorAll<HTMLElement>(CommitPageSelectors.commitRow);
    const commits: CommitItem[] = Array.from(commitRows, (row) => {
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

export function getCommitRowsFromNode(node: HTMLElement): HTMLElement[] {
  const rows: HTMLElement[] = [];

  if (node.matches(CommitPageSelectors.commitRow)) {
    rows.push(node);
  }

  rows.push(...Array.from(node.querySelectorAll<HTMLElement>(CommitPageSelectors.commitRow)));

  return rows;
}
