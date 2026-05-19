import { SegmentedControl } from '../components/SegmentedControl';
import type { CommitVisibilityMode } from '../types';

const Options: {
  value: CommitVisibilityMode;
  label: string;
  description: string;
}[] = [
  { value: 'off', label: 'Off', description: 'Show every commit normally' },
  { value: 'dim', label: 'Dim', description: 'Dimmed filtered commits.' },
  { value: 'hide', label: 'Hide', description: 'Collapsed filtered commits.' },
];

type Props = {
  mode: CommitVisibilityMode;
  borderClassName: string;
  mutedTextClassName: string;
  selectedClassName: string;
  onChange: (mode: CommitVisibilityMode) => void;
};

export function CommitVisibilityOptions(props: Props) {
  return (
    <SegmentedControl
      label="Commit visibility"
      name="commitVisibilityMode"
      value={props.mode}
      options={Options}
      borderClassName={props.borderClassName}
      mutedTextClassName={props.mutedTextClassName}
      selectedClassName={props.selectedClassName}
      onChange={props.onChange}
    />
  );
}
