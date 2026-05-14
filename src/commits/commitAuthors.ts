import { botAuthors } from "../constants/botAuthors";
import { commitPageSelectors } from "./selectors";

function extractAuthorsFromRow(row: HTMLElement): string[] {
  const result = new Set<string>();

  // Commit author information can be found in an aria-label.
  const ariaElement = row.querySelector(commitPageSelectors.commitAuthorAria);
  const ariaAuthor = ariaElement?.getAttribute("aria-label");
  if (ariaAuthor) {
    result.add(ariaAuthor.replace("commits by ", ""));
  }

  // Commit author information can also appear in GitHub's author query param.
  const authorLink = row.querySelector<HTMLAnchorElement>('a[href*="author="]');
  const href = authorLink?.getAttribute("href");
  if (href) {
    const author = new URL(href, location.origin).searchParams.get("author");
    if (author) {
      result.add(author);
    }
  }

  // Fallback for external contributors or co-authored commits.
  // Look for any elements that might contain author info.
  const allElements = row.querySelectorAll("*");
  for (const el of allElements) {
    const hovercard = el.getAttribute("data-hovercard-type");
    const text = el.textContent?.trim();
    const className = typeof el.className === "string" ? el.className : "";

    // Look for user hovercards or author-related classes
    if (hovercard === "user" || className.includes("Avatar") || className.includes("author")) {
      if (text && text.length > 0 && text.length < 50 && !text.includes("\n")) {
        result.add(text);
      }
    }
  }

  return Array.from(result);
}

export function getCommitAuthors(row: HTMLElement): string[] {
  return extractAuthorsFromRow(row).map((author) =>
    author.trim().toLowerCase(),
  );
}

export function isBotOnlyCommitRow(row: HTMLElement): boolean {
  const authors = getCommitAuthors(row);
  return authors.length > 0 && authors.every((author) => botAuthors.has(author));
}
