import { useState, useEffect } from "react";

type OptionType = {
  id: number | string;
  label: string;
};

type SelectFieldProps = {
  label: string;
  name: string;
  options: OptionType[];
  defaultValue?: number | string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function SelectField({
  label,
  name,
  options,
  defaultValue,
  onChange,
}: SelectFieldProps) {
  const [value, setValue] = useState(defaultValue ?? "");

  useEffect(() => {
    setValue(defaultValue ?? "");
  }, [defaultValue]);

  return (
    <div>
      <label className="text-sm font-medium text-blue-dark">{label}</label>

      <select
        name={name}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onChange?.(e);
        }}
        className="border border-border w-full text-sm text-blue-dark py-2 px-3 mt-1 rounded-md focus:outline-3 focus:outline-blue-soft/20 focus:border-blue-soft"
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
