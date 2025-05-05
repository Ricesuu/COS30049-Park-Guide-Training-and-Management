import {
    createUserWithEmailAndPassword,
    deleteUser,
    signOut,
} from "firebase/auth";
import { auth } from "../lib/Firebase";
import Toast from "react-native-toast-message";
import apiClient from "../src/api/api"; // Import the API client

const EMAIL_REGEX = /\S+@\S+\.\S+/;
const PASSWORD_REGEX =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}[\]:;"'<>,.?/~`\\|-]).{8,}$/;

export const useRegisterHandler = () => {
    const validateForm = (form) => {
        const errors = {};

        if (!form.firstName.trim()) errors.firstName = "First name is required";
        if (!form.lastName.trim()) errors.lastName = "Last name is required";
        if (!EMAIL_REGEX.test(form.email))
            errors.email = "Valid email required";
        if (!PASSWORD_REGEX.test(form.password)) {
            errors.password =
                "At least 8 characters with letters, numbers & symbols required for password.";
        }
        if (form.password !== form.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        return errors;
    };

    const registerUser = async (form) => {
        let firebaseUser = null;

        try {
            const { user } = await createUserWithEmailAndPassword(
                auth,
                form.email,
                form.password
            );
            firebaseUser = user;

            const response = await apiClient.post("/users/register", {
                uid: user.uid,
                email: form.email,
                firstName: form.firstName,
                lastName: form.lastName,
                role: "park_guide",
                approved: false,
            });

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

            if (firebaseUser) {
                try {
                    await deleteUser(firebaseUser);
                } catch (cleanupErr) {
                    //console.error("Failed to delete Firebase user:", cleanupErr);
                }
            }
        }
    };

    return { validateForm, registerUser };
};
