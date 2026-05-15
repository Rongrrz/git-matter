import { pluralize } from "../utils/pluralize";
import { HiddenCommitsButton } from "./common/HiddenCommitsButton";

const CLASS_NAME = ["text-xs", "font-normal", "leading-4", "opacity-90", "py-1", "px-2"].join(" ");

type Props = {
  expanded: boolean;
  hiddenCommitCount: number;
  hasVisibleBelow: boolean;
  onToggle: () => void;
};

export function HiddenCommitsToggle(props: Props) {
  const commitText = pluralize("commit", props.hiddenCommitCount);

  return (
    <HiddenCommitsButton
      className={CLASS_NAME}
      style={
        props.hasVisibleBelow || props.expanded
          ? { borderBottom: "1px solid var(--borderColor-muted)" }
          : undefined
      }
      onClick={props.onToggle}
    >
      {props.expanded
        ? `Hide ${props.hiddenCommitCount} ${commitText}`
        : `Show ${props.hiddenCommitCount} hidden ${commitText}`}
    </HiddenCommitsButton>
  );
}
