import "./content.css";

const filteredAuthors = new Set<string>(["dependabot[bot]", "renovate[bot]"]);

function filterCommits(): void {
  const commitElements = document.querySelectorAll(
    '[data-testid="commit-row-item"]',
  );

  commitElements.forEach((element) => {
    const authorElement = element.querySelector('[aria-label^="commits by "]');
    const authorLabel = authorElement?.getAttribute("aria-label");
    if (!authorLabel) return;

    const author = authorLabel.replace("commits by ", "").toLowerCase();

    if (filteredAuthors.has(author)) {
      element.classList.add("git-matter-hidden");
    }
  });
}

filterCommits();
