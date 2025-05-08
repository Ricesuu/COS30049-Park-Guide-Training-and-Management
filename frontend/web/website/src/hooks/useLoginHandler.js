import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase";
import { toast } from "react-toastify";

// Show error toast
const showError = (message) => {
  toast.error(message, { autoClose: 4000 });
};

// Check backend login status (lockout, approval)
const checkLockStatus = async (email) => {
  try {
    const res = await fetch("http://localhost:3000/api/users/check-login-attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 403 && data.error?.includes("pending")) {
        showError("Your account is still pending approval.");
      } else if (res.status === 403) {
        showError("Your account has been rejected.");
      } else if (res.status === 429) {
        const seconds = Math.ceil(
          (new Date(data.lockedUntil).getTime() - Date.now()) / 1000
        );
        showError(`Too many attempts. Try again in ${seconds} seconds.`);
      } else if (res.status === 404) {
        showError("No account found with this email.");
      } else {
        showError("Login is temporarily unavailable.");
      }

      return { blocked: true };
    }

    return data;
  } catch (err) {
    console.error("checkLockStatus error:", err);
    showError("Login check failed. Please try again.");
    return { blocked: true };
  }
};

// Record a failed login attempt
const recordFailedLogin = async (email) => {
  try {
    const res = await fetch("http://localhost:3000/api/users/record-failed-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  } catch (err) {
    console.error("Failed login tracking error:", err);
    return {};
  }
};

// Fetch user role/status using ID token
const getUserRole = async (token) => {
  try {
    const res = await fetch("http://localhost:3000/api/users/login", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { error: true, message: errorData.message || "Failed to fetch user info" };
    }

    return await res.json();
  } catch (err) {
    console.error("Role fetch error:", err);
    return { error: true, message: "Exception occurred while fetching user info" };
  }
};

export const useLoginHandler = () => {
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    if (!email || !password) {
      showError("Please enter both email and password");
      return;
    }

    const lockInfo = await checkLockStatus(email);
    if (lockInfo.blocked) return;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      const userData = await getUserRole(token);

      if (userData.error) {
        showError(userData.message || "Unable to retrieve user data");
        await auth.signOut();
        return;
      }

      if (!userData?.role) {
        showError("User role not found");
        await auth.signOut();
        return;
      }

      if (userData.status !== "approved") {
        showError("Your account is still pending approval. Please wait for admin approval.");
        await auth.signOut();
        return;
      }

      switch (userData.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "park_guide":
          navigate("/park-guide/dashboard");
          break;
        default:
          showError("Unrecognized user role");
          await auth.signOut();
      }
    } catch (err) {
      console.error("Login error:", err);

      // Firebase-specific: user not found
      if (err.code === "auth/user-not-found") {
        showError("No account found with this email. Please register first.");
        return;
      }

      // Firebase: invalid credentials (email or password wrong), wrong password, or malformed email
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-email"
      ) {
        const failData = await recordFailedLogin(email);
        if (failData.remainingAttempts !== undefined) {
          showError(
            `Invalid password. ${failData.remainingAttempts} attempt${failData.remainingAttempts !== 1 ? "s" : ""} left.`
          );
        } else if (failData.lockedUntil) {
          showError("Too many failed login attempts. Try again later.");
        } else {
          showError("Invalid email or password.");
        }
        return;
      }

      // Fallback
      showError("Login failed. Please try again.");
    }
  };

  return { handleLogin };
};
