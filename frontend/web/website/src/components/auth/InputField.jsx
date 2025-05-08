import React from "react";

const InputField = ({ type = "text", name, value, onChange, placeholder, error }) => (
  <div>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full border px-4 py-2 rounded"
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export default InputField;