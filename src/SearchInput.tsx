import "./SearchInput.css";

type SearchInputProps = {
  label: string;
  placeholder: string;
  onChange: (phrase: string) => void;
};

export default function SearchInput({
  label,
  placeholder,
  onChange,
}: SearchInputProps) {
  return (
    <div className="form-search form-group">
      <label className="input-label-hidden" htmlFor="input-search">
        {label}
      </label>
      <input
        className="input"
        type="text"
        placeholder={placeholder}
        id="input-search"
        onChange={({ target: { value } }) => onChange(value)}
      />
    </div>
  );
}
