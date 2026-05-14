import type { ReactNode } from "react";

const BASE_CLASS_NAME = [
  "block",
  "w-full",
  "text-left",
  "text-(--fgColor-muted)",
  "cursor-pointer",
  "hover:underline",
  "hover:opacity-100",
].join(" ");

type Props = {
  className: string;
  style?: React.CSSProperties;
  onClick: () => void;
  children: ReactNode;
};

export function HiddenCommitsButton(props: Props) {
  return (
    <button
      data-git-matter-component
      className={`${BASE_CLASS_NAME} ${props.className}`}
      style={props.style}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
