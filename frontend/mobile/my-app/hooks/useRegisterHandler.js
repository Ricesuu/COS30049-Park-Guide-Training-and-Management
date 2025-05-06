import {
    createUserWithEmailAndPassword,
    deleteUser,
    signOut,
  } from "firebase/auth";
  import { auth } from "../lib/Firebase";
  import Toast from "react-native-toast-message";
  import apiClient from "../src/api/api"; // Adjust path if needed
  
  const EMAIL_REGEX = /\S+@\S+\.\S+/;
  const PASSWORD_REGEX =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}[\]:;"'<>,.?/~`\\|-]).{8,}$/;
  
  export const useRegisterHandler = () => {
    // ✅ Validate form fields before submitting
    const validateForm = (form) => {
      const errors = {};
  
      if (!form.firstName?.trim()) {
        errors.firstName = "First name is required";
      }
  
      if (!form.lastName?.trim()) {
        errors.lastName = "Last name is required";
      }
  
      if (!EMAIL_REGEX.test(form.email)) {
        errors.email = "Valid email required";
      }
  
      if (!PASSWORD_REGEX.test(form.password)) {
        errors.password =
          "At least 8 characters with letters, numbers & symbols required.";
      }
  
      if (form.password !== form.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
  
      if (!form.recaptchaToken) {
        errors.recaptcha = "Please complete the reCAPTCHA.";
      }
  
      return errors;
    };
  
    // ✅ Register user with Firebase + your backend
    const registerUser = async (form) => {
      let firebaseUser = null;
  
      try {
        // 🔐 Create Firebase user
        const { user } = await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );
        firebaseUser = user;
  
        // 💾 Save user to backend (reCAPTCHA is verified there)
        await apiClient.post("/users/register", {
          uid: user.uid,
          email: form.email,
          firstName: form.firstName,
          lastName: form.lastName,
          role: "park_guide",
          token: form.recaptchaToken, // backend will verify this
        });
  
        // 🔒 Sign out to await admin approval
        await signOut(auth);
  
        Toast.show({
          type: "success",
          text1: "Registration Successful",
          text2: "Please wait for admin approval",
          position: "bottom",
        });
      } catch (err) {
        const emailConflict =
          err.code === "auth/email-already-in-use" ||
          (err.message && err.message.includes("Duplicate"));
  
        Toast.show({
          type: "error",
          text1: "Registration Failed",
          text2: emailConflict
            ? "This email is already registered."
            : "Something went wrong. Please try again.",
          position: "bottom",
        });
  
        // 🧹 Cleanup Firebase user on failure
        if (firebaseUser) {
          try {
            await deleteUser(firebaseUser);
          } catch (_) {
            // silently ignore cleanup error
          }
        }
      }
    };
  
    return { validateForm, registerUser };
  };
  