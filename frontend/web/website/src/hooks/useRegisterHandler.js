import { createUserWithEmailAndPassword, deleteUser, signOut } from "firebase/auth";
import { auth } from "../Firebase";
import { toast } from "react-toastify";

// Regular expressions for validation
const EMAIL_REGEX = /\S+@\S+\.\S+/;
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/~`\\|-]).{8,}$/;

export const useRegisterHandler = () => {
  /**
   * Validates the registration form inputs and returns an object of errors.
   */
  const validateForm = (form, captchaToken) => {
    const errors = {};

    if (!form.firstName.trim()) errors.firstName = "First name is required";
    if (!form.lastName.trim()) errors.lastName = "Last name is required";
    if (!EMAIL_REGEX.test(form.email)) errors.email = "Valid email required";
    if (!PASSWORD_REGEX.test(form.password)) {
      errors.password = "Password must be at least 8 characters with letters, numbers & symbols";
    }
    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!captchaToken) errors.captcha = "Please verify you're not a robot";

    return errors;
  };

  /**
   * Registers a new user in Firebase and your backend.
   */
  const registerUser = async (form, captchaToken, recaptchaRef, resetForm) => {
    let firebaseUser = null;

    try {
      // 1. Create Firebase Auth account
      const { user } = await createUserWithEmailAndPassword(auth, form.email, form.password);
      firebaseUser = user;

      // 2. Store user data in backend
      const response = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: form.email,
          firstName: form.firstName,
          lastName: form.lastName,
          role: "park_guide",
          approved: false,
          token: captchaToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save user in database");
      }

      // 3. Sign out after successful registration
      await signOut(auth);
      toast.success("Account successfully created! Please wait for admin approval before logging in.");

      // 4. Reset form and recaptcha
      resetForm();
      recaptchaRef.current?.reset();
    } catch (err) {
      console.error("Registration error:", err);
      const emailConflict = err.code === "auth/email-already-in-use" || err.message.includes("Duplicate entry");
      toast.error(emailConflict ? "This email is already registered. Please log in instead." : "Registration failed. Please try again.");

      // Cleanup: delete Firebase user if backend failed
      if (firebaseUser) {
        try {
          await deleteUser(firebaseUser);
        } catch (deleteErr) {
          console.error("Failed to delete Firebase user:", deleteErr);
        }
      }
    }
  };

  return { validateForm, registerUser };
};
