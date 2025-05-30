import { useEffect, useRef, useState } from "react";
import {
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";
import { auth } from "../Firebase";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function useResetPasswordHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const oobCode = searchParams.get("oobCode");
  const mode = searchParams.get("mode");

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validation, setValidation] = useState({
    length: false,
    letter: false,
    number: false,
    symbol: false,
  });
  const [loading, setLoading] = useState(true);
  const [validCode, setValidCode] = useState(false);
  const hasShownError = useRef(false);

  useEffect(() => {
    if (mode === "resetPassword" && oobCode) {
      verifyPasswordResetCode(auth, oobCode)
        .then((email) => {
          setEmail(email);
          setValidCode(true);
        })
        .catch(() => {
          if (!hasShownError.current) {
            toast.error("Invalid or expired reset link.");
            hasShownError.current = true;
          }
        })
        .finally(() => setLoading(false));
    } else {
      if (!hasShownError.current) {
        toast.error("Missing or invalid reset link.");
        hasShownError.current = true;
      }
      setLoading(false);
    }
  }, [mode, oobCode]);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setValidation({
      length: value.length >= 8,
      letter: /[A-Za-z]/.test(value),
      number: /[0-9]/.test(value),
      symbol: /[@$!%*#?&^_-]/.test(value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isStrongPassword = Object.values(validation).every(Boolean);
    if (!isStrongPassword) {
      return toast.warning(
        "Password must be at least 8 characters and include letters, numbers, and symbols."
      );
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      toast.success("Password reset successfully. You can now log in.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Failed to reset password.");
    }
  };

  return {
    email,
    newPassword,
    confirmPassword,
    validation,
    loading,
    validCode,
    setConfirmPassword,
    handlePasswordChange,
    handleSubmit,
  };
}
