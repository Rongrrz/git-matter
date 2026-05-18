import { GitHubCommitPageSelectors } from './selectors';

function findCommitRows(root: ParentNode = document): HTMLElement[] {
  const rows = [
    ...root.querySelectorAll<HTMLElement>(GitHubCommitPageSelectors.commitRow),
    ...findCommitRowsFromLinks(root),
  ];

  return uniqueElements(rows).filter(isLikelyCommitRow);
}

export function findCommitRowsWithinNode(node: HTMLElement): HTMLElement[] {
  const rows: HTMLElement[] = [];

  if (isLikelyCommitRow(node)) {
    rows.push(node);
  }

  rows.push(...findCommitRows(node));

  return uniqueElements(rows);
}

export function findCommitGroupPanels(root: ParentNode = document): HTMLElement[] {
  const panels = Array.from(
    root.querySelectorAll<HTMLElement>(GitHubCommitPageSelectors.commitGroupPanel),
  );
  if (panels.length > 0) return panels;

  return uniqueElements(
    findCommitRows(root)
      .map(findCommitGroupPanelForRow)
      .filter((panel): panel is HTMLElement => Boolean(panel)),
  );
}

function findCommitGroupPanelForRow(row: HTMLElement): HTMLElement | null {
  return (
    row.closest<HTMLElement>(GitHubCommitPageSelectors.commitGroupPanel) ??
    row.closest<HTMLElement>('ol, ul, section, article') ??
    row.parentElement
  );
}

export function findTimelineRowForPanel(panel: HTMLElement): HTMLElement | null {
  return (
    panel.closest<HTMLElement>(GitHubCommitPageSelectors.timelineRow) ??
    panel.closest<HTMLElement>('li, section, article') ??
    panel
  );
}

function findTimelineRows(root: ParentNode = document): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(GitHubCommitPageSelectors.timelineRow));
}

function containsCommitPageDom(node: HTMLElement): boolean {
  return (
    isLikelyCommitRow(node) ||
    Boolean(
      node.querySelector(
        [
          GitHubCommitPageSelectors.commitRow,
          GitHubCommitPageSelectors.commitLink,
          GitHubCommitPageSelectors.commitGroupPanel,
          GitHubCommitPageSelectors.timelineRow,
        ].join(', '),
      ),
    )
  );
}

function isCommitPageDomNode(node: HTMLElement): boolean {
  return (
    isLikelyCommitRow(node) ||
    node.matches(GitHubCommitPageSelectors.commitGroupPanel) ||
    node.matches(GitHubCommitPageSelectors.timelineRow) ||
    containsCommitPageDom(node)
  );
}

function isLikelyCommitRow(row: HTMLElement): boolean {
  return (
    row.matches(GitHubCommitPageSelectors.commitRow) ||
    (Boolean(row.querySelector(GitHubCommitPageSelectors.commitLink)) && hasAuthorSignal(row))
  );
}

function findCommitRowsFromLinks(root: ParentNode): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLAnchorElement>(GitHubCommitPageSelectors.commitLink))
    .map(findNearestCommitRow)
    .filter((row): row is HTMLElement => Boolean(row));
}

function findNearestCommitRow(link: HTMLAnchorElement): HTMLElement | null {
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
  return Boolean(
    row.querySelector(
      [
        GitHubCommitPageSelectors.authorQueryLink,
        GitHubCommitPageSelectors.authorHovercardLink,
        GitHubCommitPageSelectors.commitAuthorAria,
        GitHubCommitPageSelectors.commitAuthorText,
      ].join(', '),
    ),
  );
}

function uniqueElements<TElement extends HTMLElement>(elements: TElement[]): TElement[] {
  return Array.from(new Set(elements));
}

export const CommitRows = {
  find: findCommitRows,
  findGroupPanel: findCommitGroupPanelForRow,
  isLikely: isLikelyCommitRow,
} as const;

export const CommitPageDom = {
  containsDom: containsCommitPageDom,
  findTimelineRows,
  isDomNode: isCommitPageDomNode,
} as const;
