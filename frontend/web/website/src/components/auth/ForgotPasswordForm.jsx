import React from "react";
import useForgotPasswordHandle from "../../hooks/useForgotPasswordHandler";
import InputField from "./InputField";

const ForgotPasswordForm = () => {
  const { email, setEmail, handleSubmit, error, loading } = useForgotPasswordHandle(); // 🟢 include loading

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputField
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        error={error}
      />

      <div className="w-full flex justify-center">
        <button
          type="submit"
          disabled={loading}
          className={`w-full md:w-80 py-[0.9rem] px-8 rounded font-bold transition-colors duration-300 
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"} 
            text-white text-base`}
        >
          {loading ? "Sending..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
