import { queryRootAndDescendants, uniqueElements } from './rootInclusiveQuery';
import { GitHubCommitPageSelectors } from './selectors';

export function findCommitRows(root: ParentNode = document): HTMLElement[] {
  const linkedRows = queryRootAndDescendants<HTMLAnchorElement>(
    root,
    GitHubCommitPageSelectors.commitLink,
  )
    .map(findCommitRowForLink)
    .filter((row): row is HTMLElement => Boolean(row));

  return uniqueElements([
    ...queryRootAndDescendants(root, GitHubCommitPageSelectors.commitRow),
    ...linkedRows,
  ]);
}

export function isCommitPageDomNode(node: HTMLElement): boolean {
  return isLikelyCommitRow(node) || node.matches(GitHubCommitPageSelectors.commitPageContainer);
}

export function containsCommitPageDom(node: HTMLElement): boolean {
  return (
    isCommitPageDomNode(node) ||
    Boolean(node.querySelector(GitHubCommitPageSelectors.commitPageDom))
  );
}

function isLikelyCommitRow(row: HTMLElement): boolean {
  return (
    row.matches(GitHubCommitPageSelectors.commitRow) ||
    (Boolean(row.querySelector(GitHubCommitPageSelectors.commitLink)) && hasAuthorSignal(row))
  );
}

function findCommitRowForLink(link: HTMLAnchorElement): HTMLElement | null {
  const primaryRow = link.closest<HTMLElement>(GitHubCommitPageSelectors.commitRow);
  if (primaryRow) return primaryRow;

  let current = link.parentElement;
  while (current && current !== document.body) {
    if (hasAuthorSignal(current)) return current;
    current = current.parentElement;
  }

  return null;
}

function hasAuthorSignal(row: HTMLElement): boolean {
  return Boolean(row.querySelector(GitHubCommitPageSelectors.authorSignal));
}
