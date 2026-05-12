import { StyledButton } from "./common/StyledButton";

const CLASS_NAME = [
  "git-matter-streak",
  "text-xs",
  "font-medium",
  "py-2.5",
  "px-3",
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
  return (
    <StyledButton className={CLASS_NAME} onClick={props.onToggle}>
      {props.expanded
        ? `Hide ${props.hiddenCommitCount} commits across ${props.hiddenDayCount} days`
        : `Show ${props.hiddenCommitCount} hidden commits across ${props.hiddenDayCount} days`}
    </StyledButton>
  );
}
