import { pluralize } from "../utils/pluralize";
import { HiddenCommitsButton } from "./common/HiddenCommitsButton";

const CLASS_NAME = [
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

export function HiddenCommitsStreak(props: Props) {
  const commitText = pluralize("commit", props.hiddenCommitCount);
  const dayText = pluralize("day", props.hiddenDayCount);

  return (
    <HiddenCommitsButton className={CLASS_NAME} onClick={props.onToggle}>
      {props.expanded
        ? `Hide ${props.hiddenCommitCount} ${commitText} across ${props.hiddenDayCount} ${dayText}`
        : `Show ${props.hiddenCommitCount} hidden ${commitText} across ${props.hiddenDayCount} ${dayText}`}
    </HiddenCommitsButton>
  );
}
