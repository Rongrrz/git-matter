import { botAuthors } from "../constants/botAuthors";
import { commitPageSelectors } from "./selectors";

function getCommitAuthorsHelper(row: HTMLElement): string[] {
  const result = new Set<string>();

  // Commit author information can be found in an aria-label.
  const ariaAuthor = row
    .querySelector(commitPageSelectors.commitRowAria)
    ?.getAttribute("aria-label");
  ariaAuthor && result.add(ariaAuthor.replace("commits by ", ""));

  // Commit author information can also appear in GitHub's author query param.
  const authorLink = row.querySelector<HTMLAnchorElement>('a[href*="author="]');
  const href = authorLink?.getAttribute("href");
  if (href) {
    const author = new URL(href, location.origin).searchParams.get("author");
    author && result.add(author);
  }

  // Fallback for author names that appear as visible text instead of structured data.
  const authorTextElements = row.querySelectorAll("a, span");
  Array.from(authorTextElements).forEach(
    (element) => element.textContent && result.add(element.textContent),
  );

  return Array.from(result);
}

export function getCommitAuthors(row: HTMLElement): string[] {
  return getCommitAuthorsHelper(row).map((author) =>
    author.trim().toLowerCase(),
  );
}

export function isAllBotCommitRow(row: HTMLElement): boolean {
  return getCommitAuthors(row).every((author) => botAuthors.has(author));
}
