import "./index.css";
import {
  initializeCommitFiltering,
  runCommitFiltering,
  setCommitVisibilityMode,
} from "./commits";
import { getStoredCommitVisibilityMode } from "./utils/storage";
import type {
  ColorMode,
  ExtensionMessage,
  GithubColorModeResponse,
} from "./types";

getStoredCommitVisibilityMode()
  .then((mode) => {
    setCommitVisibilityMode(mode);
    initializeCommitFiltering();
  })
  .catch(() => {
    initializeCommitFiltering();
  });

chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, _sender, sendResponse) => {
    if (message.type === "SET_COMMIT_VISIBILITY_MODE") {
      setCommitVisibilityMode(message.mode);
      runCommitFiltering();
    }

    if (message.type === "GET_GITHUB_COLOR_MODE") {
      sendResponse({
        mode: getGithubColorMode(),
      } satisfies GithubColorModeResponse);
    }
  },
);

function getGithubColorMode(): ColorMode | null {
  const colorScheme = getComputedStyle(document.documentElement).colorScheme;
  if (colorScheme.includes("dark")) return "dark";
  if (colorScheme.includes("light")) return "light";

  const colorMode = document.documentElement.getAttribute("data-color-mode");
  if (colorMode === "dark" || colorMode === "light") return colorMode;

  return null;
}

// eslint-disable-next-line no-console
console.log("Git Matter content script loaded");
