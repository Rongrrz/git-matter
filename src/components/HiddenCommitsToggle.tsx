import { StyledButton } from "./common/StyledButton";
import { pluralize } from "../utils/pluralize";

const CLASS_NAME = [
  "git-matter-toggle",
  "text-xs",
  "font-normal",
  "leading-4",
  "opacity-90",
  "py-1",
  "px-2",
].join(" ");

type Props = {
  expanded: boolean;
  hiddenCount: number;
  hasVisibleBelow: boolean;
  onToggle: () => void;
};

export function HiddenCommitsToggle(props: Props) {
  const borderStyle = props.hasVisibleBelow || props.expanded
    ? { borderBottom: "1px solid var(--borderColor-muted)" }
    : {};

  const commitText = pluralize("commit", props.hiddenCount);

  return (
    <StyledButton className={CLASS_NAME} style={borderStyle} onClick={props.onToggle}>
      {props.expanded
        ? `Hide ${props.hiddenCount} ${commitText}`
        : `Show ${props.hiddenCount} hidden ${commitText}`}
    </StyledButton>
  );
}
