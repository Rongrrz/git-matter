// We create a Set for efficient lookups such as when checking if an author is a bot.
export const botAuthors: ReadonlySet<string> = new Set([
  "dependabot[bot]",
  "renovate[bot]",
  "github-actions[bot]",
]);
