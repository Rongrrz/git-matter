import { botAuthors } from "../constants/botAuthors";

export function getCommitAuthor(row: HTMLElement): string | null {
  const ariaAuthor = row
    .querySelector('[aria-label^="commits by "]')
    ?.getAttribute("aria-label");

  if (ariaAuthor) {
    return ariaAuthor.replace("commits by ", "").trim().toLowerCase();
  }

  const links = Array.from(row.querySelectorAll<HTMLAnchorElement>("a"));
  for (const link of links) {
    const text = link.textContent?.trim().toLowerCase();
    if (text && botAuthors.has(text)) return text;
  }

  const authorLink = row.querySelector<HTMLAnchorElement>('a[href*="author="]');
  if (authorLink) {
    try {
      const url = new URL(authorLink.href);
      return url.searchParams.get("author")?.trim().toLowerCase() || null;
    } catch {
      /* ignore */
    }
  }

  return null;
}
