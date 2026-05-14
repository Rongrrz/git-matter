import "./index.css";
import {
  initializeCommitFiltering,
  runCommitFiltering,
  setCommitVisibilityMode,
} from "./commits";
import { getStoredCommitVisibilityMode } from "./utils/storage";
import type { CommitVisibilityMessage } from "./types";

getStoredCommitVisibilityMode()
  .then((mode) => {
    setCommitVisibilityMode(mode);
    initializeCommitFiltering();
  })
  .catch(() => {
    initializeCommitFiltering();
  });

chrome.runtime.onMessage.addListener((message: CommitVisibilityMessage) => {
  if (message.type === "SET_COMMIT_VISIBILITY_MODE") {
    setCommitVisibilityMode(message.mode);
    runCommitFiltering();
  }
});

// eslint-disable-next-line no-console
console.log("Git Matter content script loaded");
