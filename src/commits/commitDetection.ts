import { commitPageSelectors } from "./selectors";
import { isBotOnlyCommitRow } from "./commitAuthors";

export function collectCommitPanels(): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>(
      commitPageSelectors.commitGroupPanel,
    ),
  );
}

export function collectCommitRowsInPanel(panel: HTMLElement): HTMLElement[] {
  return Array.from(
    panel.querySelectorAll<HTMLElement>(commitPageSelectors.commitRow),
  );
}

export function collectFilteredCommitRows(panels: HTMLElement[]): HTMLElement[] {
  const filteredRows: HTMLElement[] = [];
  panels.forEach((panel) => {
    const commitRows = collectCommitRowsInPanel(panel);
    commitRows.forEach((row) => {
      if (isBotOnlyCommitRow(row)) {
        filteredRows.push(row);
      }
    });
  });
  return filteredRows;
}