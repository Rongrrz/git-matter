type Option<TValue extends string> = {
  value: TValue;
  label: string;
  description?: string;
};

type Props<TValue extends string> = {
  label: string;
  name: string;
  value: TValue;
  options: Option<TValue>[];
  borderClassName: string;
  mutedTextClassName: string;
  selectedClassName: string;
  onChange: (value: TValue) => void;
};

export function SegmentedControl<TValue extends string>(props: Props<TValue>) {
  const selectedOption = props.options.find((option) => option.value === props.value);

  return (
    <fieldset>
      <legend className={`mb-2 text-xs font-medium ${props.mutedTextClassName}`}>
        {props.label}
      </legend>
      <div className={`grid grid-cols-3 rounded border p-0.5 ${props.borderClassName}`}>
        {props.options.map((option) => (
          <label
            key={option.value}
            className={`cursor-pointer rounded px-2 py-1 text-center text-xs ${
              props.value === option.value ? props.selectedClassName : ""
            }`}
          >
            <input
              type="radio"
              name={props.name}
              value={option.value}
              checked={props.value === option.value}
              onChange={() => props.onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
      {selectedOption?.description ? (
        <div className={`mt-2 text-xs ${props.mutedTextClassName}`}>
          {selectedOption.description}
        </div>
      ) : null}
    </fieldset>
  );
}
