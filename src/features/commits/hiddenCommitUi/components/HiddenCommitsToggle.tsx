import { cn } from '@/shared/utils/cn';
import { pluralize } from '@/shared/utils/pluralize';

import { HiddenCommitsButton } from './HiddenCommitsButton';

const CLASS_NAME = cn('px-2 py-1 text-xs leading-4 font-normal opacity-90');

type Props = {
  expanded: boolean;
  hiddenCommitCount: number;
  hasVisibleBelow: boolean;
  onToggle: () => void;
};

export function HiddenCommitsToggle(props: Props) {
  const commitText = pluralize('commit', props.hiddenCommitCount);

  return (
    <HiddenCommitsButton
      className={CLASS_NAME}
      style={
        props.hasVisibleBelow || props.expanded
          ? { borderBottom: '1px solid var(--borderColor-muted)' }
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
