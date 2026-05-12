import { StyledButton } from "./common/StyledButton";

const CLASS_NAME = [
  "git-matter-toggle",
  "text-xs",
  "font-normal",
  "leading-4",
  "border-b",
  "border-[var(--borderColor-muted)]",
  "opacity-90",
  "py-2",
  "px-3",
].join(" ");

type Props = {
  expanded: boolean;
  hiddenCount: number;
  onToggle: () => void;
};

export function HiddenCommitsToggle(props: Props) {
  return (
    <StyledButton className={CLASS_NAME} onClick={props.onToggle}>
      {props.expanded
        ? `Hide ${props.hiddenCount} commits`
        : `Show ${props.hiddenCount} hidden commits`}
    </StyledButton>
  );
}
