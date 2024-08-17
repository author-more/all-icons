import { ChangeEventHandler } from "react";
import "./Select.css";

type SelectProps = {
  label: string;
  options: Options[];
  value: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
};

type Options = {
  label: string;
  value: string;
};

export default function Select({
  label,
  options,
  value: selectedValue,
  onChange,
}: SelectProps) {
  return (
    <div className="form-group">
      <label className="select-label-hidden" htmlFor="variant-select">
        {label}
      </label>
      <select
        className="select dropdown-icon-fix spacing-fix"
        id="variant-select"
        onChange={onChange}
      >
        {options.map(({ label, value }) => {
          const isSelected = value === selectedValue;

          return (
            <option key={value} value={value} selected={isSelected}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
