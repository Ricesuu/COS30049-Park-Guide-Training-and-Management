import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/Firebase";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "../src/api/api";

const showToast = (type, title, message) => {
    Toast.show({
        type,
        text1: title,
        text2: message,
        position: "bottom",
        visibilityTime: 4000,
    });
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const checkLockStatus = async (email) => {
    try {
        const response = await apiClient.post("/users/check-login-attempts", {
            email,
        });
        return { blocked: false };
    } catch (error) {
        if (error.response?.status === 423) {
            return {
                blocked: true,
                message: error.response.data.message,
            };
        }
        throw error;
    }
};

const getUserRole = async (token) => {
    try {
        const response = await apiClient.get("/users/login", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        return {
            error: true,
            message: error.response?.data?.message || "Exception occurred while fetching user info",
        };
    }
};

export const useLoginHandler = () => {
    const router = useRouter();
    const [errors, setErrors] = useState({ email: "", password: "" });

    const handleLogin = async (emailInput, passwordInput) => {
        try {
            // Validate inputs
            const validationErrors = validateInputs(emailInput, passwordInput);
            if (validationErrors) {
                setErrors(validationErrors);
                return;
            }

            // Check lock status
            const lockStatus = await checkLockStatus(emailInput);
            if (lockStatus.blocked) {
                showToast("error", "Account Locked", lockStatus.message);
                return;
            }

            // Sign in
            const userCredential = await signInWithEmailAndPassword(
                auth,
                emailInput,
                passwordInput
            );

            // Get token and store it
            const token = await userCredential.user.getIdToken();
            await AsyncStorage.setItem("authToken", token);

            // Get user data
            const userData = await getUserRole(token);
            if (userData.error) {
                throw new Error(userData.message);
            }

            // Store user data
            await AsyncStorage.setItem("userRole", userData.role);
            await AsyncStorage.setItem("userStatus", userData.status);

            // Navigate based on role
            if (userData.status !== "approved") {
                showToast(
                    "error",
                    "Access Denied",
                    "Your account is still pending approval."
                );
                await auth.signOut();
                return;
            }

            const routeMap = {
                admin: "/admin-dashboard",
                park_guide: "/pg-dashboard/with-layout",
            };

            const targetRoute = routeMap[userData.role];
            if (!targetRoute) {
                showToast("error", "Login Failed", "Unrecognized user role.");
                await auth.signOut();
                return;
            }

            router.push(targetRoute);
        } catch (error) {
            handleLoginError(error, setErrors);
        }
    };

    return { handleLogin, errors, setErrors };
};

// Helper functions
const validateInputs = (email, password) => {
    const errors = { email: "", password: "" };
    let hasError = false;

    if (!email) {
        errors.email = "Email is required.";
        hasError = true;
    } else if (!isValidEmail(email)) {
        errors.email = "Please enter a valid email address.";
        hasError = true;
    }

    if (!password) {
        errors.password = "Password is required.";
        hasError = true;
    }

    return hasError ? errors : null;
};

const handleLoginError = (error, setErrors) => {
    console.error("Login error:", error);

    if (error.code === "auth/user-not-found") {
        showToast("error", "Login Failed", "No account found with this email.");
    } else if (error.code === "auth/wrong-password") {
        showToast("error", "Login Failed", "Invalid password.");
    } else if (error.code === "auth/invalid-email") {
        setErrors((prev) => ({
            ...prev,
            email: "Invalid email format.",
        }));
    } else {
        showToast(
            "error",
            "Login Failed",
            error.message || "An unexpected error occurred"
        );
    }
};
