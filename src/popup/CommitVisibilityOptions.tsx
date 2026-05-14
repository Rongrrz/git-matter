import type { CommitVisibilityMode } from "../types";

const MODES: {
  value: CommitVisibilityMode;
  label: string;
  description: string;
}[] = [
  { value: "off", label: "Off", description: "Show every commit normally" },
  {
    value: "dim",
    label: "Dim",
    description: "Keep filtered commits visible with less emphasis",
  },
  {
    value: "hide",
    label: "Hide",
    description: "Collapse filtered commits behind reveal controls",
  },
];

type Props = {
  mode: CommitVisibilityMode;
  mutedTextClassName: string;
  optionClassName: string;
  onChange: (mode: CommitVisibilityMode) => void;
};

export function CommitVisibilityOptions(props: Props) {
  return (
    <fieldset>
      <legend className={`mb-2 text-xs font-medium ${props.mutedTextClassName}`}>
        Commit visibility
      </legend>
      <div className="flex flex-col gap-2">
        {MODES.map((option) => (
          <label key={option.value} className={props.optionClassName}>
            <input
              type="radio"
              name="commitVisibilityMode"
              value={option.value}
              checked={props.mode === option.value}
              onChange={() => props.onChange(option.value)}
              className="mt-1"
            />
            <div>
              <div className="font-medium">{option.label}</div>
              <div className={`text-xs ${props.mutedTextClassName}`}>{option.description}</div>
            </div>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
