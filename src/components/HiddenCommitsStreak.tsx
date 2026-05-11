import { createElement } from "react";

type Props = {
  expanded: boolean;
  hiddenCommitCount: number;
  hiddenDayCount: number;
  onToggle: () => void;
};

export function HiddenCommitStreak(props: Props) {
  return createElement(
    "button",
    {
      className: "git-matter-streak",

      onClick: props.onToggle,

      style: {
        display: "flex",
        alignItems: "center",

        width: "100%",

        margin: "8px 0",
        padding: "10px 12px",

        fontSize: "12px",
        fontWeight: 500,

        color: "var(--fgColor-muted)",

        background:
          "var(--bgColor-muted, rgba(110,118,129,0.1))",

        border:
          "1px dashed var(--borderColor-muted)",

        borderRadius: "6px",

        cursor: "pointer",

        opacity: 0.95,

        transition:
          "opacity 0.15s ease, text-decoration 0.15s ease",
      },

      onMouseEnter: (e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement;

        target.style.textDecoration = "underline";
        target.style.opacity = "1";
      },

      onMouseLeave: (e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement;

        target.style.textDecoration = "none";
        target.style.opacity = "0.95";
      },
    },

    props.expanded
      ? `Hide ${props.hiddenCommitCount} commits across ${props.hiddenDayCount} days`
      : `Show ${props.hiddenCommitCount} hidden commits across ${props.hiddenDayCount} days`,
  );
}
