import "./index.css";
import { initializeCommitFiltering, runCommitFiltering, setCommitVisibilityMode } from "./commits";
import { getStoredCommitVisibility } from "./storage";
import type { ExtensionMessage } from "./types";

chrome.runtime.onMessage.addListener((message: ExtensionMessage) => {
  if (message.type === "SET_COMMIT_VISIBILITY_MODE") {
    setCommitVisibilityMode(message.mode);
    runCommitFiltering();
  }
});

async function initialize(): Promise<void> {
  const mode = await getStoredCommitVisibility();
  setCommitVisibilityMode(mode);
  initializeCommitFiltering();

  // TODO: remove on release
  console.log("Git Matter content script loaded");
}
initialize();
