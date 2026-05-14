import { StyledButton } from "./common/StyledButton";
import { pluralize } from "../utils/pluralize";

// TODO: Refactor CSS (background for buttons should just be transparent)
const CLASS_NAME = [
  "git-matter-streak",
  "text-sm",
  "font-medium",
  "py-3",
  "px-4",
  "bg-(--bgColor-muted,rgba(110,118,129,0.1))",
  "border",
  "border-dashed",
  "border-[var(--borderColor-muted)]",
  "rounded-md",
  "opacity-95",
  "my-2",
].join(" ");

type Props = {
  expanded: boolean;
  hiddenCommitCount: number;
  hiddenDayCount: number;
  onToggle: () => void;
};

export function HiddenCommitStreak(props: Props) {
  const commitText = pluralize("commit", props.hiddenCommitCount);
  const dayText = pluralize("day", props.hiddenDayCount);

  return (
    <StyledButton className={CLASS_NAME} onClick={props.onToggle}>
      {props.expanded
        ? `Hide ${props.hiddenCommitCount} ${commitText} across ${props.hiddenDayCount} ${dayText}`
        : `Show ${props.hiddenCommitCount} hidden ${commitText} across ${props.hiddenDayCount} ${dayText}`}
    </StyledButton>
  );
}
