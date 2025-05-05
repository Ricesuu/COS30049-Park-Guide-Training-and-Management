import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/Firebase";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import apiClient from "../src/api/api"; // Import the API client

// Show toast
const showToast = (type, title, message) => {
    Toast.show({
        type,
        text1: title,
        text2: message,
        position: "bottom",
        visibilityTime: 4000,
    });
};

// Regex for email format
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// API: Check if user is locked
const checkLockStatus = async (email) => {
    try {
        const response = await apiClient.post("/users/check-login-attempts", {
            email,
        });
        return { blocked: false };
    } catch (error) {
        const data = error.response?.data || {};
        const status = error.response?.status;

        const errMsg =
            {
                403: data.error?.includes("pending")
                    ? "Your account is still pending approval."
                    : "Your account has been rejected.",
                429: `Too many attempts. Try again in ${Math.ceil(
                    (new Date(data.lockedUntil).getTime() - Date.now()) / 1000
                )} seconds.`,
                404: "No account found with this email.",
            }[status] || "Login is temporarily unavailable";

        return { blocked: true, emailError: errMsg };
    }
};

// API: Record failed login
const recordFailedLogin = async (email) => {
    try {
        const response = await apiClient.post("/users/record-failed-login", {
            email,
        });
        return response.data;
    } catch (error) {
        return {};
    }
};

// API: Get user role
const getUserRole = async (token) => {
    try {
        const response = await apiClient.get("/users/login", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        return {
            error: true,
            message:
                error.response?.data?.message ||
                "Exception occurred while fetching user info",
        };
    }
};

// Hook: useLoginHandler
export const useLoginHandler = () => {
    const router = useRouter();
    const [errors, setErrors] = useState({ email: "", password: "" });

    const handleLogin = async (emailInput, passwordInput) => {
        const email = emailInput.trim();
        const password = passwordInput;

        let newErrors = { email: "", password: "" };

        // ✅ Inline-only validation
        if (!email) {
            newErrors.email = "Email is required.";
        } else if (!isValidEmail(email)) {
            newErrors.email = "Invalid email format.";
        }

        if (!password) {
            newErrors.password = "Password is required.";
        }

        if (newErrors.email || newErrors.password) {
            setErrors(newErrors);
            return;
        }

        // Clear inline errors before backend steps
        setErrors({ email: "", password: "" });

        // ✅ Lock check with toast only
        const lockInfo = await checkLockStatus(email);
        if (lockInfo.blocked) {
            showToast("error", "Login Blocked", lockInfo.emailError);
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            const token = await userCredential.user.getIdToken();

            const userData = await getUserRole(token);

            if (userData.error || !userData?.role) {
                showToast(
                    "error",
                    "Login Failed",
                    userData.message || "Unable to retrieve user data"
                );
                await auth.signOut();
                return;
            }

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
                admin: "/admin-dashboard", // Changed from "/admin" to "/admin-dashboard"
                park_guide: "/park_guide/",
            };

            const targetRoute = routeMap[userData.role];
            if (!targetRoute) {
                showToast("error", "Login Failed", "Unrecognized user role.");
                await auth.signOut();
                return;
            }

            // ✅ Success

            router.push(targetRoute);
        } catch (err) {
            if (err.code === "auth/user-not-found") {
                showToast(
                    "error",
                    "Login Failed",
                    "No account found with this email."
                );
                return;
            }

            if (
                [
                    "auth/invalid-credential",
                    "auth/wrong-password",
                    "auth/invalid-email",
                ].includes(err.code)
            ) {
                const failData = await recordFailedLogin(email);
                if (failData.remainingAttempts !== undefined) {
                    showToast(
                        "error",
                        "Incorrect Password",
                        `Invalid password. ${
                            failData.remainingAttempts
                        } attempt${
                            failData.remainingAttempts !== 1 ? "s" : ""
                        } left.`
                    );
                } else if (failData.lockedUntil) {
                    showToast(
                        "error",
                        "Account Locked",
                        "Too many failed login attempts. Try again later."
                    );
                } else {
                    showToast(
                        "error",
                        "Login Failed",
                        "Invalid email or password."
                    );
                }
                return;
            }

            showToast(
                "error",
                "Login Failed",
                "Login failed. Please try again."
            );
        }
    };

    return { handleLogin, errors, setErrors };
};
