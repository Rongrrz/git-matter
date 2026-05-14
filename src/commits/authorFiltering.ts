import { botAuthors } from "../constants/botAuthors";
import { commitPageSelectors } from "./selectors";

export function getCommitAuthors(row: HTMLElement): string[] {
  const authors = new Set<string>();

  const ariaElement = row.querySelector(commitPageSelectors.commitAuthorAria);
  const ariaAuthor = ariaElement?.getAttribute("aria-label");
  if (ariaAuthor) {
    authors.add(ariaAuthor.replace("commits by ", ""));
  }

  const authorLink = row.querySelector<HTMLAnchorElement>('a[href*="author="]');
  const href = authorLink?.getAttribute("href");
  if (href) {
    const author = new URL(href, location.origin).searchParams.get("author");
    if (author) authors.add(author);
  }

  return Array.from(authors, (author) => author.trim().toLowerCase()).filter(
    Boolean,
  );
}

export function shouldFilterCommit(authors: string[]): boolean {
  return authors.length > 0 && authors.every((author) => botAuthors.has(author));
}
