import { cn } from '../../../utils/cn';
import { pluralize } from '../../../utils/pluralize';
import { HiddenCommitsButton } from './HiddenCommitsButton';

const CLASS_NAME = cn(
  'my-2 rounded-md border border-dashed',
  'border-[var(--borderColor-muted)]',
  'bg-(--bgColor-muted,rgba(110,118,129,0.1))',
  'px-4 py-3 text-sm font-medium opacity-95',
);

type Props = {
  expanded: boolean;
  hiddenCommitCount: number;
  hiddenDayCount: number;
  onToggle: () => void;
};

export function HiddenCommitsStreak(props: Props) {
  const commitText = pluralize('commit', props.hiddenCommitCount);
  const dayText = pluralize('day', props.hiddenDayCount);

  return (
    <HiddenCommitsButton className={CLASS_NAME} onClick={props.onToggle}>
      {props.expanded
        ? `Hide ${props.hiddenCommitCount} ${commitText} across ${props.hiddenDayCount} ${dayText}`
        : `Show ${props.hiddenCommitCount} hidden ${commitText} across ${props.hiddenDayCount} ${dayText}`}
    </HiddenCommitsButton>
  );
}
