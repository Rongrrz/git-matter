import type { ColorMode, GithubColorModeResponse } from "../types";

export function getPreferredColorMode(): ColorMode {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export async function getActiveGithubColorMode(): Promise<ColorMode | null> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url?.includes("github.com")) return null;

  const response = (await chrome.tabs
    .sendMessage(tab.id, {
      type: "GET_GITHUB_COLOR_MODE",
    })
    .catch(() => null)) as GithubColorModeResponse | null;

  return response?.mode ?? null;
}

export function getPopupThemeClasses(mode: ColorMode) {
  if (mode === "dark") {
    return {
      shell: "w-64 bg-[#0d1117] p-4 font-sans text-sm text-[#e6edf3]",
      mutedText: "text-[#8b949e]",
      option: "flex cursor-pointer items-start gap-2 rounded p-2 hover:bg-[#161b22]",
    };
  }

  return {
    shell: "w-64 bg-white p-4 font-sans text-sm text-[#24292f]",
    mutedText: "text-[#57606a]",
    option: "flex cursor-pointer items-start gap-2 rounded p-2 hover:bg-[#f6f8fa]",
  };
}
