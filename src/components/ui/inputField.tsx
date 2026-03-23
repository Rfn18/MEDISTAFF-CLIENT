import React from "react";

type InputFieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function InputField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  defaultValue,
  onChange,
}: InputFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium text-blue-dark">{label}</label>

      <input
        type={type}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        className="border border-border w-full text-sm text-blue-dark py-2 px-3 rounded-md mt-1 focus:outline-3 focus:outline-blue-soft/20 focus:border-blue-soft"
      />
    </div>
  );
}
