import type { PopupTheme } from "../types";
import { SegmentedControl } from "../components/common/SegmentedControl";

const OPTIONS: { value: PopupTheme; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

type Props = {
  mode: PopupTheme;
  borderClassName: string;
  mutedTextClassName: string;
  selectedClassName: string;
  onChange: (mode: PopupTheme) => void;
};

export function ThemeModeToggle(props: Props) {
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
