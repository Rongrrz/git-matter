import { GIT_MATTER_CLASSES } from "./selectors";

const DIMMED_CLASS = GIT_MATTER_CLASSES.dimmed;

function animateRow(
  row: HTMLElement,
  from: Keyframe,
  to: Keyframe,
  options: KeyframeAnimationOptions,
  onFinish?: () => void,
) {
  const animation = row.animate([from, to], options);

  if (onFinish) {
    animation.onfinish = onFinish;
  }

  return animation;
}

export function revealRow(row: HTMLElement) {
  row.style.display = "";

  animateRow(
    row,
    { opacity: 0, transform: "translateY(-6px)" },
    { opacity: 1, transform: "translateY(0)" },
    { duration: 180, easing: "ease-out" },
  );
}

export function hideRow(row: HTMLElement) {
  animateRow(
    row,
    { opacity: 1, transform: "translateY(0)" },
    { opacity: 0, transform: "translateY(-6px)" },
    { duration: 140, easing: "ease-in" },
    () => {
      row.style.display = "none";
    },
  );
}

export function hideRowImmediately(row: HTMLElement) {
  row.style.display = "none";
}

export function resetCommitRow(row: HTMLElement) {
  row.style.display = "";
  row.classList.remove(DIMMED_CLASS);
}

export function dimCommitRow(row: HTMLElement) {
  row.classList.add(DIMMED_CLASS);
}

export function hideCommitRow(row: HTMLElement) {
  hideRowImmediately(row);
}
