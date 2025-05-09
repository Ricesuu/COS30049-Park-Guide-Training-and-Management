import React, { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "./InputField";
import PasswordField from "./PasswordField";
import { useLoginHandler } from "../../hooks/useLoginHandler";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // 🔁 New loading state

  const { handleLogin } = useLoginHandler();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await handleLogin(email, passwordValue);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 px-6 md:px-0 md:mt-15">
      <div className="mb-1">
        <h2 className="text-green-900 text-2xl font-medium mb-1">Welcome back!</h2>
        <h1 className="text-5xl font-bold mb-2 pt-4 pb-4 md:mb-1">Login</h1>
      </div>

      <InputField
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      <PasswordField
        name="password"
        value={passwordValue}
        onChange={(e) => setPasswordValue(e.target.value)}
        placeholder="Password"
        visible={showPassword}
        toggle={() => setShowPassword(!showPassword)}
      />

      <div className="flex items-center justify-between text-sm">
        <Link to="/forgot_password" className="font-semibold text-gray-600 hover:underline">
          Forgot Password?
        </Link>
      </div>

      <button
        type="submit"
        className={`w-full py-[0.9rem] px-8 rounded font-bold transition-colors duration-300 
          ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"} 
          text-white text-base`}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p className="text-sm mt-6 pt-5 text-center">
        Don’t have an account?{" "}
        <Link to="/register" className="font-semibold text-green-700 hover:underline">
          Get Started
        </Link>
      </p>
    </form>
  );
}
