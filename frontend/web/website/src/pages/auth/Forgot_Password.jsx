
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";
import passwordRecoveryImg from "../../assets/password_recovery.png";

const animationProps = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] },
};

export default function ForgotPasswordPage() {
  return (
    <motion.main
      {...animationProps}
      className="min-h-screen flex items-center justify-center px-6 bg-gray-400"
    >
      <div className="bg-white rounded-2xl shadow-lg shadow-black/20 p-10 max-w-xl w-full m-10">
        <img
          src={passwordRecoveryImg}
          alt="Forgot Password Illustration"
          className="w-full mb-6 rounded-xl shadow-md"
        />

        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Forgot Your Password?
        </h1>

        <p className="text-base text-center text-gray-600 mb-6">
          Enter your email so that we can send you a password reset link.
        </p>

        <ForgotPasswordForm />

        <div className="pt-5 text-center">
          <Link
            to="/login"
            className="text-base font-semibold text-gray-800 hover:underline"
          >
            Back To Login
          </Link>
        </div>
      </div>
    </motion.main>
  );
}
