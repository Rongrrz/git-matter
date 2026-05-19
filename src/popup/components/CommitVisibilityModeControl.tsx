import { SegmentedControl } from '../../components/SegmentedControl';
import { CommitVisibilityModeMap, type CommitVisibilityMode } from '../../types';

const OPTIONS: {
  value: CommitVisibilityMode;
  label: string;
  description: string;
}[] = [
  { value: CommitVisibilityModeMap.Off, label: 'Off', description: 'Show every commit normally' },
  { value: CommitVisibilityModeMap.Dim, label: 'Dim', description: 'Dimmed filtered commits.' },
  { value: CommitVisibilityModeMap.Hide, label: 'Hide', description: 'Collapse filtered commits.' },
];

type Props = {
  mode: CommitVisibilityMode;
  borderClassName: string;
  mutedTextClassName: string;
  selectedClassName: string;
  onChange: (mode: CommitVisibilityMode) => void;
};

export function CommitVisibilityModeControl(props: Props) {
  return (
    <SegmentedControl
      label="Commit visibility"
      name="commitVisibilityMode"
      value={props.mode}
      options={OPTIONS}
      borderClassName={props.borderClassName}
      mutedTextClassName={props.mutedTextClassName}
      selectedClassName={props.selectedClassName}
      onChange={props.onChange}
    />
  );
}
