import { StyledButton } from "./common/StyledButton";

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
  onToggle: () => void;
};

export function HiddenCommitsToggle(props: Props) {
  const expandedClassName = props.expanded
    ? "border-b border-[var(--borderColor-muted)]"
    : "";

  return (
    <StyledButton
      className={`${CLASS_NAME} ${expandedClassName}`}
      onClick={props.onToggle}
    >
      {props.expanded
        ? `Hide ${props.hiddenCount} commits`
        : `Show ${props.hiddenCount} hidden commits`}
    </StyledButton>
  );
}
