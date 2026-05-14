import { useState, useEffect } from "react";
import {
  type CommitVisibilityMode,
  DEFAULT_COMMIT_VISIBILITY_MODE,
} from "../types";
import {
  getStoredCommitVisibilityMode,
  setStoredCommitVisibilityMode,
} from "../utils/storage";

const MODES: {
  value: CommitVisibilityMode;
  label: string;
  description: string;
}[] = [
  { value: "off", label: "Off", description: "Show every commit normally" },
  {
    value: "dim",
    label: "Dim",
    description: "Keep filtered commits visible with less emphasis",
  },
  {
    value: "hide",
    label: "Hide",
    description: "Collapse filtered commits behind reveal controls",
  },
];

export function Popup() {
  const [mode, setMode] = useState<CommitVisibilityMode>(
    DEFAULT_COMMIT_VISIBILITY_MODE,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStoredCommitVisibilityMode().then((storedMode) => {
      setMode(storedMode);
      setLoading(false);
    });
  }, []);

  async function handleModeChange(newMode: CommitVisibilityMode) {
    setMode(newMode);
    await setStoredCommitVisibilityMode(newMode);
    await sendCommitVisibilityModeToActiveTab(newMode);
  }

  if (loading) {
    return (
      <div className="p-4 text-sm text-[var(--fgColor-muted)]">Loading...</div>
    );
  }

  return (
    <div className="w-64 p-4 font-sans text-sm text-[var(--fgColor-default)]">
      <h1 className="text-lg font-semibold mb-4">Git Matter</h1>

      <fieldset>
        <legend className="text-xs font-medium text-[var(--fgColor-muted)] mb-2">
          Commit visibility
        </legend>
        <div className="flex flex-col gap-2">
          {MODES.map((option) => (
            <label
              key={option.value}
              className="flex items-start gap-2 p-2 rounded cursor-pointer hover:bg-[var(--bgColor-muted)] transition-colors"
            >
              <input
                type="radio"
                name="commitVisibilityMode"
                value={option.value}
                checked={mode === option.value}
                onChange={() => handleModeChange(option.value)}
                className="mt-1"
              />
              <div>
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-[var(--fgColor-muted)]">
                  {option.description}
                </div>
              </div>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

async function sendCommitVisibilityModeToActiveTab(
  mode: CommitVisibilityMode,
) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  if (!tab.url?.includes("github.com")) return;

  await chrome.tabs.sendMessage(tab.id, {
    type: "SET_COMMIT_VISIBILITY_MODE",
    mode,
  }).catch(() => undefined);
}
