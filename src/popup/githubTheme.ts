import type { ColorMode, PopupThemeMode } from "../types";
import { getBrowserColorMode } from "../utils/colorMode";

export function resolvePopupColorMode(mode: PopupThemeMode): ColorMode {
  return mode === "auto" ? getBrowserColorMode() : mode;
}

export function getPopupThemeClasses(mode: ColorMode) {
  if (mode === "dark") {
    return {
      shell: "w-64 bg-[#0d1117] p-4 font-sans text-sm text-[#e6edf3]",
      mutedText: "text-[#8b949e]",
      option: "flex cursor-pointer items-start gap-2 rounded p-2 hover:bg-[#161b22]",
      border: "border-[#30363d]",
      selected: "bg-[#21262d] text-[#e6edf3]",
    };
  }

  return {
    shell: "w-64 bg-white p-4 font-sans text-sm text-[#24292f]",
    mutedText: "text-[#57606a]",
    option: "flex cursor-pointer items-start gap-2 rounded p-2 hover:bg-[#f6f8fa]",
    border: "border-[#d0d7de]",
    selected: "bg-[#f6f8fa] text-[#24292f]",
  };
}
