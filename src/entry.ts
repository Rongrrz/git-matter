import "./index.css";
import { initializeCommitFiltering, runCommitFiltering, setCommitVisibilityMode } from "./commits";
import { getStoredCommitVisibilityMode } from "./storage";
import type { ExtensionMessage } from "./types";

async function initialize(): Promise<void> {
  const mode = await getStoredCommitVisibilityMode();
  setCommitVisibilityMode(mode);
  initializeCommitFiltering();
}
initialize();

chrome.runtime.onMessage.addListener((message: ExtensionMessage) => {
  if (message.type === "SET_COMMIT_VISIBILITY_MODE") {
    setCommitVisibilityMode(message.mode);
    runCommitFiltering();
  }
});

// eslint-disable-next-line no-console
console.log("Git Matter content script loaded");
