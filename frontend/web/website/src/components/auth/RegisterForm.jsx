import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

import InputField from "./InputField";
import PasswordField from "./PasswordField";
import { useRegisterHandler } from "../../hooks/useRegisterHandler";

export default function RegisterForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [captchaToken, setCaptchaToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef(null);

  const { validateForm, registerUser } = useRegisterHandler();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const validationErrors = validateForm(form, captchaToken);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    await registerUser(form, captchaToken, recaptchaRef, () => {
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setCaptchaToken(null);
    });
    setLoading(false);
  };

  return (
    <form className="space-y-4" onSubmit={handleRegister}>
      <h1 className="text-3xl font-bold text-center">Create An Account</h1>
      <p className="text-center text-sm text-gray-600">
        This registration form is for <strong>Park Guides</strong> only.
      </p>

        <InputField
        name="firstName"
        placeholder="First Name"
        value={form.firstName}
        onChange={handleChange}
        error={errors.firstName}
        />

        <InputField
        name="lastName"
        placeholder="Last Name"
        value={form.lastName}
        onChange={handleChange}
        error={errors.lastName}
        />

        <InputField
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        />

        <PasswordField
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        visible={showPassword}
        toggle={() => setShowPassword(!showPassword)}
        error={errors.password}
        hint="Use 8 or more characters with a mix of letters, numbers & symbols"
        />

        <PasswordField
        name="confirmPassword"
        placeholder="Confirm Password"
        value={form.confirmPassword}
        onChange={handleChange}
        visible={showConfirmPassword}
        toggle={() => setShowConfirmPassword(!showConfirmPassword)}
        error={errors.confirmPassword}
        />

      <div className="w-full flex justify-center">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey="6Le2oyorAAAAALJWeK7PF4Uu6EEyRAT7GhY2SgFx"
          onChange={(token) => setCaptchaToken(token)}
        />
      </div>
      {errors.captcha && <p className="text-xs text-red-500 mt-1">{errors.captcha}</p>}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 text-white font-bold rounded ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>

      <p className="text-center text-sm mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-green-700 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
