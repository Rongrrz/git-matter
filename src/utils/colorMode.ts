import type { ColorMode } from "../types";

export function getBrowserColorMode(): ColorMode {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function getCurrentSiteColorMode(): ColorMode {
  const colorScheme = getComputedStyle(document.documentElement).colorScheme;
  if (colorScheme.includes("dark")) return "dark";
  if (colorScheme.includes("light")) return "light";

  const colorMode = document.documentElement.getAttribute("data-color-mode");
  if (colorMode === "dark" || colorMode === "light") return colorMode;

  return getBrowserColorMode();
}
