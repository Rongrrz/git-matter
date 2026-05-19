import { botAuthors } from '@/shared/constants/botAuthors';

import { GitHubCommitPageSelectors } from './selectors';

const authorLabelPrefixes = ['commits by ', 'committed by ', 'authored by '];

function getAuthorFromLabel(label: string | null): string | null {
  if (!label) return null;

  const normalizedLabel = label.trim().toLowerCase();
  const prefix = authorLabelPrefixes.find((candidate) => normalizedLabel.startsWith(candidate));

  if (!prefix) return null;

  return label.slice(prefix.length).trim();
}

export function getCommitAuthors(row: HTMLElement): string[] {
  const authors = new Set<string>();

  const ariaElement = row.querySelector(GitHubCommitPageSelectors.commitAuthorAria);
  const ariaAuthor = ariaElement?.getAttribute('aria-label') ?? null;
  const authorFromAria = getAuthorFromLabel(ariaAuthor);
  if (authorFromAria) {
    authors.add(authorFromAria);
  }

  row
    .querySelectorAll<HTMLAnchorElement>(GitHubCommitPageSelectors.authorQueryLink)
    .forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;

      const author = new URL(href, location.origin).searchParams.get('author');
      if (author) authors.add(author);
    });

  row
    .querySelectorAll<HTMLAnchorElement>(GitHubCommitPageSelectors.authorHovercardLink)
    .forEach((link) => {
      const author = link.getAttribute('href')?.match(/^\/([^/?#]+)$/)?.[1];
      if (author) authors.add(author);
    });

  row
    .querySelectorAll<HTMLElement>(GitHubCommitPageSelectors.commitAuthorText)
    .forEach((element) => {
      const author = getAuthorFromLabel(element.getAttribute('aria-label')) ?? element.textContent;
      if (author) authors.add(author);
    });

  return Array.from(authors, (author) => author.trim().toLowerCase()).filter(Boolean);
}

function isAllBotAuthors(authors: string[]): boolean {
  return authors.every((author) => botAuthors.has(author));
}

export function shouldFilterCommit(authors: string[]): boolean {
  return authors.length > 0 && isAllBotAuthors(authors);
}
