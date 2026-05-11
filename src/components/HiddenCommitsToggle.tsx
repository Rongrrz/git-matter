import { createElement } from "react";

type Props = {
  expanded: boolean;
  hiddenCount: number;
  onToggle: () => void;
};

export function HiddenCommitsToggle(props: Props) {
  return createElement(
    "button",
    {
      className: "git-matter-toggle",

      onClick: props.onToggle,

      style: {
        display: "flex",
        alignItems: "center",

        alignSelf: "flex-start",

        margin: "0",
        padding: "8px 12px",

        width: "100%",

        fontSize: "11px",
        fontWeight: 400,
        lineHeight: "16px",

        color: "var(--fgColor-muted)",

        background: "transparent",

        border: "none",
        borderBottom: "1px solid var(--borderColor-muted)",

        cursor: "pointer",

        opacity: 0.9,

        textDecoration: "none",

        transition: "opacity 0.15s ease, text-decoration 0.15s ease",
      },

      onMouseEnter: (e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement;

        target.style.opacity = "1";
        target.style.textDecoration = "underline";
      },

      onMouseLeave: (e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement;

        target.style.opacity = "0.9";
        target.style.textDecoration = "none";
      },
    },

    props.expanded
      ? `Hide ${props.hiddenCount} commits`
      : `Show ${props.hiddenCount} hidden commits`,
  );
}
