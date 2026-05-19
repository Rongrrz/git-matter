import { GitMatterSelectors } from '@/features/commits/selectors';

function stopRowAnimations(row: HTMLElement): void {
  row.getAnimations().forEach((animation) => animation.cancel());
}

export function resetRow(row: HTMLElement): void {
  stopRowAnimations(row);
  row.classList.remove(
    GitMatterSelectors.dimmed,
    GitMatterSelectors.hidden,
    GitMatterSelectors.lastCommit,
  );
}

export function dimRow(row: HTMLElement): void {
  stopRowAnimations(row);
  row.classList.remove(GitMatterSelectors.hidden);
  row.classList.add(GitMatterSelectors.dimmed);
}

export function hideRow(row: HTMLElement): void {
  stopRowAnimations(row);
  row.classList.remove(GitMatterSelectors.dimmed);
  row.classList.add(GitMatterSelectors.hidden);
}

function revealRow(row: HTMLElement): void {
  stopRowAnimations(row);
  row.classList.remove(GitMatterSelectors.hidden, GitMatterSelectors.lastCommit);
}

export function applyExpandedState(rows: HTMLElement[], expanded: boolean): void {
  rows.forEach((row) => (expanded ? revealRow(row) : hideRow(row)));
}
