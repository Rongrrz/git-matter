import "./index.css";
import { initializeCommitFiltering, setCommitDisplayMode, runCommitFiltering } from "./commits";
import { getStoredCommitDisplayMode } from "./utils/storage";
import type { DisplayModeMessage } from "./types";

getStoredCommitDisplayMode()
  .then((mode) => {
    setCommitDisplayMode(mode);
    initializeCommitFiltering();
  })
  .catch(() => {
    initializeCommitFiltering();
  });

chrome.runtime.onMessage.addListener((message: DisplayModeMessage) => {
  if (message.type === "SET_COMMIT_DISPLAY_MODE") {
    setCommitDisplayMode(message.mode);
    runCommitFiltering();
  }
});

console.log("Git Matter content script loaded");
