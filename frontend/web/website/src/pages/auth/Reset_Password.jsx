import React, { useState } from "react";
import useResetPasswordHandler from "../../hooks/useResetPasswordHandler";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";

const ResetPasswordPage = () => {
  const {
    email,
    newPassword,
    confirmPassword,
    validation,
    loading,
    validCode,
    setConfirmPassword,
    handlePasswordChange,
    handleSubmit,
  } = useResetPasswordHandler();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-400 px-4">
      <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md">
        {loading ? (
          <p className="text-center text-gray-600">Validating reset link...</p>
        ) : validCode ? (
          <ResetPasswordForm
            email={email}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            validation={validation}
            showNewPassword={showNewPassword}
            showConfirmPassword={showConfirmPassword}
            onNewPasswordChange={handlePasswordChange}
            onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
            onToggleNewPassword={() => setShowNewPassword((prev) => !prev)}
            onToggleConfirmPassword={() => setShowConfirmPassword((prev) => !prev)}
            onSubmit={handleSubmit}
          />
        ) : (
          <p className="text-center text-red-600">
            This reset link is invalid or has expired.
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
