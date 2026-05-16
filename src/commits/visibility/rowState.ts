import { GitMatterSelectors } from '../selectors';

function stopRowAnimations(row: HTMLElement): void {
  row.getAnimations().forEach((animation) => animation.cancel());
}

function resetRow(row: HTMLElement): void {
  stopRowAnimations(row);
  row.classList.remove(
    GitMatterSelectors.dimmed,
    GitMatterSelectors.hidden,
    GitMatterSelectors.lastCommit,
  );
}

function dimRow(row: HTMLElement): void {
  stopRowAnimations(row);
  row.classList.remove(GitMatterSelectors.hidden);
  row.classList.add(GitMatterSelectors.dimmed);
}

function hideRow(row: HTMLElement): void {
  stopRowAnimations(row);
  row.classList.remove(GitMatterSelectors.dimmed);
  row.classList.add(GitMatterSelectors.hidden);
}

function revealRow(row: HTMLElement): void {
  stopRowAnimations(row);
  row.classList.remove(GitMatterSelectors.hidden, GitMatterSelectors.lastCommit);
}

function applyExpandedState(rows: HTMLElement[], expanded: boolean): void {
  rows.forEach((row) => (expanded ? revealRow(row) : hideRow(row)));
}

export const _rowState = {
  applyExpandedState,
  dim: dimRow,
  hide: hideRow,
  reset: resetRow,
} as const;
