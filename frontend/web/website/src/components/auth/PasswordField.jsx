import React from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordField = ({ name, value, onChange, placeholder, visible, toggle, error, hint }) => {
  return (
    <div className="mb-4">
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full border px-4 py-2 rounded pr-10 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />

        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
          aria-label="Toggle password visibility"
        >
          {visible ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
};

export default PasswordField;
