const BaseBotAuthorNames = ['dependabot[bot]', 'renovate[bot]', 'github-actions[bot]'];

// We create a Set for efficient lookups such as when checking if an author is a bot.
// For GitHub names, case-sensitivity does not matter.
export const botAuthors: ReadonlySet<string> = new Set(
  BaseBotAuthorNames.map((name) => name.trim().toLowerCase()),
);
