import type { PopupThemeMode } from "../types";

const OPTIONS: { value: PopupThemeMode; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

type Props = {
  mode: PopupThemeMode;
  borderClassName: string;
  mutedTextClassName: string;
  selectedClassName: string;
  onChange: (mode: PopupThemeMode) => void;
};

export function ThemeModeToggle(props: Props) {
  return (
    <fieldset className={`mt-4 border-t pt-4 ${props.borderClassName}`}>
      <legend className={`mb-2 text-xs font-medium ${props.mutedTextClassName}`}>
        Theme
      </legend>
      <div className={`grid grid-cols-3 rounded border p-0.5 ${props.borderClassName}`}>
        {OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`cursor-pointer rounded px-2 py-1 text-center text-xs ${
              props.mode === option.value ? props.selectedClassName : ""
            }`}
          >
            <input
              type="radio"
              name="popupThemeMode"
              value={option.value}
              checked={props.mode === option.value}
              onChange={() => props.onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
