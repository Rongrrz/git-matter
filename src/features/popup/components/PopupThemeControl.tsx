import { SegmentedControl } from '@/features/popup/components/SegmentedControl';
import { PopupThemeMap, type PopupTheme } from '@/shared/types/userPreferenceOptions';

const OPTIONS: { value: PopupTheme; label: string }[] = [
  { value: PopupThemeMap.Auto, label: 'Auto' },
  { value: PopupThemeMap.Light, label: 'Light' },
  { value: PopupThemeMap.Dark, label: 'Dark' },
];

type Props = {
  mode: PopupTheme;
  borderClassName: string;
  mutedTextClassName: string;
  selectedClassName: string;
  onChange: (mode: PopupTheme) => void;
};

// TODO: Is this fieldset wrapper really necessary?
export function PopupThemeControl(props: Props) {
  return (
    <fieldset className={`mt-4 border-t pt-4 ${props.borderClassName}`}>
      <SegmentedControl
        label="Theme"
        name="popupThemeMode"
        value={props.mode}
        options={OPTIONS}
        borderClassName={props.borderClassName}
        mutedTextClassName={props.mutedTextClassName}
        selectedClassName={props.selectedClassName}
        onChange={props.onChange}
      />
    </fieldset>
  );
}
