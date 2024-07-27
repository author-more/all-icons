import { ChangeEventHandler } from "react";

type SelectProps = {
  label: string;
  options: Options[];
  onChange: ChangeEventHandler<HTMLSelectElement>;
};

type Options = {
  label: string;
  value: string;
};

export default function Select({ label, options, onChange }: SelectProps) {
  return (
    <div className="form-group">
      <label className="select-label-hidden" htmlFor="variant-select">
        {label}
      </label>
      <select className="select" id="variant-select" onChange={onChange}>
        {options.map(({ label, value }) => (
          <option value={value}>{label}</option>
        ))}
      </select>
    </div>
  );
}
