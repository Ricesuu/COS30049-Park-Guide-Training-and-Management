
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../Firebase";
import { toast } from "react-toastify";

export default function useForgotPasswordHandler() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  const handleResetError = (error) => {
    switch (error.code) {
      case "auth/user-not-found":
        // Do not show this to user — handled via secure generic message
        break;
      case "auth/invalid-email":
        toast.error("Invalid email format.");
        break;
      case "auth/missing-email":
        toast.error("Please enter your email address.");
        break;
      default:
        toast.error("Something went wrong. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(null);

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("If an account with that email exists, a reset link has been sent.");
    } catch (err) {
      console.error(err);
      handleResetError(err);
    }
  };

  return {
    email,
    setEmail,
    error,
    handleSubmit,
  };
}
