import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/Firebase";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

export default function useForgotPasswordHandler() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const router = useRouter();

    const showToast = (type, title, message) => {
        Toast.show({
            type,
            text1: title,
            text2: message,
            position: "bottom",
            visibilityTime: 4000,
        });
    };

    const handleResetError = (error) => {
        switch (error.code) {
            case "auth/invalid-email":
                showToast("error", "Error", "Invalid email format.");
                break;
            case "auth/missing-email":
                showToast("error", "Error", "Please enter your email address.");
                break;
            default:
                showToast(
                    "error",
                    "Error",
                    "Something went wrong. Please try again."
                );
        }
    };

    const handleSubmit = async () => {
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
            showToast(
                "success",
                "Success",
                "If an account with that email exists, a reset link has been sent."
            );

            // Optional: delay navigation so toast can be seen
            // setTimeout(() => router.push("/"), 200);
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
