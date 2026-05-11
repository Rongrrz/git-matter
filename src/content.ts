import { createElement } from "react";
import { createRoot } from "react-dom/client";

import "./content.css";

import { HiddenCommitsToggle } from "./toggle-hidden-commits";

const filteredAuthors = new Set(["dependabot[bot]", "renovate[bot]"]);

function filterCommits() {
  const commitGroups = document.querySelectorAll(
    'div[class*="CommitGroup-module__panel"]',
  );

  commitGroups.forEach((group) => {
    if (group.querySelector(".git-matter-toggle-root")) {
      return;
    }

    const commitRows = group.querySelectorAll<HTMLElement>(
      '[data-testid="commit-row-item"]',
    );

    const hiddenRows: HTMLElement[] = [];

    commitRows.forEach((row) => {
      const authorLabel = row
        .querySelector('[aria-label^="commits by "]')
        ?.getAttribute("aria-label");

      if (!authorLabel) {
        return;
      }

      const author = authorLabel.replace("commits by ", "").toLowerCase();

      if (filteredAuthors.has(author)) {
        row.style.display = "none";
        hiddenRows.push(row);
      }
    });

    if (hiddenRows.length === 0) {
      return;
    }

    let expanded = false;

    const container = document.createElement("div");

    container.className = "git-matter-toggle-root";

    const firstHiddenRow = hiddenRows[0];

    firstHiddenRow.parentElement?.insertBefore(container, firstHiddenRow);

    const root = createRoot(container);

    function render() {
      root.render(
        createElement(HiddenCommitsToggle, {
          hiddenRows,
          expanded,

          onToggle: () => {
            expanded = !expanded;

            hiddenRows.forEach((row) => {
              row.style.display = expanded ? "" : "none";
            });

            render();
          },
        }),
      );
    }

    render();
  });
}

filterCommits();

function initialize() {
  filterCommits();
}

initialize();

const observer = new MutationObserver(() => {
  filterCommits();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
