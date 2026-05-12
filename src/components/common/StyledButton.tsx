import { type ReactNode } from "react";
import { mergeClassNames } from "../../utils/mergeClassNames";

type Props = {
  className?: string;
  onClick: () => void;
  children: ReactNode;
};

export function StyledButton(props: Props) {
  return (
    <button
      className={mergeClassNames(
        "flex w-full items-center",
        "text-(--fgColor-muted)",
        "cursor-pointer",
        "transition-[opacity,text-decoration] duration-150 ease-in-out",
        "hover:underline hover:opacity-100",
        props.className, // Putting props.className last allows overrides
      )}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
