import React from "react";
import PasswordField from "../auth/PasswordField";

const ResetPasswordForm = ({
  email,
  newPassword,
  confirmPassword,
  validation,
  showNewPassword,
  showConfirmPassword,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onToggleNewPassword,
  onToggleConfirmPassword,
  onSubmit,
}) => {
  return (
    <>
      <h2 className="text-xl font-semibold text-center mb-4">Reset Your Password</h2>

      <p className="text-sm text-center text-gray-500 mb-6">
        For: <span className="font-medium">{email}</span>
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <PasswordField
          name="newPassword"
          placeholder="Enter new password"
          value={newPassword}
          onChange={onNewPasswordChange}
          visible={showNewPassword}
          toggle={onToggleNewPassword}
        />

        <PasswordField
          name="confirmPassword"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
          visible={showConfirmPassword}
          toggle={onToggleConfirmPassword}
        />

        {/* Password validation checklist */}
        <ul className="text-sm text-gray-600 space-y-1 mt-2 ml-1">
          <li className={validation.length ? "text-green-600" : ""}>
            • At least 8 characters
          </li>
          <li className={validation.letter ? "text-green-600" : ""}>
            • Contains letters (A-Z, a-z)
          </li>
          <li className={validation.number ? "text-green-600" : ""}>
            • Contains numbers (0-9)
          </li>
          <li className={validation.symbol ? "text-green-600" : ""}>
            • Contains symbols (@, #, $, etc.)
          </li>
        </ul>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Reset Password
        </button>
      </form>
    </>
  );
};

export default ResetPasswordForm;
