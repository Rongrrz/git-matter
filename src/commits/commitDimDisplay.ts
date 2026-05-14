import { resetCommitRow, dimCommitRow } from "./commitRowDisplay";
import { isBotOnlyCommitRow } from "./commitAuthors";

export function applyDimmedDisplay(filteredRows: HTMLElement[]): void {
  filteredRows.forEach((row) => {
    resetCommitRow(row);
    dimCommitRow(row);
  });
}

export function applyImmediateDimToRow(row: HTMLElement): void {
  if (!isBotOnlyCommitRow(row)) return;
  dimCommitRow(row);
}